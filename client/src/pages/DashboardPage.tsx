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
import { formatPrice } from '@/utils';

const CHART_COLORS = ['#EE1515', '#1A1A1A', '#737373', '#CC0000', '#F5F5F5', '#262626'];

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={(error as Error).message} />;
  }

  if (!data || data.totalCards === 0) {
    return (
      <EmptyState
        title="Sin datos todavía"
        description="Añade cartas a tu colección para ver estadísticas."
        action={<Link to="/cards"><Button>Buscar cartas</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <p className="text-sm text-poke-gray-500">Total de cartas</p>
          <p className="text-4xl font-bold text-poke-red">{data.totalCards}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-poke-gray-500">Valor estimado</p>
          <p className="text-4xl font-bold text-poke-red">{formatPrice(data.estimatedValue)}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {data.byRarity.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Por rareza</h2>
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
            <h2 className="font-semibold mb-4">Por tipo</h2>
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
          <h2 className="font-semibold mb-4">Progreso por expansión</h2>
          <div className="space-y-4">
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
          <h2 className="font-semibold mb-4">Últimas cartas añadidas</h2>
          <div className="space-y-3">
            {data.recentCardsAdded.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.card && (
                  <img src={item.card.images.small} alt="" className="h-12 w-auto rounded" />
                )}
                <div>
                  <Link to={`/cards/${item.cardId}`} className="font-medium hover:text-poke-red">
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
