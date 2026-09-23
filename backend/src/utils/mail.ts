import { sendMail, senderEmail as configuredSenderEmail } from "./mailer.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ─── Constants ───────────────────────────────────────────────────────────────
const SUPPORT_PHONE = '+91 9975003984';
const EVENT_YEAR = '2K26';
const EVENT_NAME = `Discovery ADCET ${EVENT_YEAR}`;
const COPYRIGHT_YEAR = new Date().getFullYear();

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toTitleCase = (s: string) =>
  s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

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
  let text = `${EVENT_NAME} — Registration Confirmed\n`;
  text += `${'═'.repeat(52)}\n\n`;
  text += `Hello ${data.name},\n\n`;
  text += `Congratulations! Your registration for "${data.event}" has been confirmed.\n\n`;
  text += `REGISTRATION ID: ${data.regId}\n\n`;
  text += `── Participant Details ──\n`;
  text += `Name: ${data.name}\n`;
  text += `Phone: ${data.phone}\n`;
  text += `College: ${data.college}\n`;
  text += `Department: ${data.department}\n`;
  text += `Year: ${data.year}\n`;
  text += `City: ${data.city}\n\n`;
  text += `── Event Details ──\n`;
  text += `Event: ${data.event}\n`;
  text += `Participation: ${data.participationType === 'team' ? `Team (${data.teamSize} members)` : 'Solo'}\n`;
  text += `Registered On: ${data.registeredOn}\n\n`;

  if (data.participationType === 'team' && data.teamMembers && data.teamMembers.length > 0) {
    text += `── Team Members ──\n`;
    data.teamMembers.forEach((m, i) => {
      text += `${i + 1}. ${m.name} — ${m.college}${m.mobile ? ` — ${m.mobile}` : ''}\n`;
    });
    text += `\n`;
  }

  text += `── Payment Details ──\n`;
  text += `Amount Paid: ${data.fee}\n`;
  text += `Payment ID: ${data.paymentId}\n`;
  text += `Order ID: ${data.orderId}\n`;
  text += `Status: ✓ Confirmed\n\n`;
  text += `── What's Next? ──\n`;
  text += `1. Save this email — you'll need Registration ID (${data.regId}) at the venue\n`;
  text += `2. Watch your inbox for event schedule and venue details\n`;
  text += `3. Follow our official pages for latest updates\n\n`;
  text += `Need help?\n`;
  text += `Email: ${configuredSenderEmail || 'discovery2025@adcet.in'}\n`;
  text += `Phone: ${SUPPORT_PHONE}\n\n`;
  text += `Best regards,\nTeam ${EVENT_NAME}\n`;
  text += `© ${COPYRIGHT_YEAR} Discovery ADCET. All rights reserved.\n`;

  return text;
}

// ─── Detail Row Builder ──────────────────────────────────────────────────────

function detailRow(label: string, value: string, isLast = false): string {
  const borderBottom = isLast ? '' : 'border-bottom:1px solid #f1f5f9;';
  return `
    <tr>
      <td style="padding:13px 16px;${borderBottom}color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">${label}</td>
      <td style="padding:13px 16px;${borderBottom}color:#0f172a;font-size:13px;font-weight:500;">${value}</td>
    </tr>`;
}

function detailRowBold(label: string, value: string, valueColor = '#0f172a'): string {
  return `
    <tr>
      <td style="padding:13px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">${label}</td>
      <td style="padding:13px 16px;border-bottom:1px solid #f1f5f9;color:${valueColor};font-size:14px;font-weight:700;">${value}</td>
    </tr>`;
}

function monoRow(label: string, value: string, isLast = false): string {
  const borderBottom = isLast ? '' : 'border-bottom:1px solid #f1f5f9;';
  return `
    <tr>
      <td style="padding:13px 16px;${borderBottom}color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">${label}</td>
      <td style="padding:13px 16px;${borderBottom}color:#475569;font-size:12px;font-family:'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;word-break:break-all;letter-spacing:0.02em;">${value}</td>
    </tr>`;
}

// ─── Section Header Builder ──────────────────────────────────────────────────

function sectionHeader(title: string, accentColor: string, icon: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="font-size:15px;font-weight:700;color:#0f172a;padding-bottom:12px;letter-spacing:-0.01em;">
          <span style="display:inline-block;width:5px;height:20px;background:${accentColor};border-radius:3px;vertical-align:middle;margin-right:12px;"></span>
          <span style="vertical-align:middle;">${icon}&nbsp;&nbsp;${title}</span>
        </td>
      </tr>
    </table>`;
}

// ─── Details Table Wrapper ───────────────────────────────────────────────────

function detailsTable(rows: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      ${rows}
    </table>`;
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

  // ── Team Members Section ────────────────────────────────────────────────
  let teamMembersSection = '';
  if (data.participationType === 'team' && data.teamMembers && data.teamMembers.length > 0) {
    const memberRows = data.teamMembers.map((m, i) => `
      <tr>
        <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;color:#94a3b8;font-size:13px;text-align:center;font-weight:600;">${i + 1}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:13px;font-weight:600;">${toTitleCase(m.name)}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px;">${toTitleCase(m.college)}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px;">${m.mobile || '—'}</td>
      </tr>`).join('');

    teamMembersSection = `
      <tr>
        <td style="padding:28px 40px 0;">
          ${sectionHeader('Team Members', '#8b5cf6', '&#128101;')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr style="background:#f8fafc;">
              <th style="padding:11px 14px;text-align:center;color:#94a3b8;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;width:44px;">#</th>
              <th style="padding:11px 14px;text-align:left;color:#94a3b8;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;">Name</th>
              <th style="padding:11px 14px;text-align:left;color:#94a3b8;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;">College</th>
              <th style="padding:11px 14px;text-align:left;color:#94a3b8;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;">Mobile</th>
            </tr>
            ${memberRows}
          </table>
        </td>
      </tr>`;
  }

  // ── Paper Presentation Row ──────────────────────────────────────────────
  const paperRow = (data.selectedEvent.toLowerCase().includes('paper presentation') && data.paperPresentationDept)
    ? detailRow('Paper Dept', toTitleCase(data.paperPresentationDept))
    : '';

  // ── Participation Badge ─────────────────────────────────────────────────
  const participationBadge = data.participationType === 'team'
    ? `<span style="display:inline-block;background:#ede9fe;color:#7c3aed;font-size:11px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:0.02em;">&#128101; Team (${data.teamSize} members)</span>`
    : `<span style="display:inline-block;background:#ecfdf5;color:#059669;font-size:11px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:0.02em;">&#128100; Solo</span>`;

  // ── Build HTML ──────────────────────────────────────────────────────────

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Registration Confirmed — ${EVENT_NAME}</title>
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
    @media only screen and (max-width: 640px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 24px 20px !important; }
      .header-pad { padding: 32px 24px 16px !important; }
      .section-pad { padding: 20px 20px 0 !important; }
      .footer-pad { padding: 20px 20px !important; }
      .reg-id-text { font-size: 28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Helvetica Neue',Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">

  <!-- Preheader text (hidden, improves inbox preview) -->
  <div style="display:none;font-size:1px;color:#eef2f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ✅ Registration #${regId} confirmed for ${event} at ${EVENT_NAME}. Keep this email — you'll need your Registration ID at the venue.
    ${'&nbsp;'.repeat(80)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.03);">

          <!-- ═══════════════ HEADER ═══════════════ -->
          <tr>
            <td style="background:linear-gradient(145deg,#020617 0%,#0f172a 25%,#1e3a5f 60%,#2563eb 100%);padding:0;position:relative;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Decorative top accent line -->
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 35%,#ec4899 70%,#f59e0b 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="header-pad" style="padding:40px 44px 20px;text-align:center;">
                    <!-- Logo / Brand Mark -->
                    <div style="display:inline-block;width:64px;height:64px;background:rgba(255,255,255,0.1);border-radius:16px;line-height:64px;text-align:center;margin-bottom:18px;border:1.5px solid rgba(255,255,255,0.15);backdrop-filter:blur(8px);">
                      <span style="font-size:32px;color:#ffffff;font-weight:900;letter-spacing:-1px;">D</span>
                    </div>
                    <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Discovery ADCET</h1>
                    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.5);font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">${EVENT_YEAR} &nbsp;•&nbsp; Technical Festival</p>
                  </td>
                </tr>
                <!-- Success Banner -->
                <tr>
                  <td style="padding:0 44px 36px;text-align:center;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;">
                      <tr>
                        <td style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.3);border-radius:100px;padding:12px 32px;">
                          <span style="font-size:14px;font-weight:700;color:#34d399;letter-spacing:0.3px;">&#10003;&nbsp;&nbsp;Registration Confirmed</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════ GREETING ═══════════════ -->
          <tr>
            <td class="email-content" style="padding:36px 40px 0;">
              <p style="margin:0;font-size:18px;color:#0f172a;line-height:1.5;font-weight:700;">
                Hello ${name} &#128075;
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#64748b;line-height:1.75;">
                Congratulations! Your registration for <strong style="color:#1e3a5f;">${event}</strong> has been confirmed successfully. Below are your complete registration details — please save this email for reference.
              </p>
            </td>
          </tr>

          <!-- ═══════════════ REGISTRATION ID CARD ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(140deg,#eff6ff 0%,#dbeafe 50%,#e0e7ff 100%);border:1.5px solid #bfdbfe;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px;text-align:center;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align:center;">
                          <span style="font-size:10px;color:#3b82f6;text-transform:uppercase;letter-spacing:0.15em;font-weight:800;display:block;margin-bottom:8px;">Your Registration ID</span>
                          <span class="reg-id-text" style="font-size:42px;font-weight:900;color:#1e40af;letter-spacing:2px;line-height:1.1;display:block;">${regId}</span>
                          <span style="display:block;margin-top:10px;font-size:11px;color:#6b7280;font-weight:500;">&#128196; Show this ID at the venue for check-in</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════ PARTICIPANT DETAILS ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:28px 40px 0;">
              ${sectionHeader('Participant Details', '#2563eb', '&#128100;')}
              ${detailsTable(`
                ${detailRowBold('Name', name)}
                ${detailRow('Email', data.leaderEmail)}
                ${detailRow('Phone', phone)}
                ${detailRow('College', college)}
                ${detailRow('Department', department)}
                ${detailRow('Year', year)}
                ${detailRow('City', city, true)}
              `)}
            </td>
          </tr>

          <!-- ═══════════════ EVENT DETAILS ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:24px 40px 0;">
              ${sectionHeader('Event Details', '#8b5cf6', '&#127942;')}
              ${detailsTable(`
                ${detailRowBold('Event', event, '#4f46e5')}
                ${paperRow}
                <tr>
                  <td style="padding:13px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">Participation</td>
                  <td style="padding:13px 16px;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:13px;">
                    ${participationBadge}
                  </td>
                </tr>
                ${detailRow('Registered On', registeredOn, true)}
              `)}
            </td>
          </tr>

          ${teamMembersSection}

          <!-- ═══════════════ PAYMENT DETAILS ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:24px 40px 0;">
              ${sectionHeader('Payment Summary', '#10b981', '&#128179;')}
              ${detailsTable(`
                <tr>
                  <td style="padding:16px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">Amount Paid</td>
                  <td style="padding:16px 16px;border-bottom:1px solid #f1f5f9;font-size:20px;font-weight:900;color:#059669;">${fee}</td>
                </tr>
                ${monoRow('Payment ID', paymentId)}
                ${monoRow('Order ID', orderId)}
                <tr>
                  <td style="padding:13px 16px;color:#64748b;font-size:13px;font-weight:600;width:38%;background:#f8fafc;letter-spacing:0.01em;">Status</td>
                  <td style="padding:13px 16px;">
                    <span style="display:inline-block;background:linear-gradient(135deg,#ecfdf5,#d1fae5);color:#047857;font-size:11px;font-weight:800;padding:5px 16px;border-radius:100px;letter-spacing:0.02em;border:1px solid #a7f3d0;">&#10003;&nbsp; Payment Confirmed</span>
                  </td>
                </tr>
              `)}
            </td>
          </tr>

          <!-- ═══════════════ WHAT'S NEXT ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:32px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(140deg,#fffbeb 0%,#fef3c7 60%,#fde68a 100%);border:1.5px solid #fcd34d;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:15px;font-weight:800;color:#92400e;letter-spacing:-0.01em;">
                      &#128204;&nbsp; What's Next?
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;vertical-align:top;width:32px;">
                          <span style="display:inline-block;width:24px;height:24px;background:#f59e0b;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;">1</span>
                        </td>
                        <td style="padding:6px 0;color:#78350f;font-size:13px;line-height:1.65;font-weight:500;">
                          <strong>Save this email</strong> — you'll need Registration ID <strong style="color:#b45309;">#${regId}</strong> at the venue for check-in
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;vertical-align:top;width:32px;">
                          <span style="display:inline-block;width:24px;height:24px;background:#f59e0b;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;">2</span>
                        </td>
                        <td style="padding:6px 0;color:#78350f;font-size:13px;line-height:1.65;font-weight:500;">
                          <strong>Watch your inbox</strong> for event schedule, venue map, and important announcements
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;vertical-align:top;width:32px;">
                          <span style="display:inline-block;width:24px;height:24px;background:#f59e0b;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;">3</span>
                        </td>
                        <td style="padding:6px 0;color:#78350f;font-size:13px;line-height:1.65;font-weight:500;">
                          <strong>Follow us</strong> on social media for live updates and behind-the-scenes content
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════ NEED HELP ═══════════════ -->
          <tr>
            <td class="section-pad" style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:22px 28px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#334155;">&#128172;&nbsp; Need Help?</p>
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:2;">
                      Email: <a href="mailto:${senderEmail}" style="color:#2563eb;text-decoration:none;font-weight:600;">${senderEmail}</a>
                      &nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                      Phone: <a href="tel:${SUPPORT_PHONE.replace(/\s/g, '')}" style="color:#2563eb;text-decoration:none;font-weight:600;">${SUPPORT_PHONE}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══════════════ DIVIDER ═══════════════ -->
          <tr>
            <td style="padding:32px 40px 0;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0 20%,#e2e8f0 80%,transparent);"></div>
            </td>
          </tr>

          <!-- ═══════════════ FOOTER ═══════════════ -->
          <tr>
            <td style="background:linear-gradient(145deg,#020617 0%,#0f172a 50%,#1e3a5f 100%);padding:0;">
              <!-- Footer accent line -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 35%,#ec4899 70%,#f59e0b 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="footer-pad" style="padding:28px 40px 16px;text-align:center;">
                    <!-- Footer Brand -->
                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.95);font-weight:700;letter-spacing:-0.01em;">
                      Team ${EVENT_NAME}
                    </p>
                    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);font-weight:500;">
                      Annasaheb Dange College of Engineering &amp; Technology, Ashta
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 24px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.8;">
                      &copy; ${COPYRIGHT_YEAR} Discovery ADCET. All rights reserved.
                    </p>
                    <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.25);line-height:1.6;">
                      You received this email because you registered for ${EVENT_NAME}.
                      <br>This is a transactional email — no unsubscribe is required.
                    </p>
                  </td>
                </tr>
              </table>
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
    from: `${EVENT_NAME} <${senderEmail}>`,
    to,
    subject: `✅ Registration Confirmed | ${EVENT_NAME} — #${regId}`,
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

      // Short backoff
      const delay = 1000 * attempt;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}