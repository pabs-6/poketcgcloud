import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'type';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-poke-gray-100 dark:bg-poke-gray-800 text-poke-gray-800 dark:text-poke-gray-200',
    red: 'bg-poke-red/10 text-poke-red',
    type: 'bg-poke-black/10 dark:bg-white/10 text-poke-black dark:text-poke-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
