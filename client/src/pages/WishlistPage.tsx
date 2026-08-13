import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/api';
import { PokemonCardTile } from '@/components/cards/PokemonCardTile';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: wishlistApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const moveMutation = useMutation({
    mutationFn: wishlistApi.moveToCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t('wishlist.title')} />

      {error && <ErrorBanner message={(error as Error).message} />}

      {isLoading ? (
        <div className="card-grid">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.length ? (
        <EmptyState
          title={t('wishlist.emptyTitle')}
          description={t('wishlist.emptyDesc')}
          action={<Link to="/cards"><Button>{t('wishlist.searchCards')}</Button></Link>}
        />
      ) : (
        <div className="card-grid">
          {data.map((item) =>
            item.card ? (
              <PokemonCardTile
                key={item.id}
                card={item.card}
                actions={
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    <Button size="sm" className="flex-1 min-w-[120px]" onClick={() => moveMutation.mutate(item.cardId)} loading={moveMutation.isPending}>
                      {t('wishlist.moveToCollection')}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeMutation.mutate(item.cardId)} aria-label={t('favorites.remove')}>×</Button>
                  </div>
                }
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
