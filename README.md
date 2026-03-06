# Healthcare Appointment Reminder System

Production-quality MERN stack application for **multilingual appointment scheduling and reminders** for underprivileged patients (including illiterate users). Nurses register patients, doctors manage appointments, and patients receive reminders via **SMS, email, and voice calls** without needing to log in.

## Stack

- **Frontend:** React (Vite), TailwindCSS, ShadCN-style UI, React Router, React Query, i18next (EN / HI / MR)
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Notifications:** SMS (Twilio), Email (Nodemailer), Voice (Twilio)
- **Security:** Helmet, express-rate-limit, CORS, xss-clean, mongo-sanitize
- **Other:** node-cron (daily 8 AM reminders), Socket.io (real-time doctor queue)

## Project structure

```
healthcare-appointment-system/
├── backend/          # Express API, auth, cron, Socket.io
├── frontend/         # React Vite app
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, optional EMAIL_* and TWILIO_*
npm install
npm run dev
```

Seed admin user (optional):

```bash
ADMIN_EMAIL=admin@hospital.com ADMIN_PASSWORD=admin123 node scripts/seedAdmin.js
```

### Frontend

```bash
cd frontend
npm install
# If you see peer dependency errors (e.g. React 19 vs lucide-react), use:
# npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173 and log in as admin (then add doctors/nurses from Admin dashboard).

### Docker

```bash
docker-compose up --build
```

API: http://localhost:5000. Mount frontend separately or build into image as in Dockerfile.

## Environment variables

**Backend (`.env`):**

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET`, `JWT_EXPIRE`
- `CORS_ORIGIN` – Frontend origin(s), comma-separated
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` – SMTP for reminders
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` – SMS/Voice (optional)

**Frontend:** `VITE_API_URL` – Backend API URL (default `http://localhost:5000/api`)

## Roles

- **Admin:** Manage doctors and nurses, view analytics.
- **Doctor:** View/update appointments, set availability, see real-time queue.
- **Nurse:** Register patients, create/reschedule appointments, check-in patients.
- **Patients:** No login; reminders sent in preferred language (EN/HI/MR).

## API overview

- `POST /api/auth/login` – Login
- `POST /api/auth/register` – Register doctor/nurse (admin only)
- `GET/POST /api/patients` – List/create patients
- `GET/POST /api/appointments`, `PUT /api/appointments/:id`, `POST /api/appointments/:id/check-in`
- `GET /api/appointments/slots?doctorId=&date=` – Available slots
- `GET /api/doctors`, `GET /api/doctors/queue`, `GET/PUT /api/doctors/availability`
- `GET /api/admin/users`, `GET /api/admin/analytics`

## License

MIT
