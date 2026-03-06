import validator from 'validator';

/**
 * Sanitize and validate input strings
 */
export const sanitizeString = (str) => (typeof str === 'string' ? str.trim() : '');

export const validateEmail = (email) => email && validator.isEmail(email);
export const validatePhone = (phone) => phone && /^[0-9+\-\s]{10,20}$/.test(phone);

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }
  next();
};

export const validateRegisterUser = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name?.trim() || !email?.trim() || !password || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, password and role required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  if (!['admin', 'doctor', 'nurse'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  next();
};
