/**
 * Utility functions for calculating payment amounts including Razorpay gateway charges
 */

// Razorpay fee structure (as of 2024)
// 2% + GST (18%) = 2.36% total for domestic payments
const RAZORPAY_FEE_PERCENTAGE = 0.0236; // 2.36%

export interface FeeBreakdown {
  baseFee: number;
  processingCharges: number;
  totalAmount: number;
  totalAmountInPaise: number;
}

/**
 * Calculate the total amount to charge the customer so that after Razorpay deducts their fees,
 * the merchant receives the exact base fee amount.
 * 
 * Formula: If we want to receive X amount after fees, we need to charge:
 * Total = X / (1 - fee_percentage)
 * 
 * @param baseFee - The amount you want to receive in your bank account (in rupees)
 * @returns FeeBreakdown object with all amounts
 */
export function calculateTotalWithRazorpayFees(baseFee: number): FeeBreakdown {
  if (baseFee <= 0) {
    throw new Error('Base fee must be greater than 0');
  }

  // Calculate total amount to charge (reverse calculation)
  const totalAmount = baseFee / (1 - RAZORPAY_FEE_PERCENTAGE);
  
  // Calculate processing charges
  const processingCharges = totalAmount - baseFee;
  
  // Convert to paise for Razorpay API
  const totalAmountInPaise = Math.round(totalAmount * 100);
  
  return {
    baseFee: Math.round(baseFee * 100) / 100, // Round to 2 decimal places
    processingCharges: Math.round(processingCharges * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalAmountInPaise
  };
}

/**
 * Calculate team registration fee based on participation type and team size
 * 
 * @param participationType - 'solo' or 'team'
 * @param teamSize - Number of team members (default: 1)
 * @param baseFeePerMember - Base fee per member in rupees (default: 100)
 * @returns FeeBreakdown object with all amounts
 */
export function calculateTeamFee(
  participationType: 'solo' | 'team' = 'solo',
  teamSize: number = 1,
  baseFeePerMember: number = 100
): FeeBreakdown {
  if (teamSize <= 0) {
    throw new Error('Team size must be greater than 0');
  }

  if (baseFeePerMember <= 0) {
    throw new Error('Base fee per member must be greater than 0');
  }

  const totalBaseFee = participationType === 'solo' ? baseFeePerMember : baseFeePerMember * teamSize;
  
  return calculateTotalWithRazorpayFees(totalBaseFee);
}

/**
 * Format currency amount for display
 * 
 * @param amount - Amount in rupees
 * @param showSymbol - Whether to show ₹ symbol (default: true)
 * @returns Formatted string
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = amount.toFixed(2);
  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Get Razorpay fee percentage for display purposes
 */
export function getRazorpayFeePercentage(): number {
  return RAZORPAY_FEE_PERCENTAGE * 100; // Convert to percentage
}