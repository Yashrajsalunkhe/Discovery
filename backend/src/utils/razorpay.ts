import { RequestHandler } from 'express';
import Razorpay from 'razorpay';
import { calculateTotalWithRazorpayFees, calculateTeamFee } from './feeCalculation.js';

export const orderRazorpay: RequestHandler = async (req, res, next) => {
    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials missing');
        return res.status(500).json({ 
            success: false, 
            error: 'Payment service configuration error' 
        });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
    
    try {
        const { amount, currency, receipt, baseFee, participationType, teamSize, baseFeePerMember } = req.body;
        
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
            const calculatedBreakdown = calculateTotalWithRazorpayFees(amountInRupees / 1.0236); // Reverse calculate
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

        console.log('Order created successfully:', order.id);
        res.status(200).json({ 
            success: true, 
            order,
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