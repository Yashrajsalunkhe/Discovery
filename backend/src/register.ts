import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { sendWelcomeEmail } from './utils/mail.js';
import { getNextRegistrationId } from './utils/atomicCounter.js';
import { guaranteedQueueWrite } from './utils/guaranteedQueue.js';
import Razorpay from 'razorpay';
import { Payment, type PaymentRegistrationContext } from './utils/payment.js';

dotenv.config();

// Disable buffering globally to prevent timeout issues in serverless
mongoose.set('bufferCommands', false);
mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export async function connectToMongoDB(): Promise<typeof mongoose> {
  if (global.mongooseConnection?.conn) {
    return global.mongooseConnection.conn;
  }
  if (!global.mongooseConnection) {
    global.mongooseConnection = { conn: null, promise: null };
  }
  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = (async (): Promise<typeof mongoose> => {
      
      while (true) {
        try {
          const instance = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'discovery_adcet',
            serverSelectionTimeoutMS: 10000, // 10 seconds - faster failure detection
            socketTimeoutMS: 15000, // 15 seconds - reduced from 20s
            connectTimeoutMS: 10000, // 10 seconds - reduced from 15s
            heartbeatFrequencyMS: 300000, // 5 minutes
            maxPoolSize: 5,   // Reduced pool size for serverless
            minPoolSize: 1,   // Minimum connections for serverless
            maxIdleTimeMS: 180000, // 3 minutes - shorter for serverless
            waitQueueTimeoutMS: 3000, // 3 second wait for connection from pool
            retryWrites: true,
            retryReads: true,
            w: 'majority',
            // Serverless optimizations
            compressors: 'none', // Disable compression for faster connection
            readPreference: 'primary',
            // Add buffering control
            bufferCommands: false
          });
          global.mongooseConnection!.conn = instance;
          console.log('✅ Connected to MongoDB database: discovery_adcet');
          return instance;
        } catch (err) {
          console.error('❌ MongoDB connection failed, retrying in 2s', err);
          await new Promise(res => setTimeout(res, 2000)); // Reduced retry delay
        }
      }
    })();
  }
  return global.mongooseConnection.promise as Promise<typeof mongoose>;
}

interface RegistrationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  registrationId: number;
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
  teamMembers: Array<{
    name: string;
    college: string;
    mobile?: string;
    email?: string;
  }>;
  paymentId: string;
  orderId: string;
  signature: string;
  totalFee: number;
  createdAt: Date;
}

const teamMemberSchema = new Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  mobile: { type: String, required: false },
  email: { type: String, required: false }
});

const registrationSchema = new Schema<RegistrationDoc>({
  registrationId: { type: Number, unique: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true },
  leaderMobile: { type: String, required: true },
  leaderCollege: { type: String, required: true },
  leaderDepartment: { type: String, required: true },
  leaderYear: { type: String, required: true },
  leaderCity: { type: String, required: true },
  selectedEvent: { type: String, required: true },
  paperPresentationDept: { type: String },
  participationType: { type: String, enum: ['solo', 'team'], required: true },
  teamSize: { type: Number, required: true },
  teamMembers: { type: [teamMemberSchema], default: [] },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  totalFee: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

registrationSchema.index({ paymentId: 1 }, { unique: true });
registrationSchema.index({ orderId: 1 }, { unique: true });

export const Registration = mongoose.model<RegistrationDoc>('Registration', registrationSchema, 'registrations');

// Enhanced registration function with atomic operations, transactions, and retry logic
export const saveRegistrationWithRetry = async (registrationData: any, maxRetries = 5): Promise<RegistrationDoc> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const session = await mongoose.startSession();
    
    try {
      let saved: RegistrationDoc;
      
      await session.withTransaction(async () => {
        // Get atomic registration ID
        const registrationId = await getNextRegistrationId();
        
        const registration = new Registration({
          ...registrationData,
          registrationId
        });
        
        // Save within transaction
        const result = await registration.save({ session });
        saved = result;
        
        console.log(`Registration saved successfully on attempt ${attempt}:`, registrationId);
      }, {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority', j: true }
      });
      
      return saved!;
      
    } catch (error: any) {
      lastError = error;
      console.error(`Registration save attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      // If it's a duplicate key error and not the last attempt, retry with exponential backoff
      if (error.code === 11000 && attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Cap at 5 seconds
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }
      
      // For other errors or final attempt, throw immediately
      throw error;
    } finally {
      await session.endSession();
    }
  }
  
  throw lastError!;
};

export async function processPaidOrder(
  orderId: string,
  paymentId: string,
  signature: string,
  registrationData?: PaymentRegistrationContext
): Promise<{ registrationId?: number; pending?: boolean }> {
  await connectToMongoDB();
  const paymentRecord = await Payment.findOne({ orderId });
  if (!paymentRecord) throw new Error('PAYMENT_RECORD_NOT_FOUND');

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
  });
  const [order, payment] = await Promise.all([
    razorpay.orders.fetch(orderId),
    razorpay.payments.fetch(paymentId)
  ]);

  if (payment.order_id !== orderId || payment.amount !== order.amount || order.amount !== paymentRecord.amount || payment.currency !== order.currency) {
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { status: 'MISMATCHED', registrationStatus: 'FAILED' } });
    console.error('PAYMENT_AMOUNT_MISMATCH', { orderId, paymentId });
    throw new Error('PAYMENT_AMOUNT_MISMATCH');
  }

  if (payment.status !== 'captured' || order.status !== 'paid') {
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { status: payment.status === 'authorized' ? 'AUTHORIZED' : 'CREATED', registrationStatus: 'PENDING' } });
    return { pending: true };
  }

  const existing = await Registration.findOne({ $or: [{ paymentId }, { orderId }] });
  if (existing) {
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { paymentId, status: 'CAPTURED', registrationStatus: 'CONFIRMED', registrationId: existing.registrationId } });
    console.log('REGISTRATION_ALREADY_EXISTS', { orderId, paymentId, registrationId: existing.registrationId });
    return { registrationId: existing.registrationId };
  }

  const context = paymentRecord.registrationData || registrationData;
  if (!context) {
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { status: 'CAPTURED', registrationStatus: 'PENDING', paymentId } });
    return { pending: true };
  }

  const claimed = await Payment.findOneAndUpdate(
    { _id: paymentRecord._id, registrationStatus: 'PENDING' },
    { $set: { paymentId, status: 'CAPTURED', registrationStatus: 'PROCESSING' } },
    { new: true }
  );
  if (!claimed) {
    const confirmed = await Registration.findOne({ $or: [{ paymentId }, { orderId }] });
    return confirmed ? { registrationId: confirmed.registrationId } : { pending: true };
  }

  try {
    const saved = await saveRegistrationWithRetry({ ...context, paymentId, orderId, signature: signature || `webhook:${paymentId}` }, 5);
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { registrationStatus: 'CONFIRMED', registrationId: saved.registrationId } });
    console.log('REGISTRATION_CONFIRMED', { orderId, paymentId, registrationId: saved.registrationId });
    sendWelcomeEmail(saved.leaderEmail, saved.registrationId.toString(), saved.leaderName, saved.leaderYear, saved.leaderMobile, saved.selectedEvent, saved.leaderCollege)
      .catch(error => console.error('EMAIL_FAILED', { registrationId: saved.registrationId, error }));
    return { registrationId: saved.registrationId };
  } catch (error: any) {
    await Payment.updateOne({ _id: paymentRecord._id }, { $set: { status: 'CAPTURED', registrationStatus: 'PENDING', paymentId } });
    await guaranteedQueueWrite(paymentId, orderId, signature || `webhook:${paymentId}`, context);
    console.error('REGISTRATION_PROCESSING_FAILED', { orderId, paymentId, error: error.message });
    return { pending: true };
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const { 
      leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment, 
      leaderYear, leaderCity, selectedEvent, paperPresentationDept, 
      participationType, teamSize, teamMembers, paymentId, orderId, signature, totalFee
    } = req.body;
    
    // Mandatory payment validation
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment details are required. Registration cannot proceed without completing payment.' 
      });
    }

    // Validate payment IDs format (basic check)
    if (!paymentId.startsWith('pay_') || !orderId.startsWith('order_')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payment details. Please complete payment through the authorized gateway.' 
      });
    }

    // Validate total fee
    if (!totalFee || totalFee <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid fee amount. Registration requires payment.' 
      });
    }
    
    const normalizedData = {
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
      leaderMobile: leaderMobile.trim(),
      leaderCollege: leaderCollege.trim(),
      leaderDepartment: leaderDepartment.trim(),
      leaderYear: leaderYear.trim(),
      leaderCity: leaderCity.trim(),
      selectedEvent: selectedEvent.trim(),
      paperPresentationDept: paperPresentationDept?.trim() || '',
      participationType,
      teamSize: Number(teamSize),
      teamMembers: (teamMembers || []).map((member: any) => ({
        name: member.name.trim(),
        college: member.college.trim(),
        mobile: member.mobile?.trim() || '',
        email: member.email?.trim().toLowerCase() || ''
      })),
      paymentId,
      orderId,
      signature,
      totalFee: Number(totalFee)
    };

    const processed = await processPaidOrder(orderId, paymentId, signature, normalizedData);
    if (processed.registrationId) {
      return res.status(201).json({
        success: true,
        message: 'Registration completed successfully',
        registrationId: processed.registrationId,
        processed: 'immediately'
      });
    }

    return res.status(202).json({
      success: true,
      code: 'REGISTRATION_PENDING',
      message: 'Payment received successfully. Your registration is being confirmed. Please do not make another payment.',
      processed: 'queued'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
};