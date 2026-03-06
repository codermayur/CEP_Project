import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { adminApi, authApi } from '../services/api.js';

export function AdminUsers({ roleType = 'doctor' }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: roleType });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleType],
    queryFn: () => adminApi.users(roleType),
  });

  const registerMutation = useMutation({
    mutationFn: (body) => authApi.registerUser({ ...body, role: roleType }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', phone: '', role: roleType });
    },
  });

  const users = data?.data ?? [];

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  const title = roleType === 'doctor' ? t('manage_doctors') : t('manage_nurses');
  const addLabel = roleType === 'doctor' ? t('add_doctor') : t('add_nurse');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? t('cancel') : addLabel}</Button>
      </div>
      {showForm && (
        <Card>
          <CardHeader>{addLabel}</CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('name')}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label={t('email')}
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              label={t('password')}
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            <Input
              label={t('phone')}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            {registerMutation.error && (
              <p className="text-sm text-red-600">{registerMutation.error.message}</p>
            )}
            <Button type="submit" disabled={registerMutation.isPending}>
              {t('save')}
            </Button>
          </form>
        </Card>
      )}
      <Card>
        <CardHeader>{title}</CardHeader>
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('name')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('email')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('phone')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{t('role')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{t(u.role)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && <p className="p-4 text-slate-500">{t('no_patients')}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
