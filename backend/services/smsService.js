/**
 * SMS service. Integrate with Twilio when TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set.
 * Otherwise logs the message (for development).
 */
async function sendTwilioSMS(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) return { success: false, error: 'Twilio not configured' };

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }
  return { success: true };
}

/**
 * Send SMS to patient. Uses Twilio if configured; otherwise logs.
 */
export async function sendSMS(phone, message) {
  const normalized = phone.replace(/\D/g, '');
  if (normalized.length < 10) {
    return { success: false, error: 'Invalid phone number' };
  }
  const twilioResult = await sendTwilioSMS(phone, message);
  if (twilioResult.success) return twilioResult;
  console.log('[SMS (mock)]', { to: phone, message });
  return { success: true };
}
