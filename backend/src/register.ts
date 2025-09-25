import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { sendWelcomeEmail } from './utils/mail.js';
import { getNextRegistrationId } from './utils/atomicCounter.js';
import { guaranteedQueueWrite, processGuaranteedQueue } from './utils/guaranteedQueue.js';

dotenv.config();

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
      // Disable buffering to prevent timeout issues
      mongoose.set('bufferCommands', false);
      mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');
      
      while (true) {
        try {
          const instance = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'discovery_adcet',
            serverSelectionTimeoutMS: 15000, // 15 seconds - reduced for faster failure
            socketTimeoutMS: 20000, // 20 seconds 
            connectTimeoutMS: 15000, // 15 seconds
            heartbeatFrequencyMS: 300000,
            maxPoolSize: 10,  // Reduced pool size for serverless
            minPoolSize: 2,   // Minimum connections
            retryWrites: true,
            retryReads: true,
            w: 'majority',
            // Additional serverless-friendly options
            maxIdleTimeMS: 300000,
            waitQueueTimeoutMS: 5000, // 5 second wait for connection from pool
            // Force close connections that may be stale
            compressors: 'none', // Disable compression for faster connection
            readPreference: 'primary'
          });
          global.mongooseConnection!.conn = instance;
          console.log('✅ Connected to MongoDB database: discovery_adcet');
          return instance;
        } catch (err) {
          console.error('❌ MongoDB connection failed, retrying in 3s', err);
          await new Promise(res => setTimeout(res, 3000)); // Reduced retry delay
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
    
    // 🔒 GUARANTEED APPROACH: First save to persistent queue
    try {
      // Step 1: GUARANTEED write to queue (this MUST succeed for successful payment)
      const queueId = await guaranteedQueueWrite(paymentId, orderId, signature, normalizedData);
      console.log(`✅ Payment ${paymentId} guaranteed in queue with ID: ${queueId}`);
      
      // Step 2: Try immediate processing (best case - user gets instant response)
      try {
        const saved = await saveRegistrationWithRetry(normalizedData, 3); // Quick attempt with fewer retries
        
        // Mark as completed in queue
        const { PendingRegistration } = await import('./utils/guaranteedQueue.js');
        await PendingRegistration.updateOne(
          { paymentId },
          { 
            $set: { 
              status: 'completed', 
              completedAt: new Date() 
            } 
          }
        );
        
        console.log(`🚀 INSTANT SUCCESS: Payment ${paymentId} processed immediately as registration ${saved.registrationId}`);
        
        // Send welcome email (non-blocking)
        sendWelcomeEmail(
          saved.leaderEmail,
          saved.registrationId.toString(),
          saved.leaderName,
          saved.leaderYear,
          saved.leaderMobile,
          saved.selectedEvent,
          saved.leaderCollege
        ).catch(emailError => {
          console.error('Email failed for registration:', saved.registrationId, emailError);
        });
        
        return res.status(201).json({ 
          success: true, 
          message: 'Registration completed successfully',
          registrationId: saved.registrationId,
          processed: 'immediately'
        });
        
      } catch (immediateError: any) {
        console.log(`⏳ Payment ${paymentId} queued for background processing (immediate processing failed):`, immediateError.message);
        
        // Start background processing (non-blocking)
        processGuaranteedQueue().catch(err => {
          console.error('Background processing error:', err);
        });
        
        return res.status(202).json({ 
          success: true, 
          message: 'Payment received and queued for processing. You will receive confirmation email shortly.',
          queueId,
          processed: 'queued'
        });
      }
      
    } catch (queueError) {
      // CRITICAL: If we can't even queue a successful payment, this is a major system failure
      console.error(`🔴 CRITICAL SYSTEM FAILURE: Cannot guarantee payment ${paymentId}:`, queueError);
      
      // Last-ditch effort - try direct save with maximum retries
      try {
        const saved = await saveRegistrationWithRetry(normalizedData, 10);
        console.log(`🆘 EMERGENCY SAVE SUCCESS: Payment ${paymentId} saved via emergency path as registration ${saved.registrationId}`);
        
        return res.status(201).json({ 
          success: true, 
          message: 'Registration completed via emergency processing',
          registrationId: saved.registrationId,
          processed: 'emergency'
        });
        
      } catch (emergencyError) {
        console.error(`💀 TOTAL SYSTEM FAILURE: Payment ${paymentId} cannot be processed:`, emergencyError);
        
        // Return error but with clear message that payment issue needs manual resolution
        return res.status(500).json({ 
          success: false, 
          error: 'System temporarily unavailable. Your payment is safe - please contact support with your payment ID for manual processing.',
          paymentId,
          orderId,
          code: 'SYSTEM_FAILURE_MANUAL_INTERVENTION_REQUIRED'
        });
      }
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
};