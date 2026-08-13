import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { PokemonCardTile } from '@/components/cards/PokemonCardTile';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';
import { POKEMON_TYPES, RARITIES } from '@/utils';

export function SearchCardsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'es-ES';
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [set, setSet] = useState('');
  const [rarity, setRarity] = useState('');
  const [type, setType] = useState('');
  const [hpMin, setHpMin] = useState('');
  const [hpMax, setHpMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [orderBy, setOrderBy] = useState('-set.releaseDate');
  const [page, setPage] = useState(1);

  const debouncedName = useDebounce(name, 250);
  const debouncedPriceMin = useDebounce(priceMin, 250);
  const debouncedPriceMax = useDebounce(priceMax, 250);

  const searchParams = useMemo(() => ({
    name: debouncedName || undefined,
    set: set || undefined,
    rarity: rarity || undefined,
    type: type || undefined,
    hpMin: hpMin ? Number(hpMin) : undefined,
    hpMax: hpMax ? Number(hpMax) : undefined,
    priceMin: debouncedPriceMin ? Number(debouncedPriceMin) : undefined,
    priceMax: debouncedPriceMax ? Number(debouncedPriceMax) : undefined,
    orderBy,
    pageSize: 24,
  }), [debouncedName, set, rarity, type, hpMin, hpMax, debouncedPriceMin, debouncedPriceMax, orderBy]);

  const queryKey = ['cards', debouncedName, set, rarity, type, hpMin, hpMax, debouncedPriceMin, debouncedPriceMax, orderBy, page];

  const { data: sets } = useQuery({
    queryKey: ['sets'],
    queryFn: cardsApi.getSets,
    staleTime: 30 * 60_000,
  });

  const { data, isLoading, error, isFetching, refetch, isError } = useQuery({
    queryKey,
    queryFn: () => cardsApi.search({ ...searchParams, page }),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(5000 * 2 ** attempt, 30000),
  });

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  useEffect(() => {
    if (!data || page >= totalPages) return;
    void queryClient.prefetchQuery({
      queryKey: ['cards', debouncedName, set, rarity, type, hpMin, hpMax, debouncedPriceMin, debouncedPriceMax, orderBy, page + 1],
      queryFn: () => cardsApi.search({ ...searchParams, page: page + 1 }),
      staleTime: 5 * 60_000,
    });
  }, [data, page, totalPages, queryClient, debouncedName, set, rarity, type, hpMin, hpMax, debouncedPriceMin, debouncedPriceMax, orderBy, searchParams]);

  const clearFilters = () => {
    setName('');
    setSet('');
    setRarity('');
    setType('');
    setHpMin('');
    setHpMax('');
    setPriceMin('');
    setPriceMax('');
    setPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={t('cards.searchTitle')}
        description={t('cards.searchDesc')}
      >
        {data && (
          <StatCard label={t('cards.results')} value={data.totalCount.toLocaleString(locale)} className="min-w-[140px] !p-4" />
        )}
      </PageHeader>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,280px)_1fr] xl:grid-cols-[minmax(0,300px)_1fr] lg:gap-8">
        <FilterSidebar
          title={t('cards.filters')}
          clearLabel={t('cards.clear')}
          onClear={clearFilters}
          breakpoint="lg"
        >
          <Input label={t('cards.name')} placeholder={t('cards.namePlaceholder')} value={name} onChange={(e) => { setName(e.target.value); setPage(1); }} />
          <Select label={t('cards.set')} value={set} onChange={(e) => { setSet(e.target.value); setPage(1); }}>
            <option value="">{t('cards.allF')}</option>
            {sets?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Select label={t('cards.rarity')} value={rarity} onChange={(e) => { setRarity(e.target.value); setPage(1); }}>
            <option value="">{t('cards.allF')}</option>
            {RARITIES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
          <Select label={t('cards.type')} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">{t('cards.allM')}</option>
            {POKEMON_TYPES.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('cards.hpMin')} type="number" min={0} value={hpMin} onChange={(e) => { setHpMin(e.target.value); setPage(1); }} />
            <Input label={t('cards.hpMax')} type="number" min={0} value={hpMax} onChange={(e) => { setHpMax(e.target.value); setPage(1); }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('cards.priceMin')} type="number" min={0} step="0.01" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }} />
            <Input label={t('cards.priceMax')} type="number" min={0} step="0.01" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }} />
          </div>
          <p className="text-[11px] text-poke-gray-500 leading-snug">
            {t('cards.priceHint')}
          </p>
          <Select label={t('cards.sortBy')} value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="name">{t('cards.sortNameAsc')}</option>
            <option value="-name">{t('cards.sortNameDesc')}</option>
            <option value="-set.releaseDate">{t('cards.sortNewest')}</option>
            <option value="set.releaseDate">{t('cards.sortOldest')}</option>
            <option value="-hp">{t('cards.sortHpHigh')}</option>
            <option value="hp">{t('cards.sortHpLow')}</option>
          </Select>
        </FilterSidebar>

        <section className="space-y-4 sm:space-y-6 min-w-0">
          {isError && error && (
            <div className="space-y-3">
              <ErrorBanner message={(error as Error).message} />
              <div className="rounded-xl border border-poke-gray-200 dark:border-poke-gray-800 bg-white dark:bg-poke-gray-800 p-4 text-sm text-poke-gray-500">
                <p className="font-medium text-poke-black dark:text-poke-white mb-1">{t('cards.whyTitle')}</p>
                <p>{t('cards.whyBody')}</p>
                <p className="mt-2">{t('cards.apiKeyHint')}{' '}
                  <a href="https://dev.pokemontcg.io/" target="_blank" rel="noopener noreferrer" className="text-poke-red hover:underline">dev.pokemontcg.io</a>
                  {' '}{t('cards.apiKeyEnv')} <code className="text-xs bg-poke-gray-100 dark:bg-poke-black px-1 rounded">POKEMON_TCG_API_KEY</code> en <code className="text-xs bg-poke-gray-100 dark:bg-poke-black px-1 rounded">server/.env</code>.
                </p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => refetch()}>{t('cards.retry')}</Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="card-grid">
              {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : data?.cards.length === 0 ? (
            <EmptyState title={t('cards.noResults')} description={t('cards.noResultsDesc')} action={<Button onClick={clearFilters}>{t('cards.clearFilters')}</Button>} />
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-poke-gray-500">
                <span className="leading-relaxed">
                  {t('cards.showing', { count: data?.count, total: data?.totalCount.toLocaleString(locale) })}
                  {data?.priceFiltered && t('cards.priceFiltered')}
                  {isFetching && !isLoading && t('cards.updating')}
                </span>
                <span className="shrink-0">
                  {totalPages > 0
                    ? t('cards.pageOf', { page, total: totalPages })
                    : t('cards.page', { page })}
                </span>
              </div>

              <div className="card-grid">
                {data?.cards.map((card, index) => (
                  <PokemonCardTile
                    key={card.id}
                    card={card}
                    showQuickActions
                    imagePriority={index < 8}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-full sm:w-auto">{t('cards.previous')}</Button>
                  <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="w-full sm:w-auto">{t('cards.next')}</Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
