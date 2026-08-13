interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-poke-gray-200 dark:border-poke-gray-800 bg-white/50 dark:bg-poke-gray-800/30 py-16 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-poke-red/10">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-poke-red" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="3" width="13" height="18" rx="2" />
          <rect x="8" y="6" width="13" height="18" rx="2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-poke-black dark:text-poke-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-poke-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
