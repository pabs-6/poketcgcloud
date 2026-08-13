import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/api';
import { PokemonCardTile } from '@/components/cards/PokemonCardTile';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
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
      <h1 className="text-2xl font-bold">{t('wishlist.title')}</h1>

      {error && <ErrorBanner message={(error as Error).message} />}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.length ? (
        <EmptyState
          title={t('wishlist.emptyTitle')}
          description={t('wishlist.emptyDesc')}
          action={<Link to="/cards"><Button>{t('wishlist.searchCards')}</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) =>
            item.card ? (
              <PokemonCardTile
                key={item.id}
                card={item.card}
                actions={
                  <>
                    <Button size="sm" onClick={() => moveMutation.mutate(item.cardId)} loading={moveMutation.isPending}>
                      {t('wishlist.moveToCollection')}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeMutation.mutate(item.cardId)}>×</Button>
                  </>
                }
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
