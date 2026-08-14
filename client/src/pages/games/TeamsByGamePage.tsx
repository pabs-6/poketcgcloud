import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { gamesApi } from '@/services/api';

export function TeamsByGamePage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading, error } = useQuery({
    queryKey: ['teams-by-game', gameSlug, lang],
    queryFn: () => gamesApi.getTeamsByGame(gameSlug!, lang),
    enabled: !!gameSlug,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title={t('games.teamsForGame')} description={gameSlug}>
        <Link to="/games/teams" className="text-sm text-poke-red hover:underline">
          ← {t('games.backToTeams')}
        </Link>
      </PageHeader>

      {error && <ErrorBanner message={(error as Error).message} />}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.map((team) => (
            <Link
              key={team.id}
              to={`/games/teams/${team.id}`}
              className="glass-panel card-hover p-5 block"
            >
              <p className="text-lg font-bold">{team.name}</p>
              <p className="text-sm text-poke-gray-500 mt-1">{team.description}</p>
              <p className="text-xs text-poke-gray-400 mt-2">{team.memberCount} Pokémon</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
