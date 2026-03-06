import { cn } from '../../lib/utils.js';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('mb-5 text-base font-semibold text-slate-800', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn('', className)}>{children}</div>;
}
