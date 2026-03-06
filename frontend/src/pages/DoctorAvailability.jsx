import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CalendarClock } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { doctorsApi } from '../services/api.js';

export function DoctorAvailability() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    defaultStart: '09:00',
    defaultEnd: '13:00',
    slotDurationMinutes: 10,
  });

  const { data } = useQuery({
    queryKey: ['doctor-availability'],
    queryFn: () => doctorsApi.availability(),
  });

  const availability = data?.data;
  const mutation = useMutation({
    mutationFn: (body) => doctorsApi.setAvailability(body),
    onSuccess: () => queryClient.invalidateQueries(['doctor-availability']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('set_availability')}</h2>
        <p className="mt-1 text-sm text-slate-500">Set your working hours and slot duration</p>
      </div>
      <Card className="max-w-md">
        <CardHeader className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          {t('availability')}
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label={t('start_time')}
            type="time"
            value={form.defaultStart}
            onChange={(e) => setForm((f) => ({ ...f, defaultStart: e.target.value }))}
          />
          <Input
            label={t('end_time')}
            type="time"
            value={form.defaultEnd}
            onChange={(e) => setForm((f) => ({ ...f, defaultEnd: e.target.value }))}
          />
          <Input
            label={t('slot_duration')}
            type="number"
            min={5}
            max={60}
            value={form.slotDurationMinutes}
            onChange={(e) =>
              setForm((f) => ({ ...f, slotDurationMinutes: Number(e.target.value) || 10 }))
            }
          />
          {mutation.isSuccess && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Saved.</p>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {t('save')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
