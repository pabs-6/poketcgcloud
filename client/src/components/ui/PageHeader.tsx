import { cn } from '@/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 border-b border-poke-gray-200 dark:border-poke-gray-800 pb-6 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-poke-black dark:text-poke-white">{title}</h1>
        {description && (
          <p className="max-w-3xl text-poke-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}
