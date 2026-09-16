import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailEnabled = process.env.EMAIL_ENABLED === 'true';

console.log('Email config check:', {
  emailEnabled,
  emailUser: emailUser ? 'Set' : 'Missing',
  emailPass: emailPass ? 'Set' : 'Missing',
  nodeEnv: process.env.NODE_ENV
});

if (emailEnabled && (!emailUser || !emailPass)) {
  throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables');
}

let transporter: Transporter;

if (emailEnabled) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    },
    secure: true,
    port: 465,
    requireTLS: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    pool: true,
    maxConnections: 5,
    maxMessages: 10
  });

  transporter.verify((error) => {
    if (error) {
      console.log("Email transporter error:", error);
    } else {
      console.log("Email transporter is ready");
    }
  });
} else {
  transporter = nodemailer.createTransport({ jsonTransport: true });
  console.log('Email sending is disabled (EMAIL_ENABLED is not true)');
}

export default transporter;