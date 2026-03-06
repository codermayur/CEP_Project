import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'mongo-sanitize';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { startReminderCron } from './cron/reminderCron.js';
import { setIO } from './utils/socket.js';

// -----------------------------------------------------------------------------
// Config (environment variables – single source of truth)
// -----------------------------------------------------------------------------
const PORT = Number(process.env.PORT) || 5003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-appointments';

const app = express();
const httpServer = createServer(app);

// Socket.io - real-time doctor queue
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true },
});
setIO(io);

io.on('connection', (socket) => {
  socket.on('join-doctor-room', (doctorId) => {
    socket.join(`doctor-${doctorId}`);
  });
  socket.on('leave-doctor-room', (doctorId) => {
    socket.leave(`doctor-${doctorId}`);
  });
});

// Security: Helmet
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || ['http://localhost:5173'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing & sanitization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  next();
});

// xss-clean (strip HTML/scripts from input)
try {
  const xssClean = (await import('xss-clean')).default;
  app.use(xssClean());
} catch (_) {
  // optional
}

app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'OK' }));

// Serve frontend build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.use(errorHandler);

// -----------------------------------------------------------------------------
// Start server – single listen, with error handling
// -----------------------------------------------------------------------------
function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  httpServer.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      console.error('On macOS, port 5000 is often used by AirPlay. Use PORT=5001 in .env or run:');
      console.error('  lsof -i :' + PORT);
      console.error('  kill -9 <PID>');
      process.exit(1);
    }
    console.error('Server error:', error);
    process.exit(1);
  });
}

// -----------------------------------------------------------------------------
// Connect MongoDB, then start server (avoids starting server if DB fails)
// -----------------------------------------------------------------------------
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    startReminderCron();
    startServer();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

main();
