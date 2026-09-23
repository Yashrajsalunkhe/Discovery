import nodemailer, { type Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const emailEnabled = process.env.EMAIL_ENABLED === 'true';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE !== 'false';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const senderEmail = process.env.EMAIL_FROM || smtpUser || '';

// Only log config details in development
if (process.env.NODE_ENV !== 'production') {
  console.log('📧 Email config:', {
    emailEnabled,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser: smtpUser ? `${smtpUser.substring(0, 3)}***` : 'Missing',
    smtpPass: smtpPass ? 'Set (hidden)' : 'Missing',
    senderEmail: senderEmail || 'Not configured',
  });
}

if (emailEnabled && (!smtpUser || !smtpPass)) {
  throw new Error(
    'SMTP_USER and SMTP_PASS must be set when EMAIL_ENABLED is true. ' +
    'For Gmail, generate an App Password at https://myaccount.google.com/apppasswords'
  );
}

let transporter: Transporter | null = null;

if (emailEnabled && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Connection pool for better performance under load
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    // TLS options for robustness
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    // Timeouts to prevent hanging
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 30000,     // 30s
  });

  // Verify SMTP connection on startup
  transporter.verify()
    .then(() => {
      console.log('✅ SMTP connection verified — email sending is ready');
    })
    .catch((err) => {
      console.error('❌ SMTP connection verification FAILED:', err.message);
      console.error('   → Check your SMTP_USER and SMTP_PASS in .env');
      console.error('   → For Gmail, ensure 2FA is enabled and use an App Password');
    });
} else {
  console.log('ℹ️  Email sending is disabled (EMAIL_ENABLED is not "true" or credentials missing)');
}

export interface SendMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export async function sendMail(options: SendMailOptions): Promise<{ id: string } | null> {
  if (!emailEnabled || !transporter) {
    console.log('📧 Email disabled, skipping send to:', options.to);
    return null;
  }

  const result = await transporter.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    headers: options.headers,
  });

  console.log('✅ Email sent via SMTP:', result.messageId, 'to:', options.to);
  return { id: result.messageId };
}

export { transporter, senderEmail };
export default transporter;