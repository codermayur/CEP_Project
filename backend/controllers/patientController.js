import Patient from '../models/Patient.js';
import { logActivity } from '../utils/logger.js';

/**
 * Create patient (nurse only)
 */
export const createPatient = async (req, res, next) => {
  try {
    const { name, phone, email, preferredLanguage } = req.body;
    const patient = await Patient.create({
      name: name?.trim(),
      phone: phone?.trim(),
      email: email?.trim() || '',
      preferredLanguage: preferredLanguage || 'en',
      registeredBy: req.user._id,
    });
    await logActivity(req.user._id, 'patient_registered', 'patient', patient._id);
    res.status(201).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all patients (nurse/admin) or search by phone
 */
export const getPatients = async (req, res, next) => {
  try {
    const { phone } = req.query;
    const filter = {};
    if (phone) filter.phone = { $regex: phone.trim(), $options: 'i' };
    const patients = await Patient.find(filter)
      .populate('registeredBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single patient by ID
 */
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'name email');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

/**
 * Update patient
 */
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};
