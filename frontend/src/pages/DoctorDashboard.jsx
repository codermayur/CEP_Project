import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Calendar, Users } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';
import { AppointmentTable } from '../components/AppointmentTable.jsx';
import { doctorsApi, appointmentsApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';

export function DoctorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: queueData } = useQuery({
    queryKey: ['doctor-queue', user?.id],
    queryFn: () => doctorsApi.queue(),
  });
  const { data: appointmentsData } = useQuery({
    queryKey: ['doctor-appointments', user?.id, today],
    queryFn: () => appointmentsApi.list({ date: today }),
  });

  const queue = queueData?.data ?? [];
  const appointments = appointmentsData?.data ?? [];
  const waitingCount = queue.filter((a) => a.status === 'waiting').length;

  const refetch = () => {
    queryClient.invalidateQueries(['doctor-queue', user?.id]);
    queryClient.invalidateQueries(['doctor-appointments', user?.id, today]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('doctor_dashboard')}</h2>
        <p className="mt-1 text-sm text-slate-500">Today&apos;s schedule and queue</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <DashboardCard
          title={t('today_appointments')}
          value={appointments.length}
          icon={Calendar}
        />
        <DashboardCard
          title={t('waiting_queue')}
          value={waitingCount}
          icon={Users}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">{t('today_appointments')}</h3>
        <AppointmentTable
          appointments={appointments}
          onComplete={async (id) => {
            await appointmentsApi.update(id, { status: 'completed' });
            refetch();
          }}
          onAddNotes={(apt) => {
            const notes = prompt(t('notes'), apt.notes);
            if (notes != null) appointmentsApi.update(apt._id, { notes }).then(refetch);
          }}
        />
      </div>
    </div>
  );
}
