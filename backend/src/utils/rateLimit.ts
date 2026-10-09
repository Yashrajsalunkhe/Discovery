import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

export const createRateLimiter = (windowMs: number, maxRequests: number, name = 'default') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Scoped per limiter so different routes don't share one per-IP budget
    const identifier = `${name}:${req.ip || req.connection.remoteAddress || 'unknown'}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let entry = rateLimitStore.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(identifier, entry);
      return next();
    }
    
    if (entry.count >= maxRequests) {
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': entry.resetTime.toString(),
        'Retry-After': resetIn.toString()
      });
      
      return res.status(429).json({
        success: false,
        error: `Too many requests. Please try again in ${resetIn} seconds.`,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    entry.count++;
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - entry.count).toString(),
      'X-RateLimit-Reset': entry.resetTime.toString()
    });
    
    next();
  };
};

// Rate limiter for registration endpoint: 15 requests per minute per IP
// Keep generous — payment verification + signature checks already prevent abuse.
// A tight limit risks blocking legitimate retries after successful payment.
export const registrationRateLimit = createRateLimiter(60 * 1000, 15, 'register');

// Spot desks often share one IP (desk laptops / campus Wi-Fi). Capacity and
// duplicate checks already bound abuse, so allow a desk-friendly rate.
export const spotRegistrationRateLimit = createRateLimiter(60 * 1000, 60, 'spot-register');