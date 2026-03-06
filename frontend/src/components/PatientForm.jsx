import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Card, CardHeader } from './ui/Card.jsx';

export function PatientForm({ onSubmit, initialValues }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: initialValues?.name ?? '',
    phone: initialValues?.phone ?? '',
    email: initialValues?.email ?? '',
    preferredLanguage: initialValues?.preferredLanguage ?? 'en',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name?.trim()) return setError('Patient name required');
    if (!form.phone?.trim()) return setError('Phone required');
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader>{t('register_patient')}</CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t('patient_name')}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Full name"
          required
        />
        <Input
          label={t('phone')}
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="10-digit mobile"
          required
        />
        <Input
          label={t('email')}
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="optional"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('preferred_language')}</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={form.preferredLanguage}
            onChange={(e) => setForm((f) => ({ ...f, preferredLanguage: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg">{t('submit')}</Button>
      </form>
    </Card>
  );
}
