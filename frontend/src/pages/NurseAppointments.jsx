import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppointmentForm } from '../components/AppointmentForm.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { AppointmentTable } from '../components/AppointmentTable.jsx';
import { appointmentsApi } from '../services/api.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function NurseAppointments() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data } = useQuery({
    queryKey: ['nurse-appointments-list', date],
    queryFn: () => appointmentsApi.list({ date }),
  });

  const appointments = data?.data ?? [];

  const refetch = () => queryClient.invalidateQueries(['nurse-appointments-list', date]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('create_appointment')}</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentForm onSuccess={refetch} />
        <div>
          <Card>
            <CardHeader>{t('appointments')}</CardHeader>
            <input
              type="date"
              className="mb-4 rounded-lg border border-slate-300 px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <AppointmentTable appointments={appointments} />
          </Card>
        </div>
      </div>
    </div>
  );
}
