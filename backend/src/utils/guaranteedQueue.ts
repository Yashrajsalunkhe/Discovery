import mongoose, { Schema, Document } from 'mongoose';

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
export const guaranteedQueueWrite = async (
  paymentId: string,
  orderId: string, 
  signature: string,
  registrationData: any,
  maxRetries = 10
): Promise<string> => {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const pendingReg = new PendingRegistration({
        paymentId,
        orderId,
        signature,
        registrationData,
        status: 'pending'
      });

      // Use mongoose connection with write concern
      const saved = await pendingReg.save();
      
      // Verify the save with a read-back
      const verified = await PendingRegistration.findById(saved._id);
      if (!verified) {
        throw new Error('Save verification failed - document not found after save');
      }

      console.log(`Payment ${paymentId} queued successfully for processing`);
      return saved._id.toString();
      
    } catch (error: any) {
      lastError = error;
      console.error(`Queue write attempt ${attempt}/${maxRetries} failed for payment ${paymentId}:`, error.message);
      
      // For duplicate key (payment already queued), that's actually success
      if (error.code === 11000 && error.message.includes('paymentId')) {
        console.log(`Payment ${paymentId} already queued - that's OK`);
        const existing = await PendingRegistration.findOne({ paymentId });
        return existing!._id.toString();
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // CRITICAL: If we can't even save to the queue, we have a major problem
  console.error(`CRITICAL FAILURE: Cannot queue payment ${paymentId} after ${maxRetries} attempts`);
  throw new Error(`Failed to guarantee payment persistence: ${lastError.message}`);
};

/**
 * Process pending registrations with guaranteed completion
 */
export const processGuaranteedQueue = async (instanceId: string = `proc_${Date.now()}`) => {
  const maxProcessingTime = 5 * 60 * 1000; // 5 minutes max per item
  
  try {
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
};