import cron from 'node-cron';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { sendSMS } from '../services/smsService.js';
import { sendEmail } from '../services/emailService.js';
import { placeVoiceCall } from '../services/voiceService.js';
import { reminderMessages } from '../utils/reminderMessages.js';

/**
 * Format date for display in reminders (e.g. "March 7, 2026" or localized)
 */
function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Send reminders for appointments on the given date (tomorrow when run at 8 AM).
 * Sends SMS, email, and voice in patient's preferred language.
 */
async function sendRemindersForDate(targetDate) {
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const appointments = await Appointment.find({
    appointmentDate: { $gte: start, $lt: end },
    status: { $in: ['scheduled', 'waiting'] },
    reminderSent: false,
  })
    .populate('patientId')
    .populate('doctorId', 'name');

  for (const apt of appointments) {
    const lang = apt.patientId?.preferredLanguage || 'en';
    const messages = reminderMessages[lang] || reminderMessages.en;
    const dateStr = formatDate(apt.appointmentDate);
    const timeStr = apt.appointmentTime;
    const doctorName = apt.doctorId?.name || 'Doctor';

    const smsText = messages.sms(dateStr, timeStr);
    const emailBody = messages.emailBody(dateStr, timeStr, doctorName);
    const voiceText = messages.voice(dateStr, timeStr);

    const phone = apt.patientId?.phone;
    const email = apt.patientId?.email;

    if (phone) {
      await sendSMS(phone, smsText);
      await placeVoiceCall(phone, voiceText);
    }
    if (email) {
      await sendEmail({
        to: email,
        subject: messages.emailSubject,
        text: emailBody,
        html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`,
      });
    }

    apt.reminderSent = true;
    await apt.save();
  }
}

/**
 * Run daily at 8:00 AM - find appointments for tomorrow and send reminders
 */
export function startReminderCron() {
  cron.schedule('0 8 * * *', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      await sendRemindersForDate(tomorrow);
    } catch (err) {
      console.error('Reminder cron error:', err);
    }
  });
  console.log('Reminder cron scheduled (daily 8:00 AM)');
}
