import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { CardsIcon } from '@/components/icons/Icons';
import { ExternalMarketLinks } from './ExternalMarketLinks';

/** Sets where images.pokemontcg.io often returns 404 or card-back placeholder */
const SETS_WITH_UNRELIABLE_IMAGES = new Set(['mcd14', 'mcd15', 'mcd17', 'mcd18']);

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  setId?: string;
  tcgplayerUrl?: string;
  cardmarketUrl?: string;
  priority?: boolean;
}

export function CardImage({
  src,
  alt,
  className,
  setId,
  tcgplayerUrl,
  cardmarketUrl,
  priority = false,
}: CardImageProps) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(
    setId ? SETS_WITH_UNRELIABLE_IMAGES.has(setId) : false
  );

  if (failed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-poke-gray-100 dark:bg-poke-gray-800 text-center p-4',
          className
        )}
      >
        <CardsIcon className="h-8 w-8 text-poke-gray-500 opacity-50" />
        <p className="text-xs font-medium text-poke-gray-500 leading-snug">{alt}</p>
        <p className="text-[10px] text-poke-gray-500/80">{t('cards.imageUnavailable')}</p>
        {(tcgplayerUrl || cardmarketUrl) && (
          <ExternalMarketLinks
            tcgplayer={tcgplayerUrl}
            cardmarket={cardmarketUrl}
            compact
            className="mt-1 justify-center"
          />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export function isUnreliableSetImage(setId?: string): boolean {
  return setId ? SETS_WITH_UNRELIABLE_IMAGES.has(setId) : false;
}
