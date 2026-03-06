/**
 * Reminder messages in English, Hindi, and Marathi for SMS/Email/Voice.
 * Used for patients who may be illiterate - voice and simple SMS in preferred language.
 */

export const reminderMessages = {
  en: {
    sms: (date, time) =>
      `Reminder: Your doctor appointment is on ${date} at ${time}. Please arrive on time.`,
    emailSubject: 'Appointment Reminder',
    emailBody: (date, time, doctorName) =>
      `Your doctor appointment is scheduled for ${date} at ${time}. Doctor: ${doctorName}. Please arrive 10 minutes early.`,
    voice: (date, time) =>
      `Reminder. Your doctor appointment is on ${date} at ${time}. Please arrive on time.`,
  },
  hi: {
    sms: (date, time) =>
      `नमस्ते, आपकी डॉक्टर अपॉइंटमेंट ${date} को सुबह ${time} बजे है। कृपया समय पर पहुंचें।`,
    emailSubject: 'अपॉइंटमेंट रिमाइंडर',
    emailBody: (date, time, doctorName) =>
      `आपकी डॉक्टर अपॉइंटमेंट ${date} को ${time} बजे निर्धारित है। डॉक्टर: ${doctorName}. कृपया 10 मिनट पहले पहुंचें।`,
    voice: (date, time) =>
      `नमस्ते। आपकी डॉक्टर अपॉइंटमेंट ${date} को ${time} बजे है। कृपया समय पर पहुंचें।`,
  },
  mr: {
    sms: (date, time) =>
      `नमस्कार, तुमची डॉक्टर अपॉइंटमेंट ${date} रोजी सकाळी ${time} वाजता आहे. कृपया वेळेवर या.`,
    emailSubject: 'अपॉइंटमेंट रिमाइंडर',
    emailBody: (date, time, doctorName) =>
      `तुमची डॉक्टर अपॉइंटमेंट ${date} रोजी ${time} वाजता नियोजित आहे. डॉक्टर: ${doctorName}. कृपया 10 मिनिटे आधी या.`,
    voice: (date, time) =>
      `नमस्कार. तुमची डॉक्टर अपॉइंटमेंट उद्या सकाळी ${time} वाजता आहे. कृपया वेळेवर या.`,
  },
};
