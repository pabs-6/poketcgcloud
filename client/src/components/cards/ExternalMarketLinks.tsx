import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import {
  isCardmarketAffiliateEnabled,
  isTcgplayerAffiliateEnabled,
} from '@/utils/affiliateLinks';

interface ExternalMarketLinksProps {
  tcgplayer?: string;
  cardmarket?: string;
  className?: string;
  compact?: boolean;
}

export function ExternalMarketLinks({
  tcgplayer,
  cardmarket,
  className,
  compact = false,
}: ExternalMarketLinksProps) {
  const { t } = useTranslation();

  if (!tcgplayer && !cardmarket) return null;

  const linkClass = compact
    ? 'inline-flex items-center gap-1 text-[10px] font-medium text-poke-red hover:underline'
    : 'inline-flex items-center gap-1.5 text-sm font-medium text-poke-red hover:underline';

  const sponsoredRel = 'noopener noreferrer sponsored';

  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      {tcgplayer && (
        <a
          href={tcgplayer}
          target="_blank"
          rel={isTcgplayerAffiliateEnabled() ? sponsoredRel : 'noopener noreferrer'}
          className={linkClass}
        >
          {compact ? 'TCGPlayer' : t('cards.buyOnTcgplayer')}
        </a>
      )}
      {cardmarket && (
        <a
          href={cardmarket}
          target="_blank"
          rel={isCardmarketAffiliateEnabled() ? sponsoredRel : 'noopener noreferrer'}
          className={linkClass}
        >
          {compact ? 'Cardmarket' : t('cards.viewOnCardmarket')}
        </a>
      )}
    </div>
  );
}
