import User from '../models/User.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import Appointment from '../models/Appointment.js';
import { generateSlots } from '../utils/slotGenerator.js';

/**
 * List all doctors (for admin and nurse dropdowns)
 */
export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email phone');
    res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    next(err);
  }
};

/**
 * Get today's queue (waiting + scheduled) for a doctor - used for real-time queue
 */
export const getTodayQueue = async (req, res, next) => {
  try {
    const doctorId = req.user.role === 'doctor' ? req.user._id : req.query.doctorId;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'doctorId required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queue = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['scheduled', 'waiting'] },
    })
      .populate('patientId')
      .sort({ appointmentTime: 1 });

    res.status(200).json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
};

/**
 * Set doctor availability (start, end, slot duration)
 */
export const setAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user._id;
    const { defaultStart, defaultEnd, slotDurationMinutes } = req.body;
    const start = defaultStart || '09:00';
    const end = defaultEnd || '13:00';
    const duration = slotDurationMinutes || 10;
    const slots = generateSlots(start, end, duration);

    const availability = await DoctorAvailability.findOneAndUpdate(
      { doctorId },
      { doctorId, slots, defaultStart: start, defaultEnd: end, slotDurationMinutes: duration },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};

/**
 * Get doctor availability (doctorId in query or current user)
 */
export const getAvailability = async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId || req.user._id;
    const availability = await DoctorAvailability.findOne({ doctorId });
    res.status(200).json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};
