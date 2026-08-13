export interface PokemonCardImage {
  small: string;
  large: string;
}

export interface PokemonCardSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
}

export interface PokemonAttack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface PokemonWeakness {
  type: string;
  value: string;
}

export interface PokemonResistance {
  type: string;
  value: string;
}

export interface PokemonTcgPlayerPrices {
  holofoil?: { low?: number; mid?: number; high?: number; market?: number };
  normal?: { low?: number; mid?: number; high?: number; market?: number };
  reverseHolofoil?: { low?: number; mid?: number; high?: number; market?: number };
}

export interface PokemonCardmarketPrices {
  averageSellPrice?: number;
  lowPrice?: number;
  trendPrice?: number;
  reverseHoloSell?: number;
  reverseHoloLow?: number;
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
  images: PokemonCardImage;
  attacks?: PokemonAttack[];
  weaknesses?: PokemonWeakness[];
  resistances?: PokemonResistance[];
  tcgplayer?: { url?: string; prices?: PokemonTcgPlayerPrices };
  cardmarket?: { url?: string; prices?: PokemonCardmarketPrices };
}

export interface PokemonApiResponse<T> {
  data: T;
  page?: number;
  pageSize?: number;
  count?: number;
  totalCount?: number;
}

export interface CardSearchParams {
  q?: string;
  name?: string;
  set?: string;
  rarity?: string;
  type?: string;
  hpMin?: number;
  hpMax?: number;
  priceMin?: number;
  priceMax?: number;
  orderBy?: string;
  page?: number;
  pageSize?: number;
}

export interface CardSearchResult {
  cards: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
  priceFiltered?: boolean;
  pricePrioritized?: boolean;
}
