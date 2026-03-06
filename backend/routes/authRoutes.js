import express from 'express';
import { login, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateLogin, validateRegisterUser } from '../middleware/validate.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', protect, authorize('admin'), validateRegisterUser, registerUser);

export default router;
