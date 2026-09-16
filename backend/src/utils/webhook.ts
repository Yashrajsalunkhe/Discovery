import { RequestHandler } from 'express';
import crypto from 'crypto';
import { Payment, PaymentWebhookEvent } from './payment.js';
import { connectToMongoDB, processPaidOrder } from '../register.js';
import { guaranteedQueueWrite } from './guaranteedQueue.js';

interface RawBodyRequest extends Express.Request {
  rawBody?: Buffer;
}

const getEntity = (body: any, type: 'payment' | 'order') => body?.payload?.[type]?.entity;

/**
 * Wait for the Payment record to appear in the database.
 * Handles the race condition where Razorpay's webhook fires before
 * the POST /api/order endpoint finishes writing the Payment document.
 */
const waitForPaymentRecord = async (
  orderId: string,
  paymentId: string,
  eventId: string,
  maxRetries = 3,
  delayMs = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { $set: { paymentId, razorpayEventId: eventId } },
      { new: true }
    );

    if (payment) {
      if (attempt > 1) {
        console.log(`PAYMENT_RECORD_FOUND after ${attempt} attempts`, { orderId, paymentId });
      }
      return payment;
    }

    if (attempt < maxRetries) {
      console.log(`PAYMENT_RECORD_NOT_READY, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`, { orderId, paymentId });
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return null;
};

export const razorpayWebhook: RequestHandler = async (req, res) => {
  const rawBody = (req as RawBodyRequest).rawBody;
  const signature = req.header('x-razorpay-signature');
  const eventId = req.header('x-razorpay-event-id');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!rawBody || !signature || !eventId || !secret) {
    return res.status(400).json({ success: false, error: 'Invalid webhook request' });
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const validSignature = signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!validSignature) {
    console.error('PAYMENT_SIGNATURE_INVALID', { eventId });
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Signature is valid — from this point on, ALWAYS return 200 to Razorpay.
  // Returning 5xx risks Razorpay throttling/blacklisting our webhook endpoint.
  // Any internal failures are handled via logging + guaranteed queue fallback.
  // ──────────────────────────────────────────────────────────────────────

  try {
    await connectToMongoDB();
    const existingEvent = await PaymentWebhookEvent.findOne({ eventId }).lean();
    if (existingEvent) {
      return res.status(200).json({ success: true, duplicate: true });
    }

    const paymentEntity = getEntity(req.body, 'payment');
    const orderEntity = getEntity(req.body, 'order');
    const paymentId = paymentEntity?.id;
    const orderId = paymentEntity?.order_id || orderEntity?.id;

    console.log('PAYMENT_WEBHOOK_RECEIVED', { event: req.body?.event, eventId, orderId, paymentId });

    if (req.body?.event === 'payment.failed') {
      if (orderId) {
        await Payment.findOneAndUpdate(
          { orderId },
          {
            $set: {
              paymentId,
              status: 'FAILED',
              registrationStatus: 'NOT_CREATED',
              razorpayEventId: eventId
            }
          }
        );
      }
      await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
      return res.status(200).json({ success: true, status: 'PAYMENT_FAILED' });
    }

    if (!['payment.captured', 'order.paid', 'payment.authorized'].includes(req.body?.event) || !orderId || !paymentId) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // Retry loop: wait for Payment record if it hasn't been written yet (race condition)
    const payment = await waitForPaymentRecord(orderId, paymentId, eventId);

    if (!payment) {
      // Payment record still not found after retries.
      // Log the event so it's not lost — the guaranteed queue or browser path will handle it.
      console.error('PAYMENT_RECORD_MISSING_AFTER_RETRIES', { orderId, paymentId, eventId });
      await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
      return res.status(200).json({ success: true, status: 'PAYMENT_RECORD_PENDING', message: 'Payment record not yet available, event logged for later processing' });
    }

    if (req.body.event === 'payment.authorized') {
      await Payment.updateOne({ _id: payment._id }, { $set: { status: 'AUTHORIZED', registrationStatus: 'PENDING' } });
      await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
      return res.status(200).json({ success: true, status: 'PAYMENT_AUTHORIZED' });
    }

    const result = await processPaidOrder(orderId, paymentId, `webhook:${eventId}`);
    await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
    return res.status(200).json({ success: true, status: result.registrationId ? 'REGISTRATION_CONFIRMED' : 'REGISTRATION_PENDING', registrationId: result.registrationId });
  } catch (error: any) {
    console.error('WEBHOOK_PROCESSING_FAILED', { eventId, error: error.message, stack: error.stack });

    // Best-effort: save event + queue the registration so it isn't lost
    try {
      const paymentEntity = getEntity(req.body, 'payment');
      const orderEntity = getEntity(req.body, 'order');
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id || orderEntity?.id;

      await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });

      // If we have a payment record with registration data, queue it for guaranteed processing
      if (orderId && paymentId) {
        const paymentRecord = await Payment.findOne({ orderId }).lean();
        if (paymentRecord?.registrationData) {
          await guaranteedQueueWrite(paymentId, orderId, `webhook:${eventId}`, paymentRecord.registrationData);
          console.log('WEBHOOK_FAILURE_QUEUED', { orderId, paymentId, eventId });
        }
      }
    } catch (fallbackError) {
      console.error('WEBHOOK_FALLBACK_ALSO_FAILED', { eventId, error: fallbackError });
    }

    // Always return 200 after valid signature — never let Razorpay think delivery failed
    return res.status(200).json({ success: true, status: 'ACCEPTED_FOR_RETRY', message: 'Event acknowledged, processing deferred' });
  }
};
