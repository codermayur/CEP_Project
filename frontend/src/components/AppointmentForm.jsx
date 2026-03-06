import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appointmentsApi, patientsApi, doctorsApi } from '../services/api.js';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Card, CardHeader } from './ui/Card.jsx';

export function AppointmentForm({ onSuccess }) {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    doctorsApi.list().then((r) => setDoctors(r.data)).catch(() => setDoctors([]));
    patientsApi.list().then((r) => setPatients(r.data)).catch(() => setPatients([]));
  }, []);

  useEffect(() => {
    if (!form.doctorId || !form.appointmentDate) return setSlots([]);
    appointmentsApi.slots(form.doctorId, form.appointmentDate).then((r) => setSlots(r.data)).catch(() => setSlots([]));
  }, [form.doctorId, form.appointmentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.appointmentTime) {
      return setError('Please fill all required fields');
    }
    setLoading(true);
    try {
      await appointmentsApi.create(form);
      onSuccess?.();
      setForm({ patientId: '', doctorId: '', appointmentDate: '', appointmentTime: '', notes: '' });
    } catch (err) {
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>{t('create_appointment')}</CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('select_patient')}</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={form.patientId}
            onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
            required
          >
            <option value="">-- {t('select_patient')} --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('select_doctor')}</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={form.doctorId}
            onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value }))}
            required
          >
            <option value="">-- {t('select_doctor')} --</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
        <Input
          label={t('appointment_date')}
          type="date"
          value={form.appointmentDate}
          onChange={(e) => setForm((f) => ({ ...f, appointmentDate: e.target.value }))}
          required
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('appointment_time')}</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={form.appointmentTime}
            onChange={(e) => setForm((f) => ({ ...f, appointmentTime: e.target.value }))}
            required
          >
            <option value="">-- Select time --</option>
            {slots.map((s) => (
              <option key={s.start} value={s.start}>{s.start}</option>
            ))}
          </select>
        </div>
        <Input
          label={t('notes')}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Optional notes"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg" disabled={loading}>{loading ? '...' : t('submit')}</Button>
      </form>
    </Card>
  );
}
