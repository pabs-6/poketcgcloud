import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { CheckIcon } from '@/components/icons/Icons';
import type { ComponentType, SVGProps } from 'react';

interface CardActionButtonProps {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  loading?: boolean;
  success?: boolean;
  active?: boolean;
  primary?: boolean;
  onClick: () => void;
}

const baseButtonClass =
  'bg-poke-gray-100 dark:bg-poke-gray-800 text-poke-gray-600 dark:text-poke-gray-300 hover:bg-poke-red/10 hover:text-poke-red hover:scale-105';

export function CardActionButton({
  label,
  icon: Icon,
  loading,
  success,
  active,
  primary = false,
  onClick,
}: CardActionButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      title={label}
      aria-label={success ? `${label} — ${t('common.added')}` : label}
      disabled={loading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-60',
        success
          ? 'bg-green-600 text-white scale-105 shadow-md shadow-green-600/30'
          : baseButtonClass
      )}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : success ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <Icon
          className={cn(
            'h-4 w-4',
            active && !primary && 'fill-poke-red text-poke-red stroke-poke-red'
          )}
        />
      )}
      {primary && !loading && !success && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-poke-red shadow-sm dark:bg-poke-gray-900"
          aria-hidden
        >
          {active ? (
            <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
          ) : (
            <span className="text-[10px] font-bold leading-none">+</span>
          )}
        </span>
      )}
    </button>
  );
}
