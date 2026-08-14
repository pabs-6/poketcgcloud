import { useTranslation } from 'react-i18next';
import { ShinyIcon } from '@/components/icons/Icons';
import { cn } from '@/utils';

interface ShinyToggleProps {
  shiny: boolean;
  onToggle: () => void;
  className?: string;
}

export function ShinyToggle({ shiny, onToggle, className }: ShinyToggleProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={shiny}
      aria-label={t('games.toggleShinyAria')}
      title={t('games.toggleShinyHint')}
      className={cn(
        'inline-flex w-[11.5rem] items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
        'cursor-pointer select-none touch-manipulation min-h-[44px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poke-red/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-poke-gray-900',
        'active:scale-[0.99]',
        shiny
          ? 'border-poke-red/50 bg-white dark:bg-poke-gray-800 text-poke-red hover:border-poke-red/70'
          : 'border-poke-gray-200 dark:border-poke-gray-600 bg-white dark:bg-poke-gray-800 text-poke-gray-700 dark:text-poke-gray-200 hover:border-poke-gray-300 dark:hover:border-poke-gray-500',
        className
      )}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-poke-gray-200 dark:border-poke-gray-600 bg-poke-gray-50 dark:bg-poke-gray-900">
        <ShinyIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left leading-tight">
        <span className="block">{shiny ? t('games.shinyOn') : t('games.shinyOff')}</span>
        <span className="block text-[10px] font-normal text-poke-gray-500 dark:text-poke-gray-400">
          {shiny ? t('games.shinyActiveHint') : t('games.shinyInactiveHint')}
        </span>
      </span>
    </button>
  );
}
