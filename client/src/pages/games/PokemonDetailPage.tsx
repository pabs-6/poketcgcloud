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
        <div className="space-y-2 sm:hidden">
          {data.highlightedMoves.map((move) => (
            <div
              key={move.name}
              className="rounded-xl border border-poke-gray-200 dark:border-poke-gray-700 p-3 flex flex-wrap items-center gap-2"
            >
              <span className="font-medium w-full">{move.name}</span>
              <TypeBadge type={move.type} />
              <span className="text-xs text-poke-gray-500">{t('games.power')}: <span className="font-mono text-poke-black dark:text-poke-white">{move.power ?? '—'}</span></span>
              <span className="text-xs capitalize text-poke-gray-500">{move.category.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-poke-gray-200 dark:border-poke-gray-700 text-left text-poke-gray-500">
                <th className="py-2 pr-4">{t('games.move')}</th>
                <th className="py-2 pr-4">{t('games.type')}</th>
                <th className="py-2 pr-4">{t('games.power')}</th>
                <th className="py-2">{t('games.category')}</th>
              </tr>
            </thead>
            <tbody>
              {data.highlightedMoves.map((move) => (
                <tr key={move.name} className="border-b border-poke-gray-100 dark:border-poke-gray-800">
                  <td className="py-2 pr-4 font-medium">{move.name}</td>
                  <td className="py-2 pr-4"><TypeBadge type={move.type} /></td>
                  <td className="py-2 pr-4 font-mono">{move.power ?? '—'}</td>
                  <td className="py-2 capitalize">{move.category.replace('-', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.moves.length > data.highlightedMoves.length && (
        <details className="glass-panel p-5">
          <summary className="cursor-pointer font-semibold min-h-[44px] flex items-center">{t('games.allMoves')} ({data.moves.length})</summary>
          <div className="mt-4 max-h-80 overflow-y-auto space-y-2 sm:space-y-0">
            <div className="space-y-2 sm:hidden">
              {data.moves.map((move, i) => (
                <div
                  key={`${move.name}-${i}-m`}
                  className="rounded-xl border border-poke-gray-200 dark:border-poke-gray-700 p-3 flex flex-wrap items-center gap-2"
                >
                  <span className="font-medium w-full">{move.name}</span>
                  <TypeBadge type={move.type} />
                  <span className="text-xs text-poke-gray-500">{t('games.power')}: <span className="font-mono">{move.power ?? '—'}</span></span>
                  <span className="text-xs capitalize">{move.method.replace('-', ' ')}</span>
                  {move.level ? <span className="text-xs font-mono">Lv.{move.level}</span> : null}
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-poke-gray-200 dark:border-poke-gray-700 text-left text-poke-gray-500">
                  <th className="py-2 pr-4">{t('games.move')}</th>
                  <th className="py-2 pr-4">{t('games.type')}</th>
                  <th className="py-2 pr-4">{t('games.power')}</th>
                  <th className="py-2 pr-4">{t('games.method')}</th>
                  <th className="py-2">{t('games.level')}</th>
                </tr>
              </thead>
              <tbody>
                {data.moves.map((move, i) => (
                  <tr key={`${move.name}-${i}`} className="border-b border-poke-gray-100 dark:border-poke-gray-800">
                    <td className="py-2 pr-4 font-medium">{move.name}</td>
                    <td className="py-2 pr-4"><TypeBadge type={move.type} /></td>
                    <td className="py-2 pr-4 font-mono">{move.power ?? '—'}</td>
                    <td className="py-2 pr-4 capitalize text-xs">{move.method.replace('-', ' ')}</td>
                    <td className="py-2 font-mono">{move.level || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
