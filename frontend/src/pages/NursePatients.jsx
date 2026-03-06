import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Users, Search } from 'lucide-react';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('patients')}</h2>
        <p className="mt-1 text-sm text-slate-500">Search and view registered patients</p>
      </div>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          {t('search_by_phone')}
        </CardHeader>
        <Input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="max-w-xs"
        />
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t('patients')}
        </CardHeader>
        {isLoading ? (
          <p className="py-8 text-center text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80">
                  <th className="px-5 py-4 font-semibold text-slate-700">{t('patient_name')}</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">{t('phone')}</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">{t('email')}</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">{t('preferred_language')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-medium text-slate-800">{p.name}</td>
                    <td className="px-5 py-4 text-slate-600">{p.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{p.email || '—'}</td>
                    <td className="px-5 py-4 text-slate-600">{p.preferredLanguage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!patients.length && (
              <p className="p-8 text-center text-slate-500">{t('no_patients')}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
