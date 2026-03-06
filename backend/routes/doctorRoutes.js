import express from 'express';
import {
  getDoctors,
  getTodayQueue,
  setAvailability,
  getAvailability,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'nurse', 'doctor'), getDoctors);
router.get('/queue', authorize('doctor', 'admin'), getTodayQueue);
router.get('/availability', authorize('doctor', 'admin', 'nurse'), getAvailability);
router.put('/availability', authorize('doctor'), setAvailability);

export default router;
