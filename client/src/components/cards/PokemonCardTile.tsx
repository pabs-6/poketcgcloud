import { Link } from 'react-router-dom';

import type { PokemonCard } from '@/types';

import { Card } from '@/components/ui/Card';

import { Badge } from '@/components/ui/Badge';

import { CardImage } from '@/components/cards/CardImage';

import { CardPrice } from '@/components/cards/CardPrice';

import { CardQuickActions } from '@/components/cards/CardQuickActions';

import { getExternalLinks } from '@/utils/cardHelpers';



interface PokemonCardTileProps {

  card: PokemonCard;

  actions?: React.ReactNode;

  showQuickActions?: boolean;

  imagePriority?: boolean;

}



export function PokemonCardTile({

  card,

  actions,

  showQuickActions = false,

  imagePriority = false,

}: PokemonCardTileProps) {

  const links = getExternalLinks(card);



  return (

    <Card className="overflow-hidden card-hover group flex flex-col">

      <Link to={`/cards/${card.id}`} className="block flex-1">

        <div className="aspect-[2.5/3.5] overflow-hidden bg-poke-gray-100 dark:bg-poke-gray-800 relative">

          <CardImage

            src={card.images.small}

            alt={card.name}

            setId={card.set.id}

            tcgplayerUrl={links.tcgplayer}

            cardmarketUrl={links.cardmarket}

            priority={imagePriority}

            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"

          />

        </div>

        <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">

          <h3 className="font-semibold text-sm sm:text-base text-poke-black dark:text-poke-white truncate">{card.name}</h3>

          <div className="flex flex-wrap gap-1">

            <Badge className="max-w-[85%] truncate">{card.set.name}</Badge>

            {card.rarity && <Badge variant="red">{card.rarity}</Badge>}

          </div>

          <p className="text-xs text-poke-gray-500">#{card.number}</p>

          <CardPrice card={card} size="sm" />

        </div>

      </Link>

      {(showQuickActions || actions) && (
        <div className="px-3 pb-3 flex flex-col gap-2 mt-auto items-center">
          {showQuickActions && <CardQuickActions cardId={card.id} />}

          {actions && <div className="flex gap-2">{actions}</div>}

        </div>

      )}

    </Card>

  );

}

