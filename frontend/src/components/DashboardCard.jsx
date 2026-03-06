import { Card } from './ui/Card.jsx';
import { cn } from '../lib/utils.js';

export function DashboardCard({ title, value, icon: Icon, subtitle, className }) {
  return (
    <Card
      className={cn(
        'flex items-center gap-5 transition-shadow hover:shadow-cardHover',
        className
      )}
    >
      {Icon && (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-800">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </Card>
  );
}
