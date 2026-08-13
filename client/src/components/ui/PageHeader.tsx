import { cn } from '@/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:gap-4 border-b border-poke-gray-200 dark:border-poke-gray-800 pb-4 sm:pb-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="min-w-0 space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-poke-black dark:text-poke-white break-words">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-sm sm:text-base text-poke-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">{children}</div>}
    </div>
  );
}
