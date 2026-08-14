import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Badge } from '@/components/ui/Badge';
import { TypeBadge } from '@/components/games/TypeBadge';
import { StatBars } from '@/components/games/StatBars';
import { TypeMatchups } from '@/components/games/TypeMatchups';
import { EvolutionChain } from '@/components/games/EvolutionChain';
import { PokemonCategoryBadges, PokemonCategoryLegend } from '@/components/games/PokemonCategoryBadge';
import { PokemonSprite } from '@/components/games/PokemonSprite';
import { PokemonMovesList } from '@/components/games/PokemonMovesList';
import { gamesApi } from '@/services/api';
import { useShinyMode } from '@/hooks/useShinyMode';

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const game = searchParams.get('game') ?? undefined;
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { shiny, toggleShiny } = useShinyMode();

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon-detail', id, game, lang],
    queryFn: () => gamesApi.getPokemon(id!, { game, lang }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    const backFallback = game ? `/games/pokedex/game/${game}` : '/games/pokedex';
    return (
      <div className="space-y-4">
        <BackLink fallbackTo={backFallback} label={t('games.backToPokedex')} />
        <ErrorBanner message={(error as Error)?.message ?? t('games.pokemonNotFound')} />
      </div>
    );
  }

  const backFallback = game ? `/games/pokedex/game/${game}` : '/games/pokedex';

  return (
    <div className="space-y-6 sm:space-y-8">
      <BackLink fallbackTo={backFallback} label={t('games.backToPokedex')} />

      <PageHeader title={data.name} description={data.genus} />

      <PokemonCategoryLegend shiny={shiny} onToggleShiny={toggleShiny} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="glass-panel p-6 text-center space-y-4">
          <PokemonSprite
            speciesId={data.speciesId}
            sprite={data.sprite}
            shinySprite={data.shinySprite}
            shiny={shiny}
            alt={data.name}
            className="mx-auto h-48 w-48 object-contain"
            loading="eager"
          />
          <div className="flex justify-center gap-2 flex-wrap">
            {data.types.map((type) => <TypeBadge key={type} type={type} size="md" />)}
          </div>
          <PokemonCategoryBadges categories={data.categories} size="sm" className="mt-2" />
          <div className="grid grid-cols-2 gap-2 text-sm text-poke-gray-500">
            <div><span className="font-medium text-poke-black dark:text-poke-white">{t('games.height')}</span> {data.height} m</div>
            <div><span className="font-medium text-poke-black dark:text-poke-white">{t('games.weight')}</span> {data.weight} kg</div>
          </div>
          {data.flavorText && (
            <p className="text-sm text-poke-gray-500 italic leading-relaxed">{data.flavorText}</p>
          )}
          <Link
            to={`/cards?q=${encodeURIComponent(data.name.split(' ')[0])}`}
            className="inline-block text-sm text-poke-red hover:underline"
          >
            {t('games.viewTcgCards')} →
          </Link>
        </div>

        <div className="space-y-6">
          <section className="glass-panel p-5">
            <h3 className="text-lg font-semibold mb-4">{t('games.baseStats')}</h3>
            <StatBars stats={data.statsLocalized} />
          </section>

          <section className="glass-panel p-5">
            <h3 className="text-lg font-semibold mb-2">{t('games.abilities')}</h3>
            <div className="flex flex-wrap gap-2">
              {data.abilities.map((a) => (
                <Badge key={a.name} variant={a.hidden ? 'red' : 'default'}>
                  {a.name}{a.hidden ? ` (${t('games.hidden')})` : ''}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="glass-panel p-5">
        <h3 className="text-lg font-semibold mb-4">{t('games.evolution')}</h3>
        <EvolutionChain evolution={data.evolution} game={game} shiny={shiny} />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">{t('games.typeMatchups')}</h3>
        <TypeMatchups {...data.matchups} />
      </section>

      <section className="glass-panel p-5">
        <h3 className="text-lg font-semibold mb-2">{t('games.suggestedNatures')}</h3>
        <p className="text-sm text-poke-gray-500 mb-4">{t('games.suggestedNaturesDesc')}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.natureSuggestions.map((n) => (
            <div key={n.name} className="rounded-xl border border-poke-gray-200 dark:border-poke-gray-700 p-3">
              <p className="font-semibold">{n.name}</p>
              <p className="text-xs text-poke-gray-500 mt-1">{n.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-5">
        <h3 className="text-lg font-semibold mb-2">{t('games.highlightedMoves')}</h3>
        <p className="text-sm text-poke-gray-500 mb-4">
          {game ? t('games.movesForGame', { game }) : t('games.highlightedMovesDesc')}
        </p>
        <PokemonMovesList moves={data.highlightedMoves} />
      </section>

      {data.moves.length > data.highlightedMoves.length && (
        <details className="glass-panel group">
          <summary className="cursor-pointer list-none px-5 py-4 min-h-[44px] flex items-center justify-between gap-3 font-semibold marker:content-none">
            <span>{t('games.allMoves')} ({data.moves.length})</span>
            <span className="text-poke-gray-400 text-sm transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="border-t border-poke-gray-200 dark:border-poke-gray-700 px-5 py-4">
            <PokemonMovesList moves={data.moves} showLearnInfo />
          </div>
        </details>
      )}
    </div>
  );
}
