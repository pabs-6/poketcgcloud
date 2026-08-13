import { cn } from '@/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-poke-gray-800 dark:text-poke-gray-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-poke-gray-200 dark:border-poke-gray-500 bg-white dark:bg-poke-gray-800 px-3 py-2 text-poke-black dark:text-poke-white placeholder:text-poke-gray-500 focus:border-poke-red focus:outline-none focus:ring-1 focus:ring-poke-red transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
