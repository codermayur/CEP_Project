import { cn } from '../../lib/utils.js';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  waiting: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  missed: 'bg-slate-100 text-slate-700',
};

export function Badge({ status, className, children }) {
  const text = children ?? status;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
        statusColors[status] || 'bg-slate-100 text-slate-700',
        className
      )}
    >
      {text}
    </span>
  );
}
