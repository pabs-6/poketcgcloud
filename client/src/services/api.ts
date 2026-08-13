import { apiClient } from './apiClient';
import type {
  AuthResponse,
  User,
  CardSearchResult,
  PokemonCard,
  CollectionItem,
  WishlistItem,
  FavoriteItem,
  Stats,
  SetOption,
  CardCondition,
} from '@/types';

export const authApi = {
  register: (data: { email: string; password: string; username: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  googleLogin: (credential: string) =>
    apiClient.post<AuthResponse>('/auth/google', { credential }),
  me: () => apiClient.get<User>('/auth/me'),
  updateProfile: (data: { username?: string; avatar?: string | null }) =>
    apiClient.patch<User>('/auth/profile', data),
};

export const cardsApi = {
  search: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value));
    });
    return apiClient.get<CardSearchResult>(`/cards?${query.toString()}`);
  },
  getById: (id: string) => apiClient.get<PokemonCard>(`/cards/${id}`),
  getSets: () => apiClient.get<SetOption[]>('/cards/sets/list'),
};

export const collectionApi = {
  getAll: () => apiClient.get<CollectionItem[]>('/collection'),
  add: (data: {
    cardId: string;
    quantity?: number;
    condition?: CardCondition;
    isFoil?: boolean;
    purchasePrice?: number;
    purchaseDate?: string;
  }) => apiClient.post<CollectionItem>('/collection', data),
  update: (
    id: string,
    data: Partial<{
      quantity: number;
      condition: CardCondition;
      isFoil: boolean;
      purchasePrice: number | null;
      purchaseDate: string | null;
    }>
  ) => apiClient.put<CollectionItem>(`/collection/${id}`, data),
  remove: (id: string) => apiClient.delete<CollectionItem>(`/collection/${id}`),
};

export const wishlistApi = {
  getAll: () => apiClient.get<WishlistItem[]>('/wishlist'),
  add: (cardId: string) => apiClient.post<WishlistItem>('/wishlist', { cardId }),
  remove: (cardId: string) => apiClient.delete<WishlistItem>(`/wishlist/${cardId}`),
  moveToCollection: (cardId: string) =>
    apiClient.post<CollectionItem>(`/wishlist/${cardId}/move`),
};

export const favoritesApi = {
  getAll: () => apiClient.get<FavoriteItem[]>('/favorites'),
  add: (cardId: string) => apiClient.post<FavoriteItem>('/favorites', { cardId }),
  remove: (cardId: string) => apiClient.delete<FavoriteItem>(`/favorites/${cardId}`),
};

export const statsApi = {
  get: () => apiClient.get<Stats>('/stats'),
};
