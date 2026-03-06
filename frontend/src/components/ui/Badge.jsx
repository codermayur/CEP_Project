import { cn } from '../../lib/utils.js';

const statusColors = {
  scheduled: 'bg-sky-50 text-sky-700 border-sky-200/60',
  waiting: 'bg-amber-50 text-amber-800 border-amber-200/60',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  cancelled: 'bg-red-50 text-red-700 border-red-200/60',
  missed: 'bg-slate-100 text-slate-600 border-slate-200/60',
};

export function Badge({ status, className, children }) {
  const text = children ?? status;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusColors[status] || 'bg-slate-100 text-slate-600 border-slate-200/60',
        className
      )}
    >
      {text}
    </span>
  );
}
