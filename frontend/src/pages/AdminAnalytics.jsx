import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BarChart3, Activity } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { adminApi } from '../services/api.js';

export function AdminAnalytics() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.analytics(),
  });

  const stats = data?.data;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 shadow-card">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t('analytics')}</h2>
        <p className="mt-1 text-sm text-slate-500">Appointment and activity overview</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('appointments')} (by status)
          </CardHeader>
          <div className="space-y-2">
            {stats?.appointmentStats &&
              Object.entries(stats.appointmentStats).map(([status, count]) => (
                <div
                  key={status}
                  className="flex justify-between rounded-xl bg-slate-50/80 px-4 py-3"
                >
                  <span className="font-medium text-slate-700">{t(status)}</span>
                  <span className="text-slate-600">{count}</span>
                </div>
              ))}
          </div>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {t('recent_activity')}
          </CardHeader>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {stats?.recentActivity?.map((log) => (
              <div
                key={log._id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-700">{log.userId?.name}</span>
                <span className="text-slate-500"> — {log.action}</span>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
