import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/ui/Input.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { patientsApi } from '../services/api.js';

export function NursePatients() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['patients', phone],
    queryFn: () => patientsApi.list(phone ? { phone } : {}),
  });

  const patients = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('patients')}</h2>
      <Card>
        <CardHeader>{t('search_by_phone')}</CardHeader>
        <Input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="max-w-xs"
        />
      </Card>
      <Card>
        <CardHeader>{t('patients')}</CardHeader>
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('patient_name')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('phone')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('email')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('preferred_language')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{p.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{p.preferredLanguage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!patients.length && <p className="p-4 text-slate-500">{t('no_patients')}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
