import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  buildTcgplayerAffiliateUrl,
  buildCardmarketAffiliateUrl,
  isAffiliateEnabled,
} from './affiliateLinks';

describe('affiliateLinks', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_TCGPLAYER_PARTNER_LINK', '');
    vi.stubEnv('VITE_CARDMARKET_REFERRER', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns original TCGPlayer URL when partner link is not set', () => {
    const dest = 'https://www.tcgplayer.com/product/123';
    expect(buildTcgplayerAffiliateUrl(dest)).toBe(dest);
  });

  it('wraps TCGPlayer URL with Impact redirect', () => {
    vi.stubEnv('VITE_TCGPLAYER_PARTNER_LINK', 'https://partner.tcgplayer.com/c/1/2/3');
    const dest = 'https://www.tcgplayer.com/product/123?name=pikachu';
    const result = buildTcgplayerAffiliateUrl(dest);
    expect(result).toContain('partner.tcgplayer.com/c/1/2/3');
    expect(result).toContain('u=');
    expect(decodeURIComponent(result)).toContain(dest);
  });

  it('adds referrer to Cardmarket URL', () => {
    vi.stubEnv('VITE_CARDMARKET_REFERRER', 'pabs-6');
    const dest = 'https://www.cardmarket.com/en/Pokemon/Products/Singles/123';
    const result = buildCardmarketAffiliateUrl(dest);
    expect(result).toContain('referrer=pabs-6');
  });

  it('isAffiliateEnabled when any config is set', () => {
    expect(isAffiliateEnabled()).toBe(false);
    vi.stubEnv('VITE_TCGPLAYER_PARTNER_LINK', 'https://partner.tcgplayer.com/c/1/2/3');
    expect(isAffiliateEnabled()).toBe(true);
  });
});
