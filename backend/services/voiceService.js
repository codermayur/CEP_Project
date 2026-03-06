/**
 * Voice call reminder. Integrate with Twilio when credentials are set.
 * Initiates outbound call to play reminder message (e.g. via TwiML).
 * For now we log the intent; full implementation would use Twilio REST to create a call.
 */
export async function placeVoiceCall(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const voiceUrl = process.env.TWILIO_VOICE_URL;

  if (!accountSid || !authToken || !from) {
    console.log('[Voice (mock)]', { to: phone, message });
    return { success: true };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const body = new URLSearchParams({
    To: phone,
    From: from,
    Url: voiceUrl || 'https://handler.twilio.com/twiml/placeholder',
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }
    return { success: true };
  } catch (err) {
    console.error('Voice call error:', err.message);
    return { success: false, error: err.message };
  }
}
