import { cn } from '@/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, id, children, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-poke-gray-800 dark:text-poke-gray-200">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-poke-gray-200 dark:border-poke-gray-500 bg-white dark:bg-poke-gray-800 px-3 py-2.5 text-sm text-poke-black dark:text-poke-white focus:border-poke-red focus:outline-none focus:ring-1 focus:ring-poke-red transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
