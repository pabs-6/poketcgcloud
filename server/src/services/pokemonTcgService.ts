import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  CardSearchParams,
  CardSearchResult,
  PokemonApiResponse,
  PokemonCard,
} from '../types/pokemonTcg.js';

const BASE_URL = 'https://api.pokemontcg.io/v2';
const MAX_RETRIES = 5;
const DEFAULT_QUERY = 'supertype:Pokémon';
const SEARCH_CACHE_TTL = 10 * 60 * 1000;
const CARD_SELECT_LIST =
  'id,name,number,rarity,types,hp,set,images,tcgplayer,cardmarket';
const CARD_SELECT_FULL =
  `${CARD_SELECT_LIST},artist,attacks,weaknesses,resistances`;

const ALLOWED_ORDER_BY = new Set([
  'name',
  '-name',
  'number',
  '-number',
  'set.releaseDate',
  '-set.releaseDate',
  'hp',
  '-hp',
  'rarity',
  '-rarity',
]);

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const searchCache = new Map<string, CacheEntry<unknown>>();

function escapeLucene(value: string): string {
  return value.replace(/([+\-!(){}[\]^"~*?:\\/]|&&|\|\|)/g, '\\$1');
}

function quoteValue(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function normalizeSearchName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .split(/(\s|-)/)
    .map((segment) =>
      segment && !/^[\s-]+$/.test(segment)
        ? segment.charAt(0).toUpperCase() + segment.slice(1)
        : segment
    )
    .join('');
}

function buildQuery(params: CardSearchParams): string {
  const parts: string[] = [];

  if (params.q?.trim()) {
    parts.push(params.q.trim());
  }

  if (params.name?.trim()) {
    const term = escapeLucene(normalizeSearchName(params.name));
    parts.push(`name:${term}*`);
  }

  if (params.set?.trim()) {
    parts.push(`set.id:${escapeLucene(params.set.trim())}`);
  }

  if (params.rarity?.trim()) {
    parts.push(`rarity:${quoteValue(params.rarity.trim())}`);
  }

  if (params.type?.trim()) {
    parts.push(`types:${quoteValue(params.type.trim())}`);
  }

  if (params.hpMin !== undefined || params.hpMax !== undefined) {
    const min = params.hpMin ?? 0;
    const max = params.hpMax ?? 340;
    parts.push(`hp:[${min} TO ${max}]`);
  }

  return parts.length > 0 ? parts.join(' ') : DEFAULT_QUERY;
}

function sanitizeOrderBy(orderBy?: string): string {
  if (!orderBy || !ALLOWED_ORDER_BY.has(orderBy)) {
    return '-set.releaseDate';
  }
  return orderBy;
}

function cacheKey(prefix: string, params: unknown): string {
  return `${prefix}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = searchCache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.data as T;
  searchCache.delete(key);
  return null;
}

function setCache(key: string, data: unknown, ttl = SEARCH_CACHE_TTL): void {
  searchCache.set(key, { data, expiresAt: Date.now() + ttl });
}

async function parseApiError(response: Response): Promise<{ retryAfterMs: number }> {
  let retryAfterMs = 5000;
  try {
    const body = (await response.json()) as {
      retry_after?: number;
      detail?: string;
      title?: string;
    };
    if (body.retry_after) {
      retryAfterMs = body.retry_after * 1000;
    }
  } catch {
    // ignore
  }
  return { retryAfterMs };
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'PokeBinder/1.0',
  };
  if (env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = env.POKEMON_TCG_API_KEY;
  }

  let lastRetryAfter = 5000;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });

      if (response.status === 429 || response.status >= 500) {
        const { retryAfterMs } = await parseApiError(response.clone());
        lastRetryAfter = retryAfterMs;

        if (attempt < retries - 1) {
          const delay = Math.min(retryAfterMs, 2000 * Math.pow(2, attempt));
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        if (response.status === 429) {
          throw new AppError(
            429,
            'La API de Pokémon TCG está saturada. Espera un minuto e inténtalo de nuevo.',
            'POKEMON_API_RATE_LIMIT'
          );
        }

        throw new AppError(
          503,
          env.POKEMON_TCG_API_KEY
            ? 'La API de Pokémon TCG no responde ahora mismo. Espera un minuto e inténtalo de nuevo.'
            : 'La API de Pokémon TCG no responde. Obtén una API key gratuita en dev.pokemontcg.io y añádela a POKEMON_TCG_API_KEY para mayor estabilidad.',
          'POKEMON_API_UNAVAILABLE'
        );
      }

      if (!response.ok) {
        throw new AppError(
          response.status,
          'No se pudieron obtener las cartas. Revisa los filtros e inténtalo de nuevo.',
          'POKEMON_API_ERROR'
        );
      }

      return response;
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, lastRetryAfter));
        continue;
      }

      throw new AppError(
        503,
        'No se pudo conectar con la API de Pokémon TCG. Comprueba tu conexión e inténtalo más tarde.',
        'POKEMON_API_NETWORK_ERROR'
      );
    }
  }

  throw new AppError(503, 'La API de Pokémon TCG no está disponible.', 'POKEMON_API_ERROR');
}

export function getMarketPrice(card: PokemonCard): number {
  const tcg = card.tcgplayer?.prices;
  if (tcg) {
    for (const variant of Object.values(tcg)) {
      if (variant?.market && variant.market > 0) return variant.market;
      if (variant?.mid && variant.mid > 0) return variant.mid;
    }
  }

  const cm = card.cardmarket?.prices;
  if (cm) {
    const p = cm.trendPrice ?? cm.averageSellPrice ?? cm.lowPrice;
    if (p !== undefined && p > 0) return p;
  }

  return 0;
}

function matchesPriceFilter(
  price: number,
  priceMin?: number,
  priceMax?: number
): boolean {
  if (price <= 0) return false;
  if (priceMin !== undefined && price < priceMin) return false;
  if (priceMax !== undefined && price > priceMax) return false;
  return true;
}

const PRICE_FILTER_MAX_API_PAGES = 20;
const PRICE_FILTER_API_PAGE_SIZE = 250;

async function fetchCardsPage(
  params: CardSearchParams,
  page: number,
  pageSize: number,
  select = CARD_SELECT_LIST
): Promise<CardSearchResult> {
  const searchParams = new URLSearchParams();
  searchParams.set('q', buildQuery(params));
  searchParams.set('orderBy', sanitizeOrderBy(params.orderBy));
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));
  searchParams.set('select', select);

  const url = `${BASE_URL}/cards?${searchParams.toString()}`;
  const response = await fetchWithRetry(url);
  const json = (await response.json()) as PokemonApiResponse<PokemonCard[]>;

  return {
    cards: json.data ?? [],
    page: json.page ?? page,
    pageSize: json.pageSize ?? pageSize,
    count: json.count ?? json.data?.length ?? 0,
    totalCount: json.totalCount ?? json.data?.length ?? 0,
  };
}

async function searchCardsWithPriceFilter(
  params: CardSearchParams,
  normalized: CardSearchParams
): Promise<CardSearchResult> {
  const pageSize = normalized.pageSize ?? 20;
  const targetPage = normalized.page ?? 1;
  const baseParams = { ...normalized, page: undefined, pageSize: undefined };

  const matching: PokemonCard[] = [];
  let apiPage = 1;

  while (apiPage <= PRICE_FILTER_MAX_API_PAGES) {
    const batch = await fetchCardsPage(baseParams, apiPage, PRICE_FILTER_API_PAGE_SIZE);

    for (const card of batch.cards) {
      const price = getMarketPrice(card);
      if (matchesPriceFilter(price, params.priceMin, params.priceMax)) {
        matching.push(card);
      }
    }

    if (apiPage * PRICE_FILTER_API_PAGE_SIZE >= batch.totalCount) break;
    apiPage++;
  }

  const start = (targetPage - 1) * pageSize;
  const pageCards = matching.slice(start, start + pageSize);

  return {
    cards: pageCards,
    page: targetPage,
    pageSize,
    count: pageCards.length,
    totalCount: matching.length,
    priceFiltered: true,
  };
}

const PRICE_PRIORITY_MAX_API_PAGES = 12;

async function searchCardsWithPricePriority(
  normalized: CardSearchParams
): Promise<CardSearchResult> {
  const pageSize = normalized.pageSize ?? 20;
  const targetPage = normalized.page ?? 1;
  const needed = targetPage * pageSize;
  const baseParams = { ...normalized, page: undefined, pageSize: undefined };

  const withPrice: PokemonCard[] = [];
  const withoutPrice: PokemonCard[] = [];
  let apiPage = 1;
  let apiTotal = 0;

  while (apiPage <= PRICE_PRIORITY_MAX_API_PAGES) {
    const batch = await fetchCardsPage(baseParams, apiPage, PRICE_FILTER_API_PAGE_SIZE);
    apiTotal = batch.totalCount;

    for (const card of batch.cards) {
      if (getMarketPrice(card) > 0) withPrice.push(card);
      else withoutPrice.push(card);
    }

    const collected = withPrice.length + withoutPrice.length;
    if (collected >= needed || apiPage * PRICE_FILTER_API_PAGE_SIZE >= apiTotal) {
      break;
    }
    apiPage++;
  }

  const all = [...withPrice, ...withoutPrice];
  const start = (targetPage - 1) * pageSize;
  const pageCards = all.slice(start, start + pageSize);
  const fullyScanned = apiPage * PRICE_FILTER_API_PAGE_SIZE >= apiTotal;

  return {
    cards: pageCards,
    page: targetPage,
    pageSize,
    count: pageCards.length,
    totalCount: fullyScanned ? all.length : apiTotal,
    pricePrioritized: true,
  };
}

export async function searchCards(params: CardSearchParams): Promise<CardSearchResult> {
  const normalized: CardSearchParams = {
    ...params,
    name: params.name?.trim() ? normalizeSearchName(params.name) : undefined,
    orderBy: sanitizeOrderBy(params.orderBy),
    page: params.page ?? 1,
    pageSize: Math.min(params.pageSize ?? 20, 50),
  };

  const hasPriceFilter =
    params.priceMin !== undefined || params.priceMax !== undefined;

  const key = cacheKey('search', { ...normalized, hasPriceFilter, pricePriority: !hasPriceFilter });
  const cached = getFromCache<CardSearchResult>(key);
  if (cached) return cached;

  let result: CardSearchResult;

  if (hasPriceFilter) {
    result = await searchCardsWithPriceFilter(params, normalized);
  } else {
    result = await searchCardsWithPricePriority(normalized);
  }

  setCache(key, result, hasPriceFilter ? 60_000 : SEARCH_CACHE_TTL);
  return result;
}

export async function getCardById(id: string): Promise<PokemonCard> {
  const key = cacheKey('card', id);
  const cached = getFromCache<PokemonCard>(key);
  if (cached) return cached;

  const searchParams = new URLSearchParams();
  searchParams.set('q', `id:${escapeLucene(id)}`);
  searchParams.set('pageSize', '1');
  searchParams.set('select', CARD_SELECT_FULL);

  const url = `${BASE_URL}/cards?${searchParams.toString()}`;
  const response = await fetchWithRetry(url);
  const json = (await response.json()) as PokemonApiResponse<PokemonCard[]>;
  const card = json.data?.[0];
  if (!card) {
    throw new AppError(404, 'Carta no encontrada', 'CARD_NOT_FOUND');
  }
  setCache(key, card, 10 * 60 * 1000);
  return card;
}

const ID_BATCH_SIZE = 50;

export async function getCardsByIds(ids: string[]): Promise<PokemonCard[]> {
  if (ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];
  const cardMap = new Map<string, PokemonCard>();
  const uncachedIds: string[] = [];

  for (const id of uniqueIds) {
    const cached = getFromCache<PokemonCard>(cacheKey('card', id));
    if (cached) {
      cardMap.set(id, cached);
    } else {
      uncachedIds.push(id);
    }
  }

  for (let i = 0; i < uncachedIds.length; i += ID_BATCH_SIZE) {
    const batch = uncachedIds.slice(i, i + ID_BATCH_SIZE);
    const q = batch.map((id) => `id:${escapeLucene(id)}`).join(' OR ');

    const searchParams = new URLSearchParams();
    searchParams.set('q', q);
    searchParams.set('pageSize', String(batch.length));
    searchParams.set('select', CARD_SELECT_LIST);

    const url = `${BASE_URL}/cards?${searchParams.toString()}`;
    const response = await fetchWithRetry(url);
    const json = (await response.json()) as PokemonApiResponse<PokemonCard[]>;

    for (const card of json.data ?? []) {
      cardMap.set(card.id, card);
      setCache(cacheKey('card', card.id), card, 10 * 60 * 1000);
    }
  }

  return uniqueIds.map((id) => cardMap.get(id)).filter((c): c is PokemonCard => !!c);
}

const setCountCache = new Map<string, { count: number; expiresAt: number }>();
const SET_CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getSetCardCount(setId: string): Promise<number> {
  const cached = setCountCache.get(setId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.count;
  }

  const result = await searchCards({ set: setId, pageSize: 1 });
  const count = result.totalCount;
  setCountCache.set(setId, { count, expiresAt: Date.now() + SET_CACHE_TTL });
  return count;
}

interface SetSummary {
  id: string;
  name: string;
  series: string;
  total: number;
  releaseDate: string;
}

let setsCache: { data: SetSummary[]; expiresAt: number } | null = null;

export async function getSets(): Promise<SetSummary[]> {
  if (setsCache && setsCache.expiresAt > Date.now()) {
    return setsCache.data;
  }

  const url = `${BASE_URL}/sets?pageSize=250&orderBy=-releaseDate&select=id,name,series,total,releaseDate`;
  const response = await fetchWithRetry(url);
  const json = (await response.json()) as PokemonApiResponse<SetSummary[]>;
  const data = json.data ?? [];
  setsCache = { data, expiresAt: Date.now() + 60 * 60 * 1000 };
  return data;
}

if (!env.POKEMON_TCG_API_KEY && env.NODE_ENV !== 'test') {
  console.warn(
    '⚠ POKEMON_TCG_API_KEY not set — API searches may fail under load. Get a free key at https://dev.pokemontcg.io/'
  );
}
