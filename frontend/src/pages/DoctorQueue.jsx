import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Users, Calendar } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { doctorsApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { joinDoctorRoom, leaveDoctorRoom } from '../services/socket.js';

export function DoctorQueue() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const doctorId = user?.id;

  const { data, refetch } = useQuery({
    queryKey: ['doctor-queue', doctorId],
    queryFn: () => doctorsApi.queue(),
  });

  useEffect(() => {
    if (!doctorId) return;
    joinDoctorRoom(doctorId, () => refetch());
    return () => leaveDoctorRoom(doctorId);
  }, [doctorId, refetch]);

  const queue = data?.data ?? [];
  const waiting = queue.filter((a) => a.status === 'waiting');
  const scheduled = queue.filter((a) => a.status === 'scheduled');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('doctor_queue')}</h2>
        <p className="mt-1 text-sm text-slate-500">Real-time waiting and scheduled list</p>
      </div>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t('waiting_queue')} ({waiting.length})
        </CardHeader>
        <div className="space-y-3">
          {waiting.length === 0 ? (
            <p className="rounded-xl bg-slate-50/80 px-4 py-6 text-center text-slate-500">
              {t('no_appointments')}
            </p>
          ) : (
            waiting.map((apt, i) => (
              <div
                key={apt._id}
                className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3"
              >
                <div>
                  <span className="font-semibold text-slate-800">
                    #{i + 1} {apt.patientId?.name}
                  </span>
                  <p className="text-sm text-slate-500">
                    {apt.patientId?.phone} · {apt.appointmentTime}
                  </p>
                </div>
                <Badge status="waiting" />
              </div>
            ))
          )}
        </div>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t('scheduled')} (upcoming)
        </CardHeader>
        <div className="space-y-2">
          {scheduled.map((apt) => (
            <div
              key={apt._id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
            >
              <span className="font-medium text-slate-800">{apt.patientId?.name}</span>
              <span className="text-slate-600">{apt.appointmentTime}</span>
            </div>
          ))}
          {!scheduled.length && (
            <p className="rounded-xl bg-slate-50/80 px-4 py-6 text-center text-slate-500">
              {t('no_appointments')}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
