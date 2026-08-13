import { cn } from '@/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-poke-gray-200 dark:border-poke-gray-800 bg-white dark:bg-poke-gray-800 p-5', className)}>
      <p className="text-sm font-medium text-poke-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-poke-red">{value}</p>
      {hint && <p className="mt-1 text-xs text-poke-gray-500">{hint}</p>}
    </div>
  );
}
