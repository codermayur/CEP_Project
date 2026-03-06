import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PatientForm } from '../components/PatientForm.jsx';
import { patientsApi } from '../services/api.js';

export function NurseRegisterPatient() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body) => patientsApi.create(body),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('register_patient')}</h2>
      <div className="max-w-xl">
        <PatientForm
          onSubmit={(form) => mutation.mutate(form)}
        />
        {mutation.isSuccess && <p className="mt-4 text-green-600">Patient registered successfully.</p>}
        {mutation.error && <p className="mt-4 text-red-600">{mutation.error.message}</p>}
      </div>
    </div>
  );
}
