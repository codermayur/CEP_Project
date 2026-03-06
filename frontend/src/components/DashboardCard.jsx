import { Card } from './ui/Card.jsx';

export function DashboardCard({ title, value, icon: Icon, subtitle }) {
  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </Card>
  );
}
