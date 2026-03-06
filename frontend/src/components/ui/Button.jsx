import { cn } from '../../lib/utils.js';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';
  const variants = {
    primary:
      'bg-primary text-white shadow-soft hover:bg-primary-hover focus:ring-primary active:scale-[0.98]',
    secondary:
      'bg-secondary text-white shadow-soft hover:bg-secondary-hover focus:ring-secondary active:scale-[0.98]',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3.5 text-base',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
