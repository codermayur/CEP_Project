import { cn } from '../../lib/utils.js';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-md border border-slate-100', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4 text-lg font-semibold text-slate-800', className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn('', className)}>{children}</div>;
}
