import { useState, type ReactNode } from 'react';
import { cn } from '@/utils';
import { FilterIcon, ChevronDownIcon } from '@/components/icons/Icons';

interface FilterSidebarProps {
  title: string;
  clearLabel?: string;
  onClear?: () => void;
  children: ReactNode;
  className?: string;
  breakpoint?: 'lg' | 'xl';
}

export function FilterSidebar({
  title,
  clearLabel,
  onClear,
  children,
  className,
  breakpoint = 'lg',
}: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const bp = breakpoint === 'xl' ? 'xl' : 'lg';

  return (
    <div className={cn('space-y-3', bp === 'xl' ? 'xl:space-y-0' : 'lg:space-y-0')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between rounded-2xl border border-poke-gray-200/80 dark:border-poke-gray-800',
          'bg-white/90 dark:bg-poke-gray-800/90 px-4 py-3.5 text-left font-semibold backdrop-blur',
          'transition-colors hover:border-poke-red/30',
          bp === 'xl' ? 'xl:hidden' : 'lg:hidden'
        )}
      >
        <span className="flex items-center gap-2 text-sm">
          <FilterIcon className="h-4 w-4 text-poke-red shrink-0" />
          {title}
        </span>
        <ChevronDownIcon
          className={cn('h-5 w-5 text-poke-gray-500 transition-transform', open && 'rotate-180')}
        />
      </button>

      <aside
        className={cn(
          'glass-panel h-fit space-y-4 p-4 sm:p-5',
          bp === 'xl' ? 'xl:sticky xl:top-24' : 'lg:sticky lg:top-24',
          open ? 'block' : 'hidden',
          bp === 'xl' ? 'xl:block' : 'lg:block',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <h2
            className={cn(
              'flex items-center gap-2 font-semibold text-sm',
              bp === 'xl' ? 'hidden xl:flex' : 'hidden lg:flex'
            )}
          >
            <FilterIcon className="h-4 w-4 text-poke-red" />
            {title}
          </h2>
          {onClear && clearLabel && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'text-xs font-medium text-poke-red hover:underline',
                bp === 'xl' ? 'ml-auto xl:ml-0' : 'ml-auto lg:ml-0'
              )}
            >
              {clearLabel}
            </button>
          )}
        </div>
        {children}
      </aside>
    </div>
  );
}
