import { Request, Response } from 'express';
import { connectToMongoDB, Registration } from '../register.js';
import { sendWelcomeEmail } from './mail.js';

interface QueuedRegistration {
  id: string;
  data: any;
  attempts: number;
  createdAt: Date;
  processAt: Date;
}

// Simple in-memory queue (use external queue service in production)
const registrationQueue: QueuedRegistration[] = [];
let isProcessing = false;

export const queueRegistration = async (registrationData: any): Promise<string> => {
  const queueId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const queuedItem: QueuedRegistration = {
    id: queueId,
    data: registrationData,
    attempts: 0,
    createdAt: new Date(),
    processAt: new Date()
  };
  
  registrationQueue.push(queuedItem);
  
  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }
  
  return queueId;
};

const processQueue = async () => {
  if (isProcessing || registrationQueue.length === 0) {
    return;
  }
  
  isProcessing = true;
  
  while (registrationQueue.length > 0) {
    const item = registrationQueue.shift()!;
    
    try {
      await processRegistration(item);
    } catch (error) {
      console.error('Queue processing error:', error);
      
      // Retry logic
      item.attempts++;
      if (item.attempts < 3) {
        // Exponential backoff
        item.processAt = new Date(Date.now() + Math.pow(2, item.attempts) * 1000);
        registrationQueue.push(item);
      } else {
        console.error('Max retry attempts reached for registration:', item.id);
        // Could store in failed queue or send alert
      }
    }
    
    // Small delay between processing
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessing = false;
};

const processRegistration = async (item: QueuedRegistration) => {
  if (new Date() < item.processAt) {
    // Not ready to process yet, put back in queue
    registrationQueue.push(item);
    return;
  }
  
  await connectToMongoDB();
  
  // Your existing registration logic here
  const { saveRegistrationWithRetry } = await import('../register.js');
  const saved = await saveRegistrationWithRetry(item.data);
  
  // Send welcome email asynchronously
  sendWelcomeEmail(
    saved.leaderEmail,
    saved.registrationId.toString(),
    saved.leaderName,
    saved.leaderYear,
    saved.leaderMobile,
    saved.selectedEvent,
    saved.leaderCollege
  ).catch(error => {
    console.error('Email sending failed:', error);
  });
  
  console.log('Registration processed from queue:', saved.registrationId);
};

// Endpoint to check queue status
export const getQueueStatus = async (req: Request, res: Response) => {
  res.json({
    queueLength: registrationQueue.length,
    isProcessing,
    items: registrationQueue.map(item => ({
      id: item.id,
      attempts: item.attempts,
      createdAt: item.createdAt,
      processAt: item.processAt
    }))
  });
};