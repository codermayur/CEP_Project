import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'patient_registered',
        'appointment_created',
        'appointment_rescheduled',
        'appointment_completed',
        'appointment_cancelled',
        'doctor_viewed_patient',
        'notes_added',
        'patient_checked_in',
      ],
    },
    resource: {
      type: String,
      enum: ['patient', 'appointment', 'user'],
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
