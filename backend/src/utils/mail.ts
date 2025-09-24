import transporter from "./mailer.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export async function sendWelcomeEmail(
  to: string,
  id: string,
  name: string,
  yearOfStudy: string,
  phone: string,
  eventName: string,
  college: string,
): Promise<void> {
  // Helper to capitalize first letter of each word
  const toTitleCase = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formattedName = toTitleCase(name);
  const formattedEvent = toTitleCase(eventName);
  const formattedCollege = toTitleCase(college);

  const maxRetries = 3;
  let attempt = 0;
  
  const mailOptions = {
    from: `"Discovery ADCET 2025" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🎉 Registration Confirmed - Discovery ADCET 2025',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmed - Discovery ADCET 2025</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            color: #334155;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            text-align: center;
            padding: 40px 20px;
        }
        
        .logo {
            width: 300px;
            max-width: 90%;
            height: auto;
            margin: 0 auto 20px;
            display: block;
            border-radius: 8px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #1e293b;
        }
        
        .success-message {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 20px;
            margin: 25px 0;
            border-radius: 6px;
        }
        
        .success-message p {
            margin: 0;
            color: #166534;
            font-weight: 500;
        }
        
        .registration-details {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .registration-details h3 {
            margin: 0 0 20px;
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 500;
            color: #64748b;
        }
        
        .detail-value {
            font-weight: 600;
            color: #1e293b;
        }
        
        .registration-id {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        
        .next-steps {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .next-steps h3 {
            margin: 0 0 15px;
            color: #92400e;
            font-size: 16px;
            font-weight: 600;
        }
        
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
            color: #92400e;
        }
        
        .next-steps li {
            margin-bottom: 8px;
        }
        
        .contact-info {
            text-align: center;
            padding: 30px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .contact-info h3 {
            margin: 0 0 15px;
            color: #1e293b;
            font-size: 16px;
            font-weight: 600;
        }
        
        .contact-details {
            color: #64748b;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #1e293b;
            color: #94a3b8;
            font-size: 14px;
        }
        
        .footer strong {
            color: #ffffff;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            
            .registration-details {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="cid:discovery-logo" alt="Discovery ADCET 2025 Logo" class="logo" style="background-color: white; padding: 10px; border-radius: 8px;">
            <h1>Discovery ADCET 2025</h1>
            <p>Registration Confirmed Successfully</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Hello <strong>${formattedName}</strong>,
            </div>
            
            <div class="success-message">
                <p>🎉 Congratulations! Your registration for <strong>${formattedEvent}</strong> has been confirmed.</p>
            </div>
            
            <p>We're excited to have you participate in Discovery ADCET 2025! You're all set for an amazing experience filled with innovation, competition, and learning.</p>
            
            <!-- Registration Details -->
            <div class="registration-details">
                <h3>📋 Registration Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Registration ID</span>
                    <span class="registration-id">#${id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event</span>
                    <span class="detail-value">${formattedEvent}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Participant</span>
                    <span class="detail-value">${formattedName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">College</span>
                    <span class="detail-value">${formattedCollege}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Year of Study</span>
                    <span class="detail-value">${yearOfStudy}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${phone}</span>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3>📌 What's Next?</h3>
                <ul>
                    <li>Keep this email safe - you'll need your Registration ID</li>
                    <li>Watch your email for event schedule and venue details</li>
                    <li>Follow our official pages for updates and announcements</li>
                    <li>Prepare for an exciting competition ahead!</li>
                </ul>
            </div>
            
            <p style="margin-bottom: 0;">We can't wait to see you at Discovery ADCET 2025. Get ready to showcase your skills and make lasting connections!</p>
        </div>
        
        <!-- Contact Information -->
        <div class="contact-info">
            <h3>Need Help?</h3>
            <div class="contact-details">
                <p>📧 Email: discovery2025@adcet.in</p>
                <p>📱 Phone: +91 9975003984</p>
                <p>Feel free to reach out if you have any questions!</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Best regards,<br><strong>Team Discovery ADCET 2025</strong></p>
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Discovery ADCET. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  };

  while (attempt < maxRetries) {
    try {
      console.log(`Email send attempt ${attempt + 1} for ${to}`);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId, 'to:', to);
      return;
    } catch (error) {
      attempt++;
      console.error(`Email send attempt ${attempt} failed for ${to}:`, error);
      
      if (attempt >= maxRetries) {
        console.error(`FINAL FAILURE: Failed to send email to ${to} after ${maxRetries} attempts`);
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error}`);
      }
      
      // Exponential backoff
      const delay = 2000 * attempt;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default transporter;