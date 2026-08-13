import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { EyeIcon, EyeOffIcon } from '@/components/icons/Icons';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, className, id, ...props }: PasswordInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-poke-gray-800 dark:text-poke-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(
            'w-full rounded-lg border border-poke-gray-200 dark:border-poke-gray-500 bg-white dark:bg-poke-gray-800 py-2 pl-3 pr-10 text-poke-black dark:text-poke-white placeholder:text-poke-gray-500 focus:border-poke-red focus:outline-none focus:ring-1 focus:ring-poke-red transition-colors',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-poke-gray-400 hover:text-poke-gray-700 dark:hover:text-poke-gray-200 transition-colors"
          aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
          tabIndex={0}
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
