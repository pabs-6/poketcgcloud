import { cn } from '@/utils';
import type { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-poke-gray-200 dark:border-poke-gray-800 bg-white dark:bg-poke-gray-800 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
