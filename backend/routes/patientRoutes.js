import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(authorize('admin', 'nurse', 'doctor'), getPatients).post(authorize('nurse'), createPatient);
router.route('/:id').get(authorize('admin', 'nurse', 'doctor'), getPatientById).put(authorize('nurse'), updatePatient);

export default router;
