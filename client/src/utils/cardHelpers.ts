import type { PokemonCard } from '@/types';

import { buildAffiliateMarketUrls } from './affiliateLinks';

export interface PriceQuote {
  amount: number;
  source: 'tcgplayer' | 'cardmarket';
  currency: 'USD' | 'EUR';
}

function bestTcgPlayerPrice(card: PokemonCard): number | undefined {
  const prices = card.tcgplayer?.prices;
  if (!prices) return undefined;

  for (const variant of Object.values(prices)) {
    if (variant?.market && variant.market > 0) return variant.market;
  }
  for (const variant of Object.values(prices)) {
    if (variant?.mid && variant.mid > 0) return variant.mid;
  }
  return undefined;
}

function bestCardmarketPrice(card: PokemonCard): number | undefined {
  const cm = card.cardmarket?.prices;
  if (!cm) return undefined;

  const p = cm.trendPrice ?? cm.averageSellPrice ?? cm.lowPrice;
  return p && p > 0 ? p : undefined;
}

/** Precios reales de TCGPlayer (USD) y Cardmarket (EUR) incluidos en la respuesta de la API */
export function getCardPrices(card: PokemonCard): PriceQuote[] {
  const quotes: PriceQuote[] = [];

  const tcg = bestTcgPlayerPrice(card);
  if (tcg !== undefined) {
    quotes.push({ amount: tcg, source: 'tcgplayer', currency: 'USD' });
  }

  const cm = bestCardmarketPrice(card);
  if (cm !== undefined) {
    quotes.push({ amount: cm, source: 'cardmarket', currency: 'EUR' });
  }

  return quotes;
}

/** Precio principal para filtros y dashboard — prioriza TCGPlayer (USD) */
export function getMarketPrice(card: PokemonCard): number | undefined {
  return bestTcgPlayerPrice(card) ?? bestCardmarketPrice(card);
}

export function getExternalLinks(card: PokemonCard) {
  return buildAffiliateMarketUrls({
    tcgplayer: card.tcgplayer?.url,
    cardmarket: card.cardmarket?.url,
  });
}

export function hasExternalLinks(card: PokemonCard): boolean {
  const links = getExternalLinks(card);
  return Boolean(links.tcgplayer || links.cardmarket);
}

export function formatPriceQuote(quote: PriceQuote): string {
  const symbol = quote.currency === 'EUR' ? '€' : '$';
  return `${symbol}${quote.amount.toFixed(2)}`;
}

export const PRICE_SOURCE_LABELS: Record<PriceQuote['source'], string> = {
  tcgplayer: 'TCGPlayer',
  cardmarket: 'Cardmarket',
};
