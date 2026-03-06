import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) {
    console.warn('Email credentials not configured. Emails will be logged only.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
}

/**
 * Send email. Falls back to console log if SMTP not configured.
 */
export async function sendEmail({ to, subject, text, html }) {
  const trans = getTransporter();
  const payload = { from: process.env.EMAIL_USER || 'noreply@healthcare.app', to, subject, text, html };
  if (!trans) {
    console.log('[Email (mock)]', payload);
    return { success: true };
  }
  try {
    await trans.sendMail(payload);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
}
