import { RequestHandler } from 'express';
import { calculateTotalWithRazorpayFees, calculateTeamFee } from './feeCalculation.js';
import { Payment } from './payment.js';
import { getEventCapacity, getEventRegistrationLimit } from '../register.js';
import { findExistingRegistration } from '../search.js';
import { getRazorpayClient, getRazorpayCredentials } from './razorpayConfig.js';

export const orderRazorpay: RequestHandler = async (req, res, next) => {
    const { keyId, keySecret } = getRazorpayCredentials();
    if (!keyId || !keySecret) {
        console.error('Razorpay credentials missing');
        return res.status(500).json({ 
            success: false, 
            error: 'Payment service configuration error' 
        });
    }

    const razorpay = getRazorpayClient();
    
    try {
        const { amount, currency, receipt, baseFee, participationType, teamSize, baseFeePerMember, registrationData } = req.body;

        const eventLimit = registrationData?.selectedEvent
            ? getEventRegistrationLimit(registrationData.selectedEvent, registrationData.paperPresentationDept)
            : undefined;
        if (eventLimit && registrationData?.selectedEvent) {
            const capacity = await getEventCapacity(
                registrationData.selectedEvent,
                registrationData.paperPresentationDept
            );
            if (capacity.registeredRegistrations + 1 > eventLimit) {
                return res.status(409).json({
                    success: false,
                    error: `${registrationData.selectedEvent} registration is closed because the limit has been reached.`
                });
            }
        }

        // Reject already-registered participants before they are charged
        const { leaderEmail, leaderMobile, selectedEvent } = registrationData || {};
        if (leaderEmail && leaderMobile && selectedEvent &&
            await findExistingRegistration(leaderEmail, leaderMobile, selectedEvent)) {
            return res.status(409).json({
                success: false,
                error: 'User with this email or phone already registered for this event'
            });
        }
        
        // Validate required fields
        if (!currency || !receipt) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: currency, receipt' 
            });
        }

        let finalAmount: number;
        let feeBreakdown;

        // If baseFee is provided, use it directly
        if (baseFee && typeof baseFee === 'number' && baseFee > 0) {
            feeBreakdown = calculateTotalWithRazorpayFees(baseFee);
            finalAmount = feeBreakdown.totalAmountInPaise;
        }
        // If team details are provided, calculate fee
        else if (participationType && teamSize) {
            feeBreakdown = calculateTeamFee(
                participationType,
                teamSize,
                baseFeePerMember || 100
            );
            finalAmount = feeBreakdown.totalAmountInPaise;
        }
        // Fallback to direct amount (backward compatibility)
        else if (amount && typeof amount === 'number' && amount > 0) {
            finalAmount = amount;
            // Create breakdown for response
            const amountInRupees = amount / 100;
            const calculatedBreakdown = calculateTotalWithRazorpayFees(amountInRupees / 1.0248); // Reverse calculate
            feeBreakdown = calculatedBreakdown;
        }
        else {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide either baseFee, team details (participationType, teamSize), or amount' 
            });
        }

        const options = {
            amount: finalAmount,
            currency: currency,
            receipt: receipt,
            payment_capture: 1 // Auto capture
        };

        console.log('Creating Razorpay order with options:', { 
            ...options, 
            amount: `${finalAmount/100} ${currency}`,
            feeBreakdown 
        });
        
        const order = await razorpay.orders.create(options);
        
        if (!order) {
            console.error('No order returned from Razorpay');
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to create order' 
            });
        }

        await Payment.create({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            status: 'CREATED',
            registrationStatus: 'PENDING',
            registrationData: req.body.registrationData
        });

        console.log('ORDER_CREATED', { orderId: order.id, amount: order.amount, currency: order.currency });
        // The browser must open checkout with the same key that created the order
        res.status(200).json({ 
            success: true, 
            order,
            keyId,
            feeBreakdown 
        });
        
    } catch (error: any) {
        console.error('Razorpay order creation error:', {
            message: error.message,
            statusCode: error.statusCode,
            description: error.description,
            source: error.source,
            step: error.step,
            reason: error.reason
        });
        
        res.status(500).json({ 
            success: false, 
            error: error.description || error.message || 'Failed to create order' 
        });
    }
};