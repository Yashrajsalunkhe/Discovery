import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface PendingRequest {
  timestamp: number;
  response?: any;
  isProcessing: boolean;
}

// In-memory cache for deduplication (for serverless, consider using Redis in production)
const requestCache = new Map<string, PendingRequest>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  
  for (const [key, request] of requestCache.entries()) {
    if (request.timestamp < fiveMinutesAgo) {
      requestCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const deduplicationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Create a unique key based on request content (excluding timestamp-sensitive fields)
  const {
    leaderName, leaderEmail, leaderMobile, selectedEvent, 
    paymentId, orderId, totalFee, participationType, teamMembers
  } = req.body;
  
  const requestData = {
    leaderEmail: leaderEmail?.trim().toLowerCase(),
    leaderMobile: leaderMobile?.trim(),
    selectedEvent: selectedEvent?.trim(),
    paymentId,
    orderId,
    totalFee,
    participationType,
    teamMembersCount: Array.isArray(teamMembers) ? teamMembers.length : 0
  };
  
  const requestKey = crypto.createHash('sha256')
    .update(JSON.stringify(requestData))
    .digest('hex');
    
  const now = Date.now();
  const existingRequest = requestCache.get(requestKey);
  
  // If there's a recent identical request (within 2 minutes)
  if (existingRequest && (now - existingRequest.timestamp) < 2 * 60 * 1000) {
    if (existingRequest.isProcessing) {
      // Request is still processing, return a 409 Conflict
      return res.status(409).json({
        success: false,
        error: 'A similar registration request is already being processed. Please wait a moment before trying again.',
        code: 'DUPLICATE_REQUEST_PROCESSING'
      });
    } else if (existingRequest.response) {
      // Request was completed recently, return the cached response
      return res.status(200).json({
        success: true,
        message: 'Registration was already completed successfully.',
        cached: true
      });
    }
  }
  
  // Mark this request as processing
  requestCache.set(requestKey, {
    timestamp: now,
    isProcessing: true
  });
  
  // Add cleanup to mark as completed
  const originalSend = res.send;
  res.send = function(body) {
    const request = requestCache.get(requestKey);
    if (request) {
      request.isProcessing = false;
      request.response = body;
    }
    return originalSend.call(this, body);
  };
  
  next();
};