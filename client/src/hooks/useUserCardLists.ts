import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { collectionApi, wishlistApi, favoritesApi } from '@/services/api';

export function useUserCardLists() {
  const { user } = useAuth();

  const { data: collection } = useQuery({
    queryKey: ['collection'],
    queryFn: collectionApi.getAll,
    enabled: !!user,
    staleTime: 2 * 60_000,
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getAll,
    enabled: !!user,
    staleTime: 2 * 60_000,
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getAll,
    enabled: !!user,
    staleTime: 2 * 60_000,
  });

  const lists = useMemo(() => {
    const inCollection = new Set(collection?.map((i) => i.cardId) ?? []);
    const inWishlist = new Set(wishlist?.map((i) => i.cardId) ?? []);
    const inFavorites = new Set(favorites?.map((i) => i.cardId) ?? []);
    return { inCollection, inWishlist, inFavorites };
  }, [collection, wishlist, favorites]);

  return { ...lists, isLoading: !!user && !collection && !wishlist && !favorites };
}
