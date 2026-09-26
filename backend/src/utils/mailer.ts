import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Read config from env (evaluated at module load — fine for serverless)
const emailEnabled = process.env.EMAIL_ENABLED === 'true';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE !== 'false';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const senderEmail = process.env.EMAIL_FROM || smtpUser || '';

// Log config on cold start (non-production only)
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
  console.error(
    '⚠️ SMTP_USER and SMTP_PASS must be set when EMAIL_ENABLED is true. ' +
    'For Gmail, generate an App Password at https://myaccount.google.com/apppasswords'
  );
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

/**
 * Create a fresh SMTP transporter for each send.
 * In serverless (Vercel), module-level transporters go stale when the
 * function instance is frozen/thawed between invocations.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    // Aggressive timeouts for serverless — fail fast, don't hang
    connectionTimeout: 5000,  // 5s to connect
    greetingTimeout: 5000,    // 5s for SMTP greeting
    socketTimeout: 10000,     // 10s for the actual send
  } as nodemailer.TransportOptions);
}

/**
 * Send an email with a hard timeout to prevent Vercel function timeouts.
 * Creates a fresh SMTP connection each time (serverless-safe).
 */
export async function sendMail(options: SendMailOptions): Promise<{ id: string } | null> {
  if (!emailEnabled) {
    console.log('📧 Email disabled (EMAIL_ENABLED !== "true"), skipping send to:', options.to);
    return null;
  }

  if (!smtpUser || !smtpPass) {
    console.log('📧 SMTP credentials missing, skipping send to:', options.to);
    return null;
  }

  // Hard timeout: 8 seconds max per email send (Vercel hobby = 10s, pro = 60s)
  const EMAIL_SEND_TIMEOUT = 8000;

  const sendPromise = (async () => {
    const transporter = createTransporter();
    try {
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
    } finally {
      // Always close the connection — don't leave it dangling
      transporter.close();
    }
  })();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Email send timed out after ${EMAIL_SEND_TIMEOUT}ms`)), EMAIL_SEND_TIMEOUT)
  );

  return Promise.race([sendPromise, timeoutPromise]);
}

export { senderEmail };