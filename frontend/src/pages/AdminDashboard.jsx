import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Users, UserCog, UserPlus, BarChart3 } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { adminApi } from '../services/api.js';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.analytics(),
  });

  const stats = data?.data;
  if (isLoading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('admin_dashboard')}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t('total_doctors')}
          value={stats?.doctorCount ?? 0}
          icon={UserCog}
        />
        <DashboardCard
          title={t('total_nurses')}
          value={stats?.nurseCount ?? 0}
          icon={UserPlus}
        />
        <DashboardCard
          title={t('total_patients')}
          value={stats?.patientCount ?? 0}
          icon={Users}
        />
        <DashboardCard
          title={t('analytics')}
          value="—"
          icon={BarChart3}
        />
      </div>
      <Card>
        <CardHeader>{t('recent_activity')}</CardHeader>
        <div className="space-y-2">
          {stats?.recentActivity?.length ? (
            stats.recentActivity.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm"
              >
                <span className="text-slate-700">{log.userId?.name} — {log.action}</span>
                <span className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
}
