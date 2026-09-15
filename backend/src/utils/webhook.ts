import { RequestHandler } from 'express';
import crypto from 'crypto';
import { Payment, PaymentWebhookEvent } from './payment.js';
import { connectToMongoDB, processPaidOrder } from '../register.js';

interface RawBodyRequest extends Express.Request {
  rawBody?: Buffer;
}

const getEntity = (body: any, type: 'payment' | 'order') => body?.payload?.[type]?.entity;

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

    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { $set: { paymentId, razorpayEventId: eventId } },
      { new: true }
    );

    if (!payment) {
      console.error('PAYMENT_RECORD_MISSING', { orderId, paymentId });
      return res.status(500).json({ success: false, error: 'Payment order record is not available yet' });
    }

    if (req.body.event === 'payment.authorized') {
      await Payment.updateOne({ _id: payment._id }, { $set: { status: 'AUTHORIZED', registrationStatus: 'PENDING' } });
      await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
      return res.status(200).json({ success: true, status: 'PAYMENT_AUTHORIZED' });
    }

    const result = await processPaidOrder(orderId, paymentId, `webhook:${eventId}`);
    await PaymentWebhookEvent.create({ eventId, event: req.body?.event || 'unknown', orderId, paymentId });
    return res.status(200).json({ success: true, status: result.registrationId ? 'REGISTRATION_CONFIRMED' : 'REGISTRATION_PENDING', registrationId: result.registrationId });
  } catch (error) {
    console.error('REGISTRATION_PROCESSING_FAILED', { eventId, error });
    return res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
};
