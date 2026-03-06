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
  if (isLoading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('analytics')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('appointments')} (by status)
          </CardHeader>
          <div className="space-y-2">
            {stats?.appointmentStats && Object.entries(stats.appointmentStats).map(([status, count]) => (
              <div key={status} className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                <span className="font-medium text-slate-700">{t(status)}</span>
                <span className="text-slate-600">{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('recent_activity')}
          </CardHeader>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {stats?.recentActivity?.map((log) => (
              <div key={log._id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{log.userId?.name}</span>
                <span className="text-slate-500"> — {log.action}</span>
                <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
