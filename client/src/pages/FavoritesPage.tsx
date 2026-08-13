import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/services/api';
import { PokemonCardTile } from '@/components/cards/PokemonCardTile';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function FavoritesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData(['favorites']);
      queryClient.setQueryData(
        ['favorites'],
        (old: typeof data) => old?.filter((f) => f.cardId !== cardId)
      );
      return { previous };
    },
    onError: (_err, _cardId, context) => {
      queryClient.setQueryData(['favorites'], context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('favorites.title')}</h1>

      {error && <ErrorBanner message={(error as Error).message} />}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.length ? (
        <EmptyState
          title={t('favorites.emptyTitle')}
          description={t('favorites.emptyDesc')}
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
                  <Button size="sm" variant="danger" onClick={() => removeMutation.mutate(item.cardId)}>
                    {t('favorites.remove')}
                  </Button>
                }
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
