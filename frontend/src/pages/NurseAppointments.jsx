import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('create_appointment')}</h2>
        <p className="mt-1 text-sm text-slate-500">Book appointments and view by date</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentForm onSuccess={refetch} />
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('appointments')}
            </CardHeader>
            <Input
              label={t('appointment_date')}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mb-4"
            />
            <AppointmentTable appointments={appointments} />
          </Card>
        </div>
      </div>
    </div>
  );
}
