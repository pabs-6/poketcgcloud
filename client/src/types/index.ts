export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string; details?: unknown };
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PokemonCardSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
}

export interface PokemonCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  types?: string[];
  hp?: string;
  artist?: string;
  set: PokemonCardSet;
  images: { small: string; large: string };
  attacks?: Array<{
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;
  weaknesses?: Array<{ type: string; value: string }>;
  resistances?: Array<{ type: string; value: string }>;
  tcgplayer?: {
    url?: string;
    prices?: Record<string, { market?: number; mid?: number; low?: number; high?: number }>;
  };
  cardmarket?: {
    url?: string;
    prices?: { trendPrice?: number; averageSellPrice?: number; lowPrice?: number };
  };
}

export interface CardSearchResult {
  cards: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
  priceFiltered?: boolean;
}

export type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'played' | 'poor';

export interface CollectionItem {
  id: string;
  cardId: string;
  quantity: number;
  condition: CardCondition;
  isFoil: boolean;
  purchasePrice?: number;
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
  card: PokemonCard | null;
}

export interface WishlistItem {
  id: string;
  cardId: string;
  addedAt: string;
  card: PokemonCard | null;
}

export interface FavoriteItem {
  id: string;
  cardId: string;
  addedAt: string;
  card: PokemonCard | null;
}

export interface Stats {
  totalCards: number;
  estimatedValue: number;
  byRarity: Array<{ name: string; count: number }>;
  byType: Array<{ name: string; count: number }>;
  setProgress: Array<{
    setId: string;
    setName: string;
    owned: number;
    total: number;
    percentage: number;
  }>;
  recentCardsAdded: Array<{
    id: string;
    cardId: string;
    quantity: number;
    createdAt: string;
    card: PokemonCard | null;
  }>;
}

export interface SetOption {
  id: string;
  name: string;
  series?: string;
  total?: number;
  releaseDate?: string;
}
