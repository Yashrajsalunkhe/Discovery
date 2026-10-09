import Razorpay from 'razorpay';

// Values pasted into hosting dashboards often carry a trailing newline or space,
// which silently breaks Razorpay auth and signature checks.
const readEnv = (name: string) => process.env[name]?.trim() || '';

export const getRazorpayCredentials = () => ({
  keyId: readEnv('RAZORPAY_KEY_ID'),
  keySecret: readEnv('RAZORPAY_KEY_SECRET'),
  webhookSecret: readEnv('RAZORPAY_WEBHOOK_SECRET'),
});

export const getRazorpayClient = () => {
  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_CREDENTIALS_MISSING');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};
