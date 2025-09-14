const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Email transporter (configure according to your needs)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create Razorpay Order
app.post('/api/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Number(amount), // amount in paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// Register and verify payment
app.post('/api/register', async (req, res) => {
  try {
    const {
      participantName,
      email,
      phone,
      college,
      department,
      year,
      selectedEvent,
      teamMembers,
      paymentId,
      orderId,
      signature,
    } = req.body;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment verification failed' 
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment not captured' 
      });
    }

    // Store registration data (you can implement database storage here)
    const registrationData = {
      participantName,
      email,
      phone,
      college,
      department,
      year,
      selectedEvent,
      teamMembers,
      paymentId,
      orderId,
      amount: payment.amount / 100, // Convert paise to rupees
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Log registration data (replace with database storage)
    console.log('Registration Data:', registrationData);

    // Send confirmation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; text-align: center;">Registration Confirmed - Discovery 2K25</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Registration Details</h3>
          <p><strong>Participant:</strong> ${participantName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>College:</strong> ${college}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Event:</strong> ${selectedEvent}</p>
          ${teamMembers && teamMembers.length > 0 ? `
            <p><strong>Team Members:</strong></p>
            <ul>
              ${teamMembers.map(member => `<li>${member.name} (${member.email})</li>`).join('')}
            </ul>
          ` : ''}
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">Payment Details</h3>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Amount:</strong> ₹${payment.amount / 100}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d97706; margin-top: 0;">Important Instructions</h3>
          <ul style="color: #92400e;">
            <li>Please carry a printout of this email on the event day</li>
            <li>Event Date: 11th October 2025</li>
            <li>Venue: ADCET, Ashta</li>
            <li>Report to the registration desk 30 minutes before your event</li>
            <li>Bring your college ID card</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">For any queries, contact us:</p>
          <p style="color: #374151;"><strong>Email:</strong> discovery2k25@adcet.in</p>
          <p style="color: #374151;"><strong>Phone:</strong> +91 9657028810</p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px;">
            Discovery 2K25 | Annasaheb Dange College of Engineering and Technology
          </p>
        </div>
      </div>
    `;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Registration Confirmed - Discovery 2K25',
          html: emailHtml,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the registration if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Registration completed successfully',
      registrationData: {
        participantName,
        selectedEvent,
        paymentId,
        amount: payment.amount / 100
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called');
  res.json({ status: 'OK', message: 'API server is running', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});