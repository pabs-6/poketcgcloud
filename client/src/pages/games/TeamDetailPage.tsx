import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { PokemonCategoryLegend } from '@/components/games/PokemonCategoryBadge';
import { PokemonSprite } from '@/components/games/PokemonSprite';
import { gamesApi } from '@/services/api';
import { useShinyMode } from '@/hooks/useShinyMode';

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { shiny, toggleShiny } = useShinyMode();

  const { data, isLoading, error } = useQuery({
    queryKey: ['team-detail', id, lang],
    queryFn: () => gamesApi.getTeam(id!, lang),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorBanner message={(error as Error)?.message ?? t('games.teamNotFound')} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title={data.name} description={data.description}>
        <Link to={`/games/teams/game/${data.gameSlug}`} className="text-sm text-poke-red hover:underline">
          ← {data.gameName}
        </Link>
      </PageHeader>

      <PokemonCategoryLegend shiny={shiny} onToggleShiny={toggleShiny} showCategories={false} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.members.map((member) => (
          <div key={member.id} className="glass-panel p-4">
            <div className="flex items-start gap-3">
              <PokemonSprite
                speciesId={member.id}
                sprite={member.sprite}
                shinySprite={member.shinySprite}
                shiny={shiny}
                alt={member.name}
                className="h-16 w-16 object-contain shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/games/pokemon/${member.id}?game=${data.gameSlug}`}
                  className="font-bold hover:text-poke-red transition-colors"
                >
                  {member.name}
                </Link>
                <p className="text-xs text-poke-red font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-poke-gray-500 mt-2">{member.nature}</p>
              </div>
            </div>
            <div className="mt-3 border-t border-poke-gray-200 dark:border-poke-gray-700 pt-3">
              <p className="text-[10px] uppercase tracking-wider text-poke-gray-500 mb-1">{t('games.moves')}</p>
              <ul className="text-xs space-y-0.5">
                {member.moves.map((move) => (
                  <li key={move}>· {move}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
