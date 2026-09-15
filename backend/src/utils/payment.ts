import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'MISMATCHED';
export type RegistrationStatus = 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED' | 'NOT_CREATED';

export interface PaymentRegistrationContext {
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: Array<{ name: string; college: string; mobile?: string; email?: string }>;
  totalFee: number;
}

export interface PaymentDoc extends Document {
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  registrationStatus: RegistrationStatus;
  registrationData?: PaymentRegistrationContext;
  razorpayEventId?: string;
  registrationId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDoc>({
  orderId: { type: String, required: true, unique: true, index: true },
  paymentId: { type: String, unique: true, sparse: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, uppercase: true },
  status: {
    type: String,
    enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'MISMATCHED'],
    required: true,
    default: 'CREATED'
  },
  registrationStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'CONFIRMED', 'FAILED', 'NOT_CREATED'],
    required: true,
    default: 'PENDING'
  },
  registrationData: { type: Schema.Types.Mixed },
  razorpayEventId: { type: String, unique: true, sparse: true, index: true },
  registrationId: { type: Number, index: true }
}, { timestamps: true, collection: 'payments' });

export const Payment = mongoose.model<PaymentDoc>('Payment', paymentSchema);

export interface PaymentWebhookEventDoc extends Document {
  eventId: string;
  event: string;
  orderId?: string;
  paymentId?: string;
  receivedAt: Date;
}

const paymentWebhookEventSchema = new Schema<PaymentWebhookEventDoc>({
  eventId: { type: String, required: true, unique: true, index: true },
  event: { type: String, required: true },
  orderId: { type: String, index: true },
  paymentId: { type: String, index: true },
  receivedAt: { type: Date, default: Date.now }
}, { collection: 'payment_webhook_events' });

export const PaymentWebhookEvent = mongoose.model<PaymentWebhookEventDoc>('PaymentWebhookEvent', paymentWebhookEventSchema);
