import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { PatientForm } from '../components/PatientForm.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { patientsApi } from '../services/api.js';

export function NurseRegisterPatient() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body) => patientsApi.create(body),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('register_patient')}</h2>
        <p className="mt-1 text-sm text-slate-500">Add a new patient to the system</p>
      </div>
      <div className="max-w-xl">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {t('register_patient')}
          </CardHeader>
          <PatientForm onSubmit={(form) => mutation.mutate(form)} />
          {mutation.isSuccess && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              Patient registered successfully.
            </p>
          )}
          {mutation.error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {mutation.error.message}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
