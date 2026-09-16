import transporter from "./mailer.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/**
 * Registration details passed to the email template.
 */
export interface EmailRegistrationData {
  registrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers?: Array<{
    name: string;
    college: string;
    mobile?: string;
    email?: string;
  }>;
  paymentId: string;
  orderId: string;
  totalFee: number;
  createdAt?: Date;
}

/**
 * Legacy-compatible wrapper — keeps existing call-sites working.
 */
export async function sendWelcomeEmail(
  to: string,
  id: string,
  name: string,
  yearOfStudy: string,
  phone: string,
  eventName: string,
  college: string,
  /** Optional full registration data for the enhanced template */
  fullData?: Partial<EmailRegistrationData>,
): Promise<void> {
  const data: EmailRegistrationData = {
    registrationId: Number(id),
    leaderName: name,
    leaderEmail: to,
    leaderMobile: phone,
    leaderCollege: college,
    leaderDepartment: fullData?.leaderDepartment || '',
    leaderYear: yearOfStudy,
    leaderCity: fullData?.leaderCity || '',
    selectedEvent: eventName,
    paperPresentationDept: fullData?.paperPresentationDept,
    participationType: fullData?.participationType || 'solo',
    teamSize: fullData?.teamSize || 1,
    teamMembers: fullData?.teamMembers || [],
    paymentId: fullData?.paymentId || '',
    orderId: fullData?.orderId || '',
    totalFee: fullData?.totalFee || 0,
    createdAt: fullData?.createdAt || new Date(),
  };

  return sendRegistrationEmail(to, data);
}

/**
 * Send a premium registration confirmation email with full details.
 */
export async function sendRegistrationEmail(
  to: string,
  data: EmailRegistrationData,
): Promise<void> {
  if (process.env.EMAIL_ENABLED !== 'true') {
    return;
  }

  const toTitleCase = (s: string) =>
    s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const name = toTitleCase(data.leaderName);
  const event = toTitleCase(data.selectedEvent);
  const college = toTitleCase(data.leaderCollege);
  const department = data.leaderDepartment || '—';
  const city = data.leaderCity ? toTitleCase(data.leaderCity) : '—';
  const year = data.leaderYear || '—';
  const phone = data.leaderMobile || '—';
  const regId = data.registrationId.toString();
  const fee = data.totalFee ? `₹${data.totalFee.toLocaleString('en-IN')}` : '—';
  const paymentId = data.paymentId || '—';
  const orderId = data.orderId || '—';
  const registeredOn = (data.createdAt ? new Date(data.createdAt) : new Date()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Build team members rows with mobile numbers
  let teamMembersSection = '';
  if (data.participationType === 'team' && data.teamMembers && data.teamMembers.length > 0) {
    const memberRows = data.teamMembers.map((m, i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;text-align:center;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${toTitleCase(m.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:13px;">${toTitleCase(m.college)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:13px;">${m.mobile || '—'}</td>
      </tr>`).join('');

    teamMembersSection = `
      <tr>
        <td style="padding:20px 30px 0;">
          <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#111827;">Team Members</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:center;color:#6b7280;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:36px;">#</th>
              <th style="padding:8px 12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Name</th>
              <th style="padding:8px 12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb;">College</th>
              <th style="padding:8px 12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Mobile</th>
            </tr>
            ${memberRows}
          </table>
        </td>
      </tr>`;
  }

  // Paper presentation department row
  const paperRow = (data.selectedEvent.toLowerCase().includes('paper presentation') && data.paperPresentationDept)
    ? `<tr>
         <td style="padding:8px 0;color:#6b7280;font-size:13px;">Paper Dept</td>
         <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:500;">${toTitleCase(data.paperPresentationDept)}</td>
       </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed — Discovery 2K26</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#111827;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e3a5f;padding:28px 30px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Discovery ADCET 2K26</h1>
              <p style="margin:6px 0 0;font-size:13px;color:#94b8d4;">Technical Festival — Registration Confirmation</p>
            </td>
          </tr>

          <!-- Success bar -->
          <tr>
            <td style="background-color:#16a34a;padding:12px 30px;text-align:center;">
              <span style="font-size:14px;font-weight:600;color:#ffffff;">✓ Registration Confirmed</span>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 30px 0;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin:8px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
                Your registration for <strong style="color:#111827;">${event}</strong> has been confirmed successfully. Below are your registration details.
              </p>
            </td>
          </tr>

          <!-- Registration ID -->
          <tr>
            <td style="padding:20px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;">
                <tr>
                  <td style="padding:14px 18px;text-align:center;">
                    <span style="font-size:12px;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:4px;">Registration ID</span>
                    <span style="font-size:24px;font-weight:700;color:#0c4a6e;">${regId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Participant Details -->
          <tr>
            <td style="padding:20px 30px 0;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#111827;">Participant Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:35%;background:#f9fafb;">Name</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Email</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${data.leaderEmail}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Phone</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">College</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${college}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Department</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${department}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Year</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${year}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#6b7280;font-size:13px;background:#f9fafb;">City</td>
                  <td style="padding:8px 12px;color:#111827;font-size:13px;">${city}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Event Details -->
          <tr>
            <td style="padding:20px 30px 0;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#111827;">Event Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:35%;background:#f9fafb;">Event</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${event}</td>
                </tr>
                ${paperRow}
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Participation</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;">${data.participationType === 'team' ? `Team (${data.teamSize} members)` : 'Solo'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#6b7280;font-size:13px;background:#f9fafb;">Date</td>
                  <td style="padding:8px 12px;color:#111827;font-size:13px;">${registeredOn}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${teamMembersSection}

          <!-- Payment Details -->
          <tr>
            <td style="padding:20px 30px 0;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#111827;">Payment Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:35%;background:#f9fafb;">Amount Paid</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#16a34a;font-size:14px;font-weight:600;">${fee}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Payment ID</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:12px;font-family:monospace;word-break:break-all;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;background:#f9fafb;">Order ID</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:12px;font-family:monospace;word-break:break-all;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#6b7280;font-size:13px;background:#f9fafb;">Status</td>
                  <td style="padding:8px 12px;color:#16a34a;font-size:13px;font-weight:600;">✓ Confirmed</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding:20px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:6px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#92400e;">📌 What's Next?</p>
                    <ul style="margin:0;padding-left:18px;color:#92400e;font-size:13px;line-height:1.8;">
                      <li>Keep this email safe — you'll need your <strong>Registration ID (${regId})</strong> at the venue</li>
                      <li>Watch your email for event schedule and venue details</li>
                      <li>Follow our official pages for updates</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:20px 30px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#374151;">Need Help?</p>
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.7;">
                Email: <a href="mailto:discovery2025@adcet.in" style="color:#1e3a5f;text-decoration:none;">discovery2025@adcet.in</a> &nbsp;|&nbsp;
                Phone: <a href="tel:+919975003984" style="color:#1e3a5f;text-decoration:none;">+91 9975003984</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:16px 30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;">
                Best regards, <strong>Team Discovery ADCET 2K26</strong>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} Discovery ADCET. All rights reserved. This is an automated email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  const mailOptions = {
    from: `"Discovery ADCET 2K26" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Registration Confirmed — #${regId} | Discovery ADCET 2K26`,
    html,
  };

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`📧 Email send attempt ${attempt + 1} for ${to}`);
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId, 'to:', to);
      return;
    } catch (error) {
      attempt++;
      console.error(`❌ Email send attempt ${attempt} failed for ${to}:`, error);

      if (attempt >= maxRetries) {
        console.error(`🔴 FINAL FAILURE: Failed to send email to ${to} after ${maxRetries} attempts`);
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error}`);
      }

      // Exponential backoff
      const delay = 2000 * attempt;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default transporter;