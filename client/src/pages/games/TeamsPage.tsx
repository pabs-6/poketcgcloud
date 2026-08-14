import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { GameLogo } from '@/components/games/GameLogo';
import { gamesApi } from '@/services/api';

export function TeamsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading, error } = useQuery({
    queryKey: ['teams-index', lang],
    queryFn: () => gamesApi.getTeamsIndex(lang),
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={t('games.teamsTitle')}
        description={t('games.teamsPageDesc')}
      />

      {error && <ErrorBanner message={(error as Error).message} />}

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data?.map((game) => (
            <Link
              key={game.gameSlug}
              to={`/games/teams/game/${game.gameSlug}`}
              className="glass-panel card-hover flex items-center gap-3 p-4"
            >
              <GameLogo slug={game.gameSlug} size="md" />
              <div>
                <p className="font-semibold">{game.gameName}</p>
                <p className="text-sm text-poke-gray-500">
                  {t('games.teamCount', { count: game.teamCount })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
