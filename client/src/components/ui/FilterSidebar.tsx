import { useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { Button } from '@/components/ui/Button';
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isXl = breakpoint === 'xl';

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(`(min-width: ${isXl ? 1280 : 1024}px)`);
    if (mq.matches) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isXl]);

  const close = () => setOpen(false);

  return (
    <div className={cn('space-y-3', isXl ? 'xl:space-y-0' : 'lg:space-y-0')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between rounded-2xl border border-poke-gray-200/80 dark:border-poke-gray-800',
          'bg-white/90 dark:bg-poke-gray-800/90 px-4 py-3.5 text-left font-semibold backdrop-blur min-h-[48px]',
          'transition-colors hover:border-poke-red/30 touch-manipulation',
          isXl ? 'xl:hidden' : 'lg:hidden'
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

      {open && (
        <button
          type="button"
          aria-label={t('common.close')}
          className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-sm', isXl ? 'xl:hidden' : 'lg:hidden')}
          onClick={close}
        />
      )}

      <aside
        className={cn(
          'glass-panel h-fit space-y-4 p-4 sm:p-5',
          isXl ? 'xl:sticky xl:top-24' : 'lg:sticky lg:top-24',
          open
            ? cn(
                'fixed inset-y-0 left-0 z-50 block w-[min(100%,320px)] overflow-y-auto safe-area-pt safe-area-pb',
                isXl ? 'xl:hidden' : 'lg:hidden'
              )
            : cn('hidden', isXl ? 'xl:block' : 'lg:block'),
          className
        )}
      >
        <div className={cn('flex items-center justify-between gap-2', isXl ? 'xl:hidden' : 'lg:hidden')}>
          <h2 className="font-semibold text-sm">{title}</h2>
          <Button variant="ghost" size="sm" onClick={close} className="min-h-[44px] min-w-[44px]">
            ✕
          </Button>
        </div>

        <div className={cn('flex items-center justify-between', isXl ? 'hidden xl:flex' : 'hidden lg:flex')}>
          <h2 className="flex items-center gap-2 font-semibold text-sm">
            <FilterIcon className="h-4 w-4 text-poke-red" />
            {title}
          </h2>
          {onClear && clearLabel && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-poke-red hover:underline min-h-[44px]"
            >
              {clearLabel}
            </button>
          )}
        </div>

        {onClear && clearLabel && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'text-xs font-medium text-poke-red hover:underline min-h-[44px]',
              isXl ? 'xl:hidden' : 'lg:hidden'
            )}
          >
            {clearLabel}
          </button>
        )}

        {children}
      </aside>
    </div>
  );
}
