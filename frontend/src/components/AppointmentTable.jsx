import { useTranslation } from 'react-i18next';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';

export function AppointmentTable({ appointments, onCheckIn, onComplete, onAddNotes, showCheckIn = false }) {
  const { t } = useTranslation();

  if (!appointments?.length) {
    return (
      <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">{t('no_appointments')}</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-700">{t('patient_name')}</th>
            <th className="px-4 py-3 font-semibold text-slate-700">{t('appointment_time')}</th>
            <th className="px-4 py-3 font-semibold text-slate-700">{t('status')}</th>
            {(showCheckIn || onComplete || onAddNotes) && (
              <th className="px-4 py-3 font-semibold text-slate-700">{t('actions', 'Actions')}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.map((apt) => (
            <tr key={apt._id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{apt.patientId?.name}</p>
                <p className="text-sm text-slate-500">{apt.patientId?.phone}</p>
              </td>
              <td className="px-4 py-3 text-slate-700">{apt.appointmentTime}</td>
              <td className="px-4 py-3">
                <Badge status={apt.status} />
              </td>
{(showCheckIn || onComplete || onAddNotes) && (
              <td className="px-4 py-3 flex gap-2 flex-wrap">
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
