import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { DashboardLayout } from './layouts/DashboardLayout.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminUsers } from './pages/AdminUsers.jsx';
import { AdminAnalytics } from './pages/AdminAnalytics.jsx';
import { DoctorDashboard } from './pages/DoctorDashboard.jsx';
import { DoctorQueue } from './pages/DoctorQueue.jsx';
import { DoctorAvailability } from './pages/DoctorAvailability.jsx';
import { NurseDashboard } from './pages/NurseDashboard.jsx';
import { NurseRegisterPatient } from './pages/NurseRegisterPatient.jsx';
import { NurseAppointments } from './pages/NurseAppointments.jsx';
import { NursePatients } from './pages/NursePatients.jsx';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30 * 1000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout titleKey="admin_dashboard" />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminUsers roleType="doctor" />} />
            <Route path="nurses" element={<AdminUsers roleType="nurse" />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayout titleKey="doctor_dashboard" />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="queue" element={<DoctorQueue />} />
            <Route path="availability" element={<DoctorAvailability />} />
          </Route>
          <Route
            path="/nurse"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <DashboardLayout titleKey="nurse_dashboard" />
              </ProtectedRoute>
            }
          >
            <Route index element={<NurseDashboard />} />
            <Route path="register-patient" element={<NurseRegisterPatient />} />
            <Route path="appointments" element={<NurseAppointments />} />
            <Route path="patients" element={<NursePatients />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
