import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { EmptyState } from '@/components/ui/EmptyState';
import { PokemonTile } from '@/components/games/PokemonTile';
import { PokemonCategoryLegend } from '@/components/games/PokemonCategoryBadge';
import { gamesApi } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useShinyMode } from '@/hooks/useShinyMode';

export function PokedexListPage() {
  const { t, i18n } = useTranslation();
  const { mode, slug } = useParams<{ mode: string; slug: string }>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 200);
  const lang = i18n.language;
  const { shiny, toggleShiny } = useShinyMode();

  const queryParams = useMemo(() => {
    if (mode === 'national') return { national: true, lang };
    if (mode === 'gen') return { generation: slug, lang };
    if (mode === 'game') return { game: slug, lang };
    return { national: true, lang };
  }, [mode, slug, lang]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokedex-list', mode, slug, lang],
    queryFn: () => gamesApi.getPokedex(queryParams),
  });

  const filtered = useMemo(() => {
    if (!data?.entries) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data.entries;
    return data.entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        String(e.dexNumber).includes(q) ||
        String(e.speciesId).includes(q)
    );
  }, [data?.entries, debouncedSearch]);

  const pokemonBasePath = mode === 'game' && slug
    ? `/games/pokemon`
    : `/games/pokemon`;
  const gameQuery = mode === 'game' && slug ? `?game=${slug}` : '';

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={data?.title ?? t('games.pokedexTitle')}
        description={data ? t('games.pokemonCount', { count: data.count }) : undefined}
      >
        <Link to="/games/pokedex" className="text-sm text-poke-red hover:underline">
          ← {t('games.backToBrowse')}
        </Link>
      </PageHeader>

      <Input
        label={t('games.searchPokemon')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('games.searchPlaceholder')}
      />

      {error && <ErrorBanner message={(error as Error).message} />}

      <PokemonCategoryLegend shiny={shiny} onToggleShiny={toggleShiny} />

      {isLoading ? (
        <div className="card-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={t('games.noResults')} description={t('games.tryOtherSearch')} />
      ) : (
        <div className="card-grid">
          {filtered.map((entry) => (
            <PokemonTile
              key={entry.speciesId}
              entry={entry}
              to={`${pokemonBasePath}/${entry.speciesId}${gameQuery}`}
              shiny={shiny}
            />
          ))}
        </div>
      )}
    </div>
  );
}
