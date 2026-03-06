import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  checkIn,
  getAvailableSlots,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/slots', authorize('admin', 'nurse', 'doctor'), getAvailableSlots);
router.route('/').get(authorize('admin', 'doctor', 'nurse'), getAppointments).post(authorize('nurse'), createAppointment);
router.route('/:id').get(authorize('admin', 'doctor', 'nurse'), getAppointmentById).put(authorize('doctor', 'nurse'), updateAppointment);
router.post('/:id/check-in', authorize('nurse'), checkIn);

export default router;
