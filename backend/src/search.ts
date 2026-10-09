import { Request, Response, NextFunction } from 'express';
import { Registration, connectToMongoDB } from './register.js';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findExistingRegistration = (
  leaderEmail: string,
  leaderMobile: string,
  selectedEvent: string
): Promise<{ paymentId: string; orderId: string } | null> =>
  Registration.findOne({
    selectedEvent: { $regex: `^${escapeRegex(selectedEvent.trim().toLowerCase())}$`, $options: 'i' },
    $or: [
      { leaderEmail: { $regex: `^${escapeRegex(leaderEmail.trim().toLowerCase())}$`, $options: 'i' } },
      { leaderMobile: leaderMobile.trim().toLowerCase() }
    ]
  }).select('paymentId orderId').lean<{ paymentId: string; orderId: string }>().exec();

export const checkDuplicate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await connectToMongoDB();
  const { leaderEmail, selectedEvent, leaderMobile } = req.body;
  
  // Validate required fields for duplicate check
  if (!leaderEmail || !selectedEvent || !leaderMobile) {
    res.status(400).json({ 
      success: false, 
      error: 'Missing required fields for registration validation' 
    });
    return;
  }
  
  try {
    const existing = await findExistingRegistration(leaderEmail, leaderMobile, selectedEvent);

    const samePayment = existing && req.body.paymentId && existing.paymentId === req.body.paymentId;
    const sameOrder = existing && req.body.orderId && existing.orderId === req.body.orderId;

    if (existing && !samePayment && !sameOrder) {
      res.status(409).json({ 
        success: false, 
        error: 'User with this email or phone already registered for this event' 
      });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Duplicate check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check duplicate registration' 
    });
    return;
  }
};