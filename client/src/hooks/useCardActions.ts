import { useCallback, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionApi, wishlistApi, favoritesApi } from '@/services/api';

export type CardActionType = 'collection' | 'wishlist' | 'favorite';

const FLASH_MS = 1000;

export function useCardActions(cardId: string) {
  const queryClient = useQueryClient();
  const timers = useRef<Partial<Record<CardActionType, ReturnType<typeof setTimeout>>>>({});
  const [flash, setFlash] = useState<Partial<Record<CardActionType, boolean>>>({});

  const triggerFlash = useCallback((type: CardActionType) => {
    if (timers.current[type]) clearTimeout(timers.current[type]);
    setFlash((prev) => ({ ...prev, [type]: true }));
    timers.current[type] = setTimeout(() => {
      setFlash((prev) => ({ ...prev, [type]: false }));
    }, FLASH_MS);
  }, []);

  const addCollection = useMutation({
    mutationFn: () => collectionApi.add({ cardId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['collection'] });
      void queryClient.invalidateQueries({ queryKey: ['stats'] });
      triggerFlash('collection');
    },
  });

  const addWishlist = useMutation({
    mutationFn: () => wishlistApi.add(cardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      triggerFlash('wishlist');
    },
  });

  const addFavorite = useMutation({
    mutationFn: () => favoritesApi.add(cardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorites'] });
      triggerFlash('favorite');
    },
  });

  return {
    flash,
    addCollection,
    addWishlist,
    addFavorite,
  };
}
