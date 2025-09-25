import mongoose, { Schema, Document } from 'mongoose';
import { ensureMongoConnection, getConnectionStatus } from './mongoHealth.js';

export interface PendingRegistrationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  paymentId: string;
  orderId: string;
  signature: string;
  registrationData: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  lastAttemptAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  processingBy?: string; // Instance ID for distributed processing
  lockExpiresAt?: Date;
}

const pendingRegistrationSchema = new Schema<PendingRegistrationDoc>({
  paymentId: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true, index: true },
  signature: { type: String, required: true },
  registrationData: { type: Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending',
    index: true
  },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 10 }, // Increased max attempts
  createdAt: { type: Date, default: Date.now, index: true },
  lastAttemptAt: { type: Date },
  completedAt: { type: Date },
  errorMessage: { type: String },
  processingBy: { type: String }, // For distributed processing
  lockExpiresAt: { type: Date, index: true }
});

// TTL index to auto-delete completed items after 24 hours
pendingRegistrationSchema.index({ completedAt: 1 }, { 
  expireAfterSeconds: 86400,
  partialFilterExpression: { status: 'completed' }
});

// Index for finding items to process
pendingRegistrationSchema.index({ 
  status: 1, 
  attempts: 1, 
  createdAt: 1 
});

export const PendingRegistration = mongoose.model<PendingRegistrationDoc>(
  'PendingRegistration', 
  pendingRegistrationSchema, 
  'pending_registrations'
);

/**
 * Guaranteed write to pending queue - this MUST succeed
 */
export async function guaranteedQueueWrite(
  paymentId: string,
  orderId: string, 
  signature: string,
  registrationData: any
): Promise<boolean> {
  try {
    // Ensure MongoDB connection is healthy
    const isConnected = await ensureMongoConnection();
    if (!isConnected) {
      console.error('❌ MongoDB connection health check failed before queue write');
      return false;
    }

    const queueItem = new PendingRegistration({
      paymentId,
      orderId,
      signature,
      registrationData,
      status: 'pending',
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date()
    });

    await queueItem.save();
    console.log(`✅ Payment ${paymentId} queued for guaranteed processing`);
    return true;
  } catch (error) {
    console.error('❌ Failed to write to guaranteed queue:', error);
    return false;
  }
}

/**
 * Process pending registrations with guaranteed completion
 */
export const processGuaranteedQueue = async (instanceId: string = `proc_${Date.now()}`) => {
  const maxProcessingTime = 5 * 60 * 1000; // 5 minutes max per item
  
  try {
    // Ensure MongoDB connection is healthy before processing
    const isConnected = await ensureMongoConnection();
    if (!isConnected) {
      const error = `MongoDB connection health check failed - status: ${getConnectionStatus()}`;
      console.error('❌', error);
      throw new Error(error);
    }
    
    console.log('✅ MongoDB connection verified for queue processing');
    
    // Find items to process (not currently locked or lock expired)
    const now = new Date();
    const cutoff = new Date(now.getTime() - maxProcessingTime);
    
    const itemsToProcess = await PendingRegistration.find({
      $and: [
        {
          $or: [
            { status: 'pending' },
            { 
              status: 'processing', 
              lockExpiresAt: { $lt: now } // Lock expired
            },
            {
              status: 'failed',
              attempts: { $lt: 10 } // Retry failed items
            }
          ]
        },
        { attempts: { $lt: 10 } } // Don't process items that have exceeded max attempts
      ]
    }).sort({ createdAt: 1 }).limit(50); // Process oldest first, limit batch size

    console.log(`Found ${itemsToProcess.length} items to process`);

    for (const item of itemsToProcess) {
      await processIndividualRegistration(item, instanceId);
    }

  } catch (error) {
    console.error('Queue processing error:', error);
    throw error; // Re-throw to let caller handle
  }
};

/**
 * Process a single registration with guaranteed persistence
 */
const processIndividualRegistration = async (
  item: PendingRegistrationDoc, 
  instanceId: string
): Promise<void> => {
  const lockExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minute lock

  try {
    // Atomic lock acquisition
    const lockResult = await PendingRegistration.updateOne(
      { 
        _id: item._id,
        $or: [
          { status: 'pending' },
          { status: 'failed' },
          { 
            status: 'processing',
            lockExpiresAt: { $lt: new Date() }
          }
        ]
      },
      {
        $set: {
          status: 'processing',
          processingBy: instanceId,
          lockExpiresAt: lockExpiry,
          lastAttemptAt: new Date()
        },
        $inc: { attempts: 1 }
      }
    );

    if (lockResult.matchedCount === 0) {
      // Someone else is processing this item
      return;
    }

    console.log(`Processing payment ${item.paymentId} (attempt ${item.attempts + 1})`);

    // Import the registration function
    const { saveRegistrationWithRetry } = await import('../register.js');
    
    // Process the registration with maximum retry attempts
    const savedRegistration = await saveRegistrationWithRetry(item.registrationData, 10);
    
    // Mark as completed
    await PendingRegistration.updateOne(
      { _id: item._id },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          processingBy: undefined,
          lockExpiresAt: undefined
        }
      }
    );

    console.log(`✅ Payment ${item.paymentId} successfully processed as registration ${savedRegistration.registrationId}`);

    // Send welcome email (non-blocking)
    try {
      const { sendWelcomeEmail } = await import('./mail.js');
      sendWelcomeEmail(
        savedRegistration.leaderEmail,
        savedRegistration.registrationId.toString(),
        savedRegistration.leaderName,
        savedRegistration.leaderYear,
        savedRegistration.leaderMobile,
        savedRegistration.selectedEvent,
        savedRegistration.leaderCollege
      ).catch(emailError => {
        console.error(`Email failed for registration ${savedRegistration.registrationId}:`, emailError);
      });
    } catch (emailImportError) {
      console.error('Could not import email function:', emailImportError);
    }

  } catch (error: any) {
    console.error(`❌ Failed to process payment ${item.paymentId}:`, error.message);

    // Update with failure info
    const updateData: any = {
      lastAttemptAt: new Date(),
      errorMessage: error.message,
      processingBy: undefined,
      lockExpiresAt: undefined
    };

    // If we've exceeded max attempts, mark as permanently failed
    if (item.attempts >= 9) { // attempts is incremented before processing
      updateData.status = 'failed';
      console.error(`🔴 PERMANENTLY FAILED: Payment ${item.paymentId} after ${item.attempts + 1} attempts`);
    } else {
      updateData.status = 'pending'; // Will be retried
    }

    await PendingRegistration.updateOne(
      { _id: item._id },
      { $set: updateData }
    );
  }
};

/**
 * Get queue statistics
 */
export const getQueueStats = async () => {
  try {
    // Ensure MongoDB connection is healthy before getting stats
    const isConnected = await ensureMongoConnection();
    if (!isConnected) {
      const error = `MongoDB connection health check failed - status: ${getConnectionStatus()}`;
      console.error('❌', error);
      throw new Error(error);
    }
    
    const stats = await PendingRegistration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result: any = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    // Add some additional metrics
    const oldestPending = await PendingRegistration.findOne(
      { status: 'pending' },
      { createdAt: 1 },
      { sort: { createdAt: 1 } }
    );

    return {
      ...result,
      total: result.pending + result.processing + result.completed + result.failed,
      oldestPendingAge: oldestPending ? Date.now() - oldestPending.createdAt.getTime() : 0
    };
  } catch (error) {
    console.error('Error getting queue stats:', error);
    // Return safe defaults if database is unavailable
    return {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      total: 0,
      oldestPendingAge: 0,
      error: error instanceof Error ? error.message : 'Database unavailable'
    };
  }
};