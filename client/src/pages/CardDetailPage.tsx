import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { cardsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { CardImage, isUnreliableSetImage } from '@/components/cards/CardImage';
import { CardPrice } from '@/components/cards/CardPrice';
import { CardQuickActions } from '@/components/cards/CardQuickActions';
import { getExternalLinks } from '@/utils/cardHelpers';

export function CardDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => cardsApi.getById(id!),
    enabled: !!id,
    staleTime: 10 * 60_000,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-[2.5/3.5] w-full max-w-sm mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !card) {
    return <ErrorBanner message={t('cards.notFound')} />;
  }

  const links = getExternalLinks(card);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-4 flex flex-col items-center justify-center gap-3">
        <CardImage
          src={card.images.large}
          alt={card.name}
          setId={card.set.id}
          tcgplayerUrl={links.tcgplayer}
          cardmarketUrl={links.cardmarket}
          priority
          className="max-h-[500px] w-full object-contain"
        />
        {isUnreliableSetImage(card.set.id) && (
          <p className="text-xs text-poke-gray-500 text-center max-w-xs">
            {t('cards.mcdonaldsNote')}
          </p>
        )}
      </Card>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{card.set.name}</Badge>
            {card.rarity && <Badge variant="red">{card.rarity}</Badge>}
            {card.types?.map((cardType) => (
              <Badge key={cardType} variant="type">{cardType}</Badge>
            ))}
          </div>
          <p className="text-poke-gray-500">
            #{card.number} · {t('cards.hp')} {card.hp ?? '—'}
            {card.artist && ` · ${t('cards.artist', { name: card.artist })}`}
          </p>
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">{t('cards.marketPrices')}</h2>
          <CardPrice card={card} size="lg" />
        </Card>

        {user && (
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">{t('cards.addToAccount')}</h2>
            <CardQuickActions cardId={card.id} className="justify-center" />
          </Card>
        )}

        {card.attacks && card.attacks.length > 0 && (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">{t('cards.attacks')}</h2>
            <div className="space-y-3">
              {card.attacks.map((attack) => (
                <div key={attack.name} className="border-b border-poke-gray-200 dark:border-poke-gray-800 pb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{attack.name}</span>
                    <span className="text-poke-red">{attack.damage}</span>
                  </div>
                  {attack.text && <p className="text-sm text-poke-gray-500 mt-1">{attack.text}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {(card.weaknesses?.length || card.resistances?.length) && (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">{t('cards.weaknessesResistances')}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {card.weaknesses && (
                <div>
                  <p className="font-medium mb-1">{t('cards.weaknesses')}</p>
                  {card.weaknesses.map((w) => (
                    <p key={w.type}>{w.type}: {w.value}</p>
                  ))}
                </div>
              )}
              {card.resistances && (
                <div>
                  <p className="font-medium mb-1">{t('cards.resistances')}</p>
                  {card.resistances.map((r) => (
                    <p key={r.type}>{r.type}: {r.value}</p>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
