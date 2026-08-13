import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { collectionApi } from '@/services/api';
import { PokemonCardTile } from '@/components/cards/PokemonCardTile';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';
import type { CollectionItem, CardCondition } from '@/types';
import { RARITIES } from '@/utils';
import { getMarketPrice } from '@/utils/cardHelpers';
import { useDebounce } from '@/hooks/useDebounce';
import { useConditionLabels, useFormatPrice } from '@/hooks/useLocale';

export function CollectionPage() {
  const { t } = useTranslation();
  const conditionLabels = useConditionLabels();
  const formatPrice = useFormatPrice();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<CollectionItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<CardCondition>('near_mint');
  const [isFoil, setIsFoil] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const [search, setSearch] = useState('');
  const [setFilter, setSetFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [foilOnly, setFoilOnly] = useState(false);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ['collection'],
    queryFn: collectionApi.getAll,
  });

  const sets = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, string>();
    data.forEach((item) => {
      if (item.card) map.set(item.card.set.id, item.card.set.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const types = useMemo(() => {
    if (!data) return [];
    const typeSet = new Set<string>();
    data.forEach((item) => item.card?.types?.forEach((cardType) => typeSet.add(cardType)));
    return [...typeSet].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      if (!item.card) return false;
      if (debouncedSearch && !item.card.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (setFilter && item.card.set.id !== setFilter) return false;
      if (rarityFilter && item.card.rarity !== rarityFilter) return false;
      if (typeFilter && !item.card.types?.includes(typeFilter)) return false;
      if (conditionFilter && item.condition !== conditionFilter) return false;
      if (foilOnly && !item.isFoil) return false;
      return true;
    });
  }, [data, debouncedSearch, setFilter, rarityFilter, typeFilter, conditionFilter, foilOnly]);

  const albumValue = useMemo(
    () => filtered.reduce((sum, item) => {
      const price = item.card ? getMarketPrice(item.card) ?? 0 : 0;
      return sum + price * item.quantity;
    }, 0),
    [filtered]
  );

  const totalQty = useMemo(
    () => filtered.reduce((sum, item) => sum + item.quantity, 0),
    [filtered]
  );

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: Parameters<typeof collectionApi.update>[1] }) =>
      collectionApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setEditItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: collectionApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const openEdit = (item: CollectionItem) => {
    setEditItem(item);
    setQuantity(item.quantity);
    setCondition(item.condition);
    setIsFoil(item.isFoil);
    setPurchasePrice(item.purchasePrice?.toString() ?? '');
    setPurchaseDate(item.purchaseDate?.split('T')[0] ?? '');
  };

  const handleSave = () => {
    if (!editItem) return;
    updateMutation.mutate({
      id: editItem.id,
      data: {
        quantity,
        condition,
        isFoil,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
        purchaseDate: purchaseDate || null,
      },
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSetFilter('');
    setRarityFilter('');
    setTypeFilter('');
    setConditionFilter('');
    setFoilOnly(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={t('collection.title')}
        description={t('collection.desc')}
      >
        <Link to="/cards" className="w-full sm:w-auto"><Button variant="secondary" className="w-full sm:w-auto">{t('collection.addCards')}</Button></Link>
      </PageHeader>

      {error && <ErrorBanner message={(error as Error).message} />}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8">
        <FilterSidebar
          title={t('collection.filterTitle')}
          clearLabel={t('cards.clear')}
          onClear={clearFilters}
        >
          <Input label={t('cards.name')} placeholder={t('collection.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select label={t('cards.set')} value={setFilter} onChange={(e) => setSetFilter(e.target.value)}>
            <option value="">{t('cards.allF')}</option>
            {sets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Select label={t('cards.rarity')} value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)}>
            <option value="">{t('cards.allF')}</option>
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Select label={t('cards.type')} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">{t('cards.allM')}</option>
            {types.map((cardType) => <option key={cardType} value={cardType}>{cardType}</option>)}
          </Select>
          <Select label={t('collection.condition')} value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
            <option value="">{t('cards.allF')}</option>
            {Object.entries(conditionLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
          <label className="flex items-center gap-2 text-sm min-h-[44px]">
            <input type="checkbox" checked={foilOnly} onChange={(e) => setFoilOnly(e.target.checked)} className="h-4 w-4" />
            {t('collection.foilOnly')}
          </label>
        </FilterSidebar>

        <section className="space-y-4 sm:space-y-6 min-w-0">
          {!isLoading && data && data.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label={t('collection.cardsShown')} value={totalQty} hint={t('collection.uniqueTypes', { count: filtered.length })} />
              <StatCard label={t('collection.filteredValue')} value={formatPrice(albumValue)} hint={t('collection.marketEstimate')} />
              <StatCard label={t('collection.totalInAlbum')} value={data.reduce((s, i) => s + i.quantity, 0)} />
            </div>
          )}

          {isLoading ? (
            <div className="card-grid">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : !data?.length ? (
            <EmptyState
              title={t('collection.emptyTitle')}
              description={t('collection.emptyDesc')}
              action={<Link to="/cards"><Button>{t('collection.exploreGallery')}</Button></Link>}
            />
          ) : filtered.length === 0 ? (
            <EmptyState title={t('collection.noFilterResults')} description={t('collection.noFilterDesc')} action={<Button variant="secondary" onClick={clearFilters}>{t('cards.clearFilters')}</Button>} />
          ) : (
            <div className="card-grid">
              {filtered.map((item) =>
                item.card ? (
                  <PokemonCardTile
                    key={item.id}
                    card={item.card}
                    actions={
                      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                        <span className="w-full text-center text-xs text-poke-gray-500">
                          ×{item.quantity} · {conditionLabels[item.condition]}
                          {item.isFoil && ` · ${t('collection.foil')}`}
                        </span>
                        <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>{t('collection.edit')}</Button>
                        <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(item.id)} aria-label={t('favorites.remove')}>×</Button>
                      </div>
                    }
                  />
                ) : null
              )}
            </div>
          )}
        </section>
      </div>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={t('collection.editModalTitle')}>
        <div className="space-y-4">
          <Input label={t('collection.quantity')} type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <Select label={t('collection.condition')} value={condition} onChange={(e) => setCondition(e.target.value as CardCondition)}>
            {Object.entries(conditionLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFoil} onChange={(e) => setIsFoil(e.target.checked)} />
            {t('collection.foilLabel')}
          </label>
          <Input label={t('collection.purchasePrice')} type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
          <Input label={t('collection.purchaseDate')} type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          <Button className="w-full" onClick={handleSave} loading={updateMutation.isPending}>{t('collection.save')}</Button>
        </div>
      </Modal>
    </div>
  );
}
