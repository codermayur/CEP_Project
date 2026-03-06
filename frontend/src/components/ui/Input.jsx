import { cn } from '../../lib/utils.js';

export function Input({ className, label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        className={cn(
          'w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
