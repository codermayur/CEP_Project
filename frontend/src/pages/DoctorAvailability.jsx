import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { doctorsApi } from '../services/api.js';

export function DoctorAvailability() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ defaultStart: '09:00', defaultEnd: '13:00', slotDurationMinutes: 10 });

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('set_availability')}</h2>
      <Card>
        <CardHeader>{t('availability')}</CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
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
            onChange={(e) => setForm((f) => ({ ...f, slotDurationMinutes: Number(e.target.value) || 10 }))}
          />
          {mutation.isSuccess && <p className="text-sm text-green-600">Saved.</p>}
          <Button type="submit" disabled={mutation.isPending}>{t('save')}</Button>
        </form>
      </Card>
    </div>
  );
}
