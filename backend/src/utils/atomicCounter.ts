import mongoose, { Schema, Document } from 'mongoose';
import { ensureMongoConnection } from './mongoHealth.js';

interface CounterDoc extends Document {
  _id: string;
  sequence_value: number;
}

const counterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1000 }
});

export const Counter = mongoose.model<CounterDoc>('Counter', counterSchema, 'counters');

export async function getNextRegistrationId(): Promise<number> {
  try {
    // Ensure MongoDB connection before operation
    const isConnected = await ensureMongoConnection();
    if (!isConnected) {
      throw new Error('MongoDB connection failed for counter operation');
    }

    // Use findOneAndUpdate with upsert for atomic increment
    const result = await Counter.findOneAndUpdate(
      { _id: 'registrationId' },
      { $inc: { sequence_value: 1 } },
      { 
        new: true, 
        upsert: true,
        // Use write concern for consistency
        writeConcern: { w: 'majority', j: true },
        // Add timeout to prevent hanging
        maxTimeMS: 5000
      }
    );
    
    return result.sequence_value;
  } catch (error) {
    console.error('Error generating registration ID:', error);
    // Fallback to timestamp-based ID to avoid complete failure
    return Date.now() % 100000 + 10000;
  }
}

/**
 * SAFE INITIALIZATION - Call this once during deployment
 * This ensures the counter starts ABOVE your highest existing registration ID
 */
export async function initializeCounterSafely(): Promise<void> {
  try {
    // Ensure MongoDB connection before operation
    const isConnected = await ensureMongoConnection();
    if (!isConnected) {
      console.error('MongoDB connection failed for counter initialization');
      return;
    }

    // Check if counter already exists
    const existingCounter = await Counter.findById('registrationId').maxTimeMS(5000);
    if (existingCounter) {
      console.log('Counter already initialized at:', existingCounter.sequence_value);
      return;
    }

    // Import Registration model to check existing data
    const { Registration } = await import('../register.js');
    
    // Find the highest existing registration ID
    const highestRegistration = await Registration.findOne(
      {}, 
      { registrationId: 1 }, 
      { sort: { registrationId: -1 } }
    );

    // Start counter ABOVE the highest existing ID, with a safe buffer
    const startValue = highestRegistration ? 
      Math.max(highestRegistration.registrationId + 100, 1000) : 1000;

    // Initialize counter
    await Counter.create({
      _id: 'registrationId',
      sequence_value: startValue
    });

    console.log(`✅ Counter safely initialized starting from: ${startValue + 1}`);
    console.log(`   Highest existing registration ID: ${highestRegistration?.registrationId || 'none'}`);
    
  } catch (error) {
    console.error('Counter initialization error:', error);
    // Don't throw - let the system continue with fallback
  }
}