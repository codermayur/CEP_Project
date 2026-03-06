import { useTranslation } from 'react-i18next';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';

export function AppointmentTable({ appointments, onCheckIn, onComplete, onAddNotes, showCheckIn = false }) {
  const { t } = useTranslation();

  if (!appointments?.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-card">
        <p className="text-slate-500">{t('no_appointments')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80">
              <th className="px-5 py-4 font-semibold text-slate-700">{t('patient_name')}</th>
              <th className="px-5 py-4 font-semibold text-slate-700">{t('appointment_time')}</th>
              <th className="px-5 py-4 font-semibold text-slate-700">{t('status')}</th>
              {(showCheckIn || onComplete || onAddNotes) && (
                <th className="px-5 py-4 font-semibold text-slate-700">{t('actions')}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr key={apt._id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{apt.patientId?.name}</p>
                  <p className="text-slate-500">{apt.patientId?.phone}</p>
                </td>
                <td className="px-5 py-4 text-slate-700">{apt.appointmentTime}</td>
                <td className="px-5 py-4">
                  <Badge status={apt.status} />
                </td>
                {(showCheckIn || onComplete || onAddNotes) && (
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {showCheckIn && apt.status === 'scheduled' && (
                        <Button size="sm" onClick={() => onCheckIn(apt._id)}>
                          {t('check_in')}
                        </Button>
                      )}
                      {onComplete && apt.status === 'waiting' && (
                        <Button size="sm" variant="secondary" onClick={() => onComplete(apt._id)}>
                          {t('mark_completed')}
                        </Button>
                      )}
                      {onAddNotes && (
                        <Button size="sm" variant="outline" onClick={() => onAddNotes(apt)}>
                          {t('add_notes')}
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
