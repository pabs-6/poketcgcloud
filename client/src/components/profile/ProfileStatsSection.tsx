import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { statsApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

const CHART_COLORS = ['#EE1515', '#1A1A1A', '#737373', '#CC0000', '#F5F5F5', '#262626'];

export function ProfileStatsSection() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={(error as Error).message} />;
  }

  if (!data || data.totalCards === 0) {
    return (
      <EmptyState
        title={t('profile.statsEmptyTitle')}
        description={t('profile.statsEmptyDesc')}
        action={<Link to="/cards"><Button>{t('collection.exploreGallery')}</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {data.byRarity.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4">{t('profile.byRarity')}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.byRarity} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.byRarity.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {data.byType.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4">{t('profile.byType')}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.byType}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#EE1515" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {data.setProgress.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">{t('profile.setProgress')}</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {data.setProgress.map((set) => (
              <div key={set.setId}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{set.setName}</span>
                  <span className="text-poke-gray-500">
                    {set.owned}/{set.total} ({set.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-poke-gray-200 dark:bg-poke-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-poke-red rounded-full transition-all duration-500"
                    style={{ width: `${set.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.recentCardsAdded.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">{t('profile.recentCards')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.recentCardsAdded.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-poke-gray-200 dark:border-poke-gray-800 p-2">
                {item.card && (
                  <img src={item.card.images.small} alt="" className="h-14 w-auto rounded" />
                )}
                <div className="min-w-0">
                  <Link to={`/cards/${item.cardId}`} className="font-medium hover:text-poke-red truncate block">
                    {item.card?.name ?? item.cardId}
                  </Link>
                  <p className="text-xs text-poke-gray-500">×{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  });
}
