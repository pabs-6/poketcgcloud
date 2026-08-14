interface StatBarsProps {
  stats: Array<{ key: string; label: string; value: number }>;
}

export function StatBars({ stats }: StatBarsProps) {
  const maxStat = 255;

  return (
    <div className="space-y-2">
      {stats.map((stat) => (
        <div key={stat.key} className="grid grid-cols-[80px_1fr_36px] items-center gap-2 text-sm">
          <span className="text-poke-gray-500 text-xs font-medium truncate">{stat.label}</span>
          <div className="h-2 rounded-full bg-poke-gray-200 dark:bg-poke-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-poke-red transition-all"
              style={{ width: `${Math.min(100, (stat.value / maxStat) * 100)}%` }}
            />
          </div>
          <span className="font-mono text-xs text-right">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
