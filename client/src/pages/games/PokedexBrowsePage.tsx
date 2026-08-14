import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { GenerationCard } from '@/components/games/GenerationCard';
import { RegionLogo } from '@/components/games/RegionLogo';
import { gamesApi } from '@/services/api';

export function PokedexBrowsePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading, error } = useQuery({
    queryKey: ['games-catalog', lang],
    queryFn: () => gamesApi.getCatalog(lang),
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={t('games.pokedexTitle')}
        description={t('games.pokedexBrowseDesc')}
      />

      {error && <ErrorBanner message={(error as Error).message} />}

      <section>
        <h2 className="text-lg font-semibold mb-3">{t('games.nationalDex')}</h2>
        <Link to="/games/pokedex/national" className="glass-panel card-hover block p-4 max-w-md">
          <div className="flex items-start gap-3">
            <RegionLogo region="National" size="md" />
            <div>
              <p className="font-semibold">{t('games.nationalDex')}</p>
              <p className="text-sm text-poke-gray-500 mt-1">{t('games.nationalDexDesc')}</p>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{t('games.byGeneration')}</h2>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data?.generations.map((gen) => (
              <GenerationCard
                key={gen.id}
                name={gen.name}
                region={gen.region}
                games={gen.games}
                pokedexTo={`/games/pokedex/gen/${gen.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
