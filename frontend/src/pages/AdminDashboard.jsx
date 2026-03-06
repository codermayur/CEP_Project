import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Users, UserCog, UserPlus, BarChart3, Activity } from 'lucide-react';
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
        <h2 className="text-2xl font-bold text-slate-800">{t('admin_dashboard')}</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of your healthcare platform</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        <CardHeader className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t('recent_activity')}
        </CardHeader>
        <div className="space-y-2">
          {stats?.recentActivity?.length ? (
            stats.recentActivity.map((log) => (
              <div
                key={log._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-700">
                  {log.userId?.name} — {log.action}
                </span>
                <span className="text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-xl bg-slate-50/80 px-4 py-6 text-center text-slate-500">
              No recent activity
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
