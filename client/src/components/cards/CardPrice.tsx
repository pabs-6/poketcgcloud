import { useTranslation } from 'react-i18next';
import type { PokemonCard } from '@/types';
import {
  getCardPrices,
  getExternalLinks,
  formatPriceQuote,
  PRICE_SOURCE_LABELS,
} from '@/utils/cardHelpers';
import { ExternalMarketLinks } from './ExternalMarketLinks';
import { cn } from '@/utils';

interface CardPriceProps {
  card: PokemonCard;
  size?: 'sm' | 'lg';
  showLinksWhenAvailable?: boolean;
  className?: string;
}

export function CardPrice({
  card,
  size = 'sm',
  showLinksWhenAvailable = true,
  className,
}: CardPriceProps) {
  const { t } = useTranslation();
  const quotes = getCardPrices(card);
  const links = getExternalLinks(card);
  const hasPrice = quotes.length > 0;
  const showLinks =
    showLinksWhenAvailable &&
    (links.tcgplayer || links.cardmarket) &&
    (!hasPrice || size === 'lg');

  if (size === 'lg') {
    return (
      <div className={cn('space-y-3', className)}>
        {hasPrice ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {quotes.map((quote) => (
              <div
                key={quote.source}
                className="rounded-lg border border-poke-gray-200 dark:border-poke-gray-800 bg-poke-gray-100/50 dark:bg-poke-black/30 p-3"
              >
                <p className="text-xs font-medium text-poke-gray-500 mb-1">
                  {PRICE_SOURCE_LABELS[quote.source]}
                </p>
                <p className="text-2xl font-bold text-poke-red">{formatPriceQuote(quote)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xl font-bold text-poke-gray-500">{t('cards.noPrice')}</p>
        )}
        {showLinks && (
          <div className="space-y-1">
            {!hasPrice && (
              <p className="text-xs text-poke-gray-500">{t('cards.checkPriceAt')}</p>
            )}
            <ExternalMarketLinks
              tcgplayer={links.tcgplayer}
              cardmarket={links.cardmarket}
            />
          </div>
        )}
        {hasPrice && (
          <p className="text-[11px] text-poke-gray-500">
            {t('cards.priceDisclaimer')}
          </p>
        )}
      </div>
    );
  }

  const primary = quotes[0];

  return (
    <div className={cn('space-y-0.5', className)}>
      {primary ? (
        <p className="text-sm text-poke-red font-semibold">
          {formatPriceQuote(primary)}
          <span className="ml-1 text-[10px] font-normal text-poke-gray-500">
            {PRICE_SOURCE_LABELS[primary.source]}
          </span>
        </p>
      ) : (
        <p className="text-sm text-poke-gray-500">{t('cards.noPrice')}</p>
      )}
      {quotes.length > 1 && (
        <p className="text-[10px] text-poke-gray-500">
          {PRICE_SOURCE_LABELS[quotes[1].source]}: {formatPriceQuote(quotes[1])}
        </p>
      )}
      {showLinks && !hasPrice && (
        <ExternalMarketLinks
          tcgplayer={links.tcgplayer}
          cardmarket={links.cardmarket}
          compact
        />
      )}
    </div>
  );
}
