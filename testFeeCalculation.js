/**
 * Test file to verify fee calculation logic
 * Run this with: node testFeeCalculation.js
 */

// Import the functions (adjust path as needed)
const { calculateTotalWithRazorpayFees, calculateTeamFee, formatCurrency } = require('./frontend/src/utils/feeCalculation.ts');

console.log('=== Fee Calculation Tests ===\n');

// Test 1: Single member (₹100 base fee)
console.log('1. Solo Participation (₹100 base fee):');
const soloFee = calculateTeamFee('solo', 1, 100);
console.log(`   Base Fee: ₹${soloFee.baseFee}`);
console.log(`   Processing Charges: ₹${soloFee.processingCharges}`);
console.log(`   Total Amount: ₹${soloFee.totalAmount}`);
console.log(`   Amount in Paise: ${soloFee.totalAmountInPaise}\n`);

// Test 2: Team of 3 members (₹300 base fee)
console.log('2. Team of 3 (₹300 base fee):');
const teamFee = calculateTeamFee('team', 3, 100);
console.log(`   Base Fee: ₹${teamFee.baseFee}`);
console.log(`   Processing Charges: ₹${teamFee.processingCharges}`);
console.log(`   Total Amount: ₹${teamFee.totalAmount}`);
console.log(`   Amount in Paise: ${teamFee.totalAmountInPaise}\n`);

// Test 3: Verify reverse calculation
console.log('3. Verification (What organizer receives):');
const actualReceived = soloFee.totalAmount * (1 - 0.0236); // Subtract Razorpay fees
console.log(`   After Razorpay deducts 2.36%: ₹${actualReceived.toFixed(2)}`);
console.log(`   Expected to receive: ₹${soloFee.baseFee}`);
console.log(`   Difference: ₹${Math.abs(actualReceived - soloFee.baseFee).toFixed(2)}\n`);

// Test 4: Different base fees
console.log('4. Different Base Fee Examples:');
[50, 150, 200, 500].forEach(baseFee => {
  const calc = calculateTotalWithRazorpayFees(baseFee);
  console.log(`   ₹${baseFee} → Total: ₹${calc.totalAmount} (+ ₹${calc.processingCharges} charges)`);
});

console.log('\n=== Tests Complete ===');