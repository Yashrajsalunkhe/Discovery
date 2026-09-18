import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const resendApiKey = process.env.RESEND_API_KEY;
const emailEnabled = process.env.EMAIL_ENABLED === 'true';
const senderEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

console.log('Email config check:', {
  emailEnabled,
  resendApiKey: resendApiKey ? 'Set' : 'Missing',
  senderEmail,
  nodeEnv: process.env.NODE_ENV
});

if (emailEnabled && !resendApiKey) {
  throw new Error('RESEND_API_KEY must be set in environment variables when EMAIL_ENABLED is true');
}

let resend: Resend | null = null;

if (emailEnabled && resendApiKey) {
  resend = new Resend(resendApiKey);
  console.log('✅ Resend email client initialized');
} else {
  console.log('Email sending is disabled (EMAIL_ENABLED is not true or RESEND_API_KEY missing)');
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
 * Send an email via Resend HTTP API.
 * Works reliably on Vercel serverless (no SMTP connection needed).
 */
export async function sendMail(options: SendMailOptions): Promise<{ id: string } | null> {
  if (!emailEnabled || !resend) {
    console.log('📧 Email disabled, skipping send to:', options.to);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: options.from,
    to: [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo ? [options.replyTo] : undefined,
    headers: options.headers,
  });

  if (error) {
    console.error('❌ Resend email error:', error);
    throw new Error(`Resend email failed: ${error.message}`);
  }

  console.log('✅ Email sent via Resend:', data?.id, 'to:', options.to);
  return data;
}

export { resend, senderEmail };
export default resend;