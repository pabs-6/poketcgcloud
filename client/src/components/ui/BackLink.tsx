import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';

interface BackLinkProps {
  fallbackTo: string;
  label: string;
  className?: string;
}

export function BackLink({ fallbackTo, label, className }: BackLinkProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-poke-red hover:underline',
        className
      )}
    >
      ← {label}
    </button>
  );
}
