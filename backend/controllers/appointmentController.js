import Appointment from '../models/Appointment.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { logActivity } from '../utils/logger.js';
import { generateSlots } from '../utils/slotGenerator.js';
import { getIO } from '../utils/socket.js';

/**
 * Create appointment (nurse). Checks slot availability.
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, notes } = req.body;
    const nurseId = req.user._id;

    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTime?.trim(),
      status: { $in: ['scheduled', 'waiting'] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slot already booked' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      nurseId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTime?.trim(),
      notes: notes || '',
    });
    await logActivity(req.user._id, 'appointment_created', 'appointment', appointment._id);
    const populated = await Appointment.findById(appointment._id)
      .populate('patientId')
      .populate('doctorId', 'name email')
      .populate('nurseId', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

/**
 * Get appointments with filters
 */
export const getAppointments = async (req, res, next) => {
  try {
    const { doctorId, patientId, status, date, from, to } = req.query;
    const filter = {};
    if (req.user.role === 'doctor') filter.doctorId = req.user._id;
    if (req.user.role === 'nurse') filter.nurseId = req.user._id;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.appointmentDate = { $gte: d, $lt: nextDay };
    }
    if (from && to) {
      filter.appointmentDate = { $gte: new Date(from), $lte: new Date(to) };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId')
      .populate('doctorId', 'name email')
      .populate('nurseId', 'name')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single appointment
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId', 'name email')
      .populate('nurseId', 'name');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    if (req.user.role === 'doctor' && appointment.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    await logActivity(req.user._id, 'doctor_viewed_patient', 'appointment', appointment._id);
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

/**
 * Update appointment (reschedule, status, notes)
 */
export const updateAppointment = async (req, res, next) => {
  try {
    const { appointmentDate, appointmentTime, status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentDate !== undefined) appointment.appointmentDate = new Date(appointmentDate);
    if (appointmentTime !== undefined) appointment.appointmentTime = appointmentTime;
    if (status !== undefined) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    if (status === 'completed') {
      await logActivity(req.user._id, 'appointment_completed', 'appointment', appointment._id);
    } else if (appointmentDate || appointmentTime) {
      await logActivity(req.user._id, 'appointment_rescheduled', 'appointment', appointment._id);
    } else if (notes !== undefined) {
      await logActivity(req.user._id, 'notes_added', 'appointment', appointment._id);
    }

    const io = getIO();
    if (io) io.to(`doctor-${appointment.doctorId}`).emit('queue-update', {});

    const populated = await Appointment.findById(appointment._id)
      .populate('patientId')
      .populate('doctorId', 'name email')
      .populate('nurseId', 'name');
    res.status(200).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

/**
 * Check-in patient (nurse) - sets status to waiting; notifies doctor queue via Socket.io
 */
export const checkIn = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'waiting', checkInAt: new Date() },
      { new: true }
    )
      .populate('patientId')
      .populate('doctorId', 'name')
      .populate('nurseId', 'name');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    await logActivity(req.user._id, 'patient_checked_in', 'appointment', appointment._id);
    const io = getIO();
    if (io) io.to(`doctor-${appointment.doctorId._id}`).emit('queue-update', { appointment });
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

/**
 * Get available time slots for a doctor on a date
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    const docId = doctorId || (req.user.role === 'doctor' ? req.user._id : null);
    if (!docId || !date) {
      return res.status(400).json({ success: false, message: 'doctorId and date required' });
    }

    const availability = await DoctorAvailability.findOne({ doctorId: docId });
    const start = availability?.defaultStart || '09:00';
    const end = availability?.defaultEnd || '13:00';
    const interval = availability?.slotDurationMinutes || 10;
    const allSlots = generateSlots(start, end, interval);

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(appointmentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const booked = await Appointment.find({
      doctorId: docId,
      appointmentDate: { $gte: appointmentDate, $lt: nextDay },
      status: { $in: ['scheduled', 'waiting'] },
    }).select('appointmentTime');

    const bookedSet = new Set(booked.map((a) => a.appointmentTime));
    const available = allSlots.filter((s) => !bookedSet.has(s.start));

    res.status(200).json({ success: true, data: available });
  } catch (err) {
    next(err);
  }
};
