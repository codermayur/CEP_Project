import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slots: [slotSchema],
    defaultStart: { type: String, default: '09:00' },
    defaultEnd: { type: String, default: '13:00' },
    slotDurationMinutes: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model('DoctorAvailability', availabilitySchema);
