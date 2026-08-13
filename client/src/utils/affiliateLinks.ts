export interface AffiliateConfig {
  tcgplayerPartnerLink: string;
  cardmarketReferrer: string;
}

export function getAffiliateConfig(): AffiliateConfig {
  return {
    tcgplayerPartnerLink: import.meta.env.VITE_TCGPLAYER_PARTNER_LINK?.trim() ?? '',
    cardmarketReferrer: import.meta.env.VITE_CARDMARKET_REFERRER?.trim() ?? '',
  };
}

export function isAffiliateEnabled(): boolean {
  const { tcgplayerPartnerLink, cardmarketReferrer } = getAffiliateConfig();
  return Boolean(tcgplayerPartnerLink || cardmarketReferrer);
}

export function isTcgplayerAffiliateEnabled(): boolean {
  return Boolean(getAffiliateConfig().tcgplayerPartnerLink);
}

export function isCardmarketAffiliateEnabled(): boolean {
  return Boolean(getAffiliateConfig().cardmarketReferrer);
}

/**
 * Wraps a TCGPlayer product URL with the Impact partner redirect.
 * @see https://docs.tcgplayer.com/docs/tcgplayer-affiliate-program
 */
export function buildTcgplayerAffiliateUrl(destinationUrl: string): string {
  const { tcgplayerPartnerLink } = getAffiliateConfig();
  if (!tcgplayerPartnerLink || !destinationUrl) return destinationUrl;

  try {
    const partner = new URL(tcgplayerPartnerLink);
    partner.searchParams.set('u', destinationUrl);
    return partner.toString();
  } catch {
    return destinationUrl;
  }
}

/**
 * Adds Cardmarket referrer param. Mainly credits new signups; product links are best-effort.
 */
export function buildCardmarketAffiliateUrl(destinationUrl: string): string {
  const { cardmarketReferrer } = getAffiliateConfig();
  if (!cardmarketReferrer || !destinationUrl) return destinationUrl;

  try {
    const url = new URL(destinationUrl);
    url.searchParams.set('referrer', cardmarketReferrer);
    return url.toString();
  } catch {
    return destinationUrl;
  }
}

export function buildAffiliateMarketUrls(urls: { tcgplayer?: string; cardmarket?: string }) {
  return {
    tcgplayer: urls.tcgplayer ? buildTcgplayerAffiliateUrl(urls.tcgplayer) : undefined,
    cardmarket: urls.cardmarket ? buildCardmarketAffiliateUrl(urls.cardmarket) : undefined,
  };
}
