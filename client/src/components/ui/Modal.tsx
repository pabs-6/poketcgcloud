import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative w-full max-w-md max-h-[min(90vh,720px)] overflow-y-auto',
          'rounded-t-2xl sm:rounded-xl bg-white dark:bg-poke-gray-800 p-5 sm:p-6 shadow-xl safe-area-pb',
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-poke-black dark:text-poke-white pr-2">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={t('common.close')} className="shrink-0 min-h-[40px] min-w-[40px]">
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
