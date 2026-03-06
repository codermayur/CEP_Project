import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Calendar, UserPlus } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { AppointmentTable } from '../components/AppointmentTable.jsx';
import { appointmentsApi } from '../services/api.js';

export function NurseDashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = useQuery({
    queryKey: ['nurse-appointments', today],
    queryFn: () => appointmentsApi.list({ date: today }),
  });

  const appointments = data?.data ?? [];

  const handleCheckIn = async (id) => {
    await appointmentsApi.checkIn(id);
    queryClient.invalidateQueries(['nurse-appointments', today]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('nurse_dashboard')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard
          title={t('today_appointments')}
          value={appointments.length}
          icon={Calendar}
        />
        <DashboardCard
          title={t('create_appointment')}
          value="—"
          icon={UserPlus}
        />
      </div>
      <Card>
        <CardHeader>{t('today_appointments')}</CardHeader>
        <AppointmentTable appointments={appointments} showCheckIn onCheckIn={handleCheckIn} />
      </Card>
    </div>
  );
}
