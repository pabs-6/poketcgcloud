import { cn } from '@/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-poke-gray-200 dark:border-poke-gray-800 bg-white dark:bg-poke-gray-800 p-4 sm:p-5', className)}>
      <p className="text-xs sm:text-sm font-medium text-poke-gray-500">{label}</p>
      <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-poke-red break-words">{value}</p>
      {hint && <p className="mt-1 text-xs text-poke-gray-500">{hint}</p>}
    </div>
  );
}
