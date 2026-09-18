import { sendMail, senderEmail as configuredSenderEmail } from "./mailer.js";
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
 * Build a plain-text version of the email (helps avoid spam filters).
 */
function buildPlainText(data: {
  name: string; event: string; college: string; department: string;
  city: string; year: string; phone: string; regId: string; fee: string;
  paymentId: string; orderId: string; registeredOn: string;
  participationType: string; teamSize: number;
  teamMembers?: EmailRegistrationData['teamMembers'];
}): string {
  let text = `DISCOVERY ADCET 2K26 — Registration Confirmed\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `Hello ${data.name},\n\n`;
  text += `Your registration for "${data.event}" has been confirmed.\n\n`;
  text += `REGISTRATION ID: ${data.regId}\n\n`;
  text += `--- Participant Details ---\n`;
  text += `Name: ${data.name}\n`;
  text += `Phone: ${data.phone}\n`;
  text += `College: ${data.college}\n`;
  text += `Department: ${data.department}\n`;
  text += `Year: ${data.year}\n`;
  text += `City: ${data.city}\n\n`;
  text += `--- Event Details ---\n`;
  text += `Event: ${data.event}\n`;
  text += `Participation: ${data.participationType === 'team' ? `Team (${data.teamSize} members)` : 'Solo'}\n`;
  text += `Registered On: ${data.registeredOn}\n\n`;

  if (data.participationType === 'team' && data.teamMembers && data.teamMembers.length > 0) {
    text += `--- Team Members ---\n`;
    data.teamMembers.forEach((m, i) => {
      text += `${i + 1}. ${m.name} — ${m.college}${m.mobile ? ` — ${m.mobile}` : ''}\n`;
    });
    text += `\n`;
  }

  text += `--- Payment Details ---\n`;
  text += `Amount Paid: ${data.fee}\n`;
  text += `Payment ID: ${data.paymentId}\n`;
  text += `Order ID: ${data.orderId}\n`;
  text += `Status: Confirmed\n\n`;
  text += `--- What's Next? ---\n`;
  text += `- Keep this email safe, you'll need Registration ID (${data.regId}) at the venue\n`;
  text += `- Watch your email for event schedule and venue details\n`;
  text += `- Follow our official pages for updates\n\n`;
  text += `Need help? Email: ${process.env.EMAIL_FROM || 'discovery2025@adcet.in'} | Phone: +91 9975003984\n\n`;
  text += `Best regards,\nTeam Discovery ADCET 2K26\n`;
  text += `© ${new Date().getFullYear()} Discovery ADCET. All rights reserved.\n`;

  return text;
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

  const senderEmail = configuredSenderEmail;

  // Build team members rows
  let teamMembersSection = '';
  if (data.participationType === 'team' && data.teamMembers && data.teamMembers.length > 0) {
    const memberRows = data.teamMembers.map((m, i) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;text-align:center;">${i + 1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;font-weight:500;">${toTitleCase(m.name)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#4a5568;font-size:13px;">${toTitleCase(m.college)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#4a5568;font-size:13px;">${m.mobile || '—'}</td>
      </tr>`).join('');

    teamMembersSection = `
      <tr>
        <td style="padding:24px 36px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#1a202c;padding-bottom:12px;">
                <span style="display:inline-block;width:4px;height:18px;background:#4f46e5;border-radius:2px;vertical-align:middle;margin-right:10px;"></span>
                Team Members
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #edf2f7;border-radius:8px;overflow:hidden;">
            <tr style="background:linear-gradient(135deg,#f7fafc 0%,#edf2f7 100%);">
              <th style="padding:10px 14px;text-align:center;color:#718096;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e2e8f0;width:40px;">#</th>
              <th style="padding:10px 14px;text-align:left;color:#718096;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e2e8f0;">Name</th>
              <th style="padding:10px 14px;text-align:left;color:#718096;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e2e8f0;">College</th>
              <th style="padding:10px 14px;text-align:left;color:#718096;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e2e8f0;">Mobile</th>
            </tr>
            ${memberRows}
          </table>
        </td>
      </tr>`;
  }

  // Paper presentation department row
  const paperRow = (data.selectedEvent.toLowerCase().includes('paper presentation') && data.paperPresentationDept)
    ? `<tr>
         <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;width:38%;">Paper Dept</td>
         <td style="padding:10px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;font-weight:500;">${toTitleCase(data.paperPresentationDept)}</td>
       </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Registration Confirmed — Discovery 2K26</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Helvetica Neue',Arial,sans-serif;color:#1a202c;-webkit-font-smoothing:antialiased;">

  <!-- Preheader text (hidden, improves inbox preview) -->
  <div style="display:none;font-size:1px;color:#f0f2f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your registration #${regId} for ${event} at Discovery ADCET 2K26 is confirmed. Keep this email safe.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08),0 1px 4px rgba(0,0,0,0.04);">

          <!-- ============ HEADER WITH GRADIENT ============ -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%);padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px 20px;text-align:center;">
                    <!-- Logo / Brand Mark -->
                    <div style="display:inline-block;width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;line-height:56px;text-align:center;margin-bottom:16px;border:1px solid rgba(255,255,255,0.2);">
                      <span style="font-size:28px;color:#ffffff;font-weight:800;letter-spacing:-1px;">D</span>
                    </div>
                    <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Discovery ADCET 2K26</h1>
                    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;letter-spacing:0.5px;text-transform:uppercase;">Technical Festival</p>
                  </td>
                </tr>
                <!-- Success Pill -->
                <tr>
                  <td style="padding:0 40px 32px;text-align:center;">
                    <div style="display:inline-block;background:rgba(16,185,129,0.2);border:1px solid rgba(16,185,129,0.4);border-radius:100px;padding:10px 28px;">
                      <span style="font-size:14px;font-weight:700;color:#34d399;letter-spacing:0.3px;">&#10003; Registration Confirmed</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ GREETING ============ -->
          <tr>
            <td style="padding:32px 36px 0;">
              <p style="margin:0;font-size:17px;color:#1a202c;line-height:1.6;font-weight:600;">
                Hello ${name},
              </p>
              <p style="margin:10px 0 0;font-size:14px;color:#64748b;line-height:1.7;">
                Your registration for <strong style="color:#1e3a5f;">${event}</strong> has been confirmed successfully. Here are your complete registration details.
              </p>
            </td>
          </tr>

          <!-- ============ REGISTRATION ID CARD ============ -->
          <tr>
            <td style="padding:24px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:1px solid #bfdbfe;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <span style="font-size:11px;color:#3b82f6;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;display:block;margin-bottom:6px;">Registration ID</span>
                    <span style="font-size:36px;font-weight:800;color:#1e40af;letter-spacing:1px;line-height:1.2;">${regId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ PARTICIPANT DETAILS ============ -->
          <tr>
            <td style="padding:28px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                <tr>
                  <td style="font-size:15px;font-weight:700;color:#1a202c;padding-bottom:12px;">
                    <span style="display:inline-block;width:4px;height:18px;background:#2563eb;border-radius:2px;vertical-align:middle;margin-right:10px;"></span>
                    Participant Details
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #edf2f7;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;width:38%;background:#f7fafc;font-weight:500;">Name</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Email</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">${data.leaderEmail}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Phone</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">College</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">${college}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Department</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">${department}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Year</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">${year}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">City</td>
                  <td style="padding:12px 14px;color:#1a202c;font-size:13px;">${city}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ EVENT DETAILS ============ -->
          <tr>
            <td style="padding:24px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                <tr>
                  <td style="font-size:15px;font-weight:700;color:#1a202c;padding-bottom:12px;">
                    <span style="display:inline-block;width:4px;height:18px;background:#8b5cf6;border-radius:2px;vertical-align:middle;margin-right:10px;"></span>
                    Event Details
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #edf2f7;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;width:38%;background:#f7fafc;font-weight:500;">Event</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:14px;font-weight:700;">${event}</td>
                </tr>
                ${paperRow}
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Participation</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#1a202c;font-size:13px;">
                    <span style="display:inline-block;background:${data.participationType === 'team' ? '#ede9fe' : '#ecfdf5'};color:${data.participationType === 'team' ? '#6d28d9' : '#059669'};font-size:12px;font-weight:600;padding:3px 10px;border-radius:100px;">
                      ${data.participationType === 'team' ? `Team (${data.teamSize} members)` : 'Solo'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Date</td>
                  <td style="padding:12px 14px;color:#1a202c;font-size:13px;">${registeredOn}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${teamMembersSection}

          <!-- ============ PAYMENT DETAILS ============ -->
          <tr>
            <td style="padding:24px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                <tr>
                  <td style="font-size:15px;font-weight:700;color:#1a202c;padding-bottom:12px;">
                    <span style="display:inline-block;width:4px;height:18px;background:#10b981;border-radius:2px;vertical-align:middle;margin-right:10px;"></span>
                    Payment Details
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #edf2f7;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;width:38%;background:#f7fafc;font-weight:500;">Amount Paid</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;font-size:16px;font-weight:800;color:#059669;">${fee}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Payment ID</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#4a5568;font-size:12px;font-family:'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;word-break:break-all;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Order ID</td>
                  <td style="padding:12px 14px;border-bottom:1px solid #edf2f7;color:#4a5568;font-size:12px;font-family:'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;word-break:break-all;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#718096;font-size:13px;background:#f7fafc;font-weight:500;">Status</td>
                  <td style="padding:12px 14px;">
                    <span style="display:inline-block;background:#ecfdf5;color:#059669;font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;">&#10003; Confirmed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ WHAT'S NEXT ============ -->
          <tr>
            <td style="padding:28px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border:1px solid #fde68a;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#92400e;">
                      &#128204; What's Next?
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;vertical-align:top;width:20px;color:#b45309;font-size:13px;">&#8226;</td>
                        <td style="padding:4px 0;color:#92400e;font-size:13px;line-height:1.6;">Keep this email safe — you'll need your <strong>Registration ID (${regId})</strong> at the venue</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;vertical-align:top;width:20px;color:#b45309;font-size:13px;">&#8226;</td>
                        <td style="padding:4px 0;color:#92400e;font-size:13px;line-height:1.6;">Watch your email for event schedule and venue details</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;vertical-align:top;width:20px;color:#b45309;font-size:13px;">&#8226;</td>
                        <td style="padding:4px 0;color:#92400e;font-size:13px;line-height:1.6;">Follow our official pages for updates</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ CONTACT ============ -->
          <tr>
            <td style="padding:28px 36px 24px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 24px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#4a5568;">Need Help?</p>
                    <p style="margin:0;font-size:12px;color:#718096;line-height:1.8;">
                      Email: <a href="mailto:${senderEmail}" style="color:#2563eb;text-decoration:none;font-weight:500;">${senderEmail}</a>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      Phone: <a href="tel:+919975003984" style="color:#2563eb;text-decoration:none;font-weight:500;">+91 9975003984</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ FOOTER ============ -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:24px 36px;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.9);font-weight:600;">
                Team Discovery ADCET 2K26
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">
                &copy; ${new Date().getFullYear()} Discovery ADCET. All rights reserved.
              </p>
              <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.35);">
                You are receiving this email because you registered for Discovery ADCET 2K26.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  // Build plain text alternative
  const plainText = buildPlainText({
    name, event, college, department, city, year, phone,
    regId, fee, paymentId, orderId, registeredOn,
    participationType: data.participationType,
    teamSize: data.teamSize,
    teamMembers: data.teamMembers,
  });

  const mailOptions = {
    from: `Discovery ADCET 2K26 <${senderEmail}>`,
    to,
    subject: `Your Registration ${regId} is Confirmed - Discovery ADCET 2K26`,
    replyTo: senderEmail,
    headers: {
      'List-Unsubscribe': `<mailto:${senderEmail}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html,
    text: plainText,
  };

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`📧 Email send attempt ${attempt + 1} for ${to}`);
      const result = await sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result?.id, 'to:', to);
      return;
    } catch (error) {
      attempt++;
      console.error(`❌ Email send attempt ${attempt} failed for ${to}:`, error);

      if (attempt >= maxRetries) {
        console.error(`🔴 FINAL FAILURE: Failed to send email to ${to} after ${maxRetries} attempts`);
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error}`);
      }

      // Short backoff — Resend HTTP is fast, no need for long delays
      const delay = 1000 * attempt;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}