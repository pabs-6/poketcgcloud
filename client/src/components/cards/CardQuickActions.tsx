import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useCardActions } from '@/hooks/useCardActions';
import { useUserCardLists } from '@/hooks/useUserCardLists';
import { CardActionButton } from '@/components/cards/CardActionButton';
import { CollectionIcon, WishlistIcon, HeartIcon } from '@/components/icons/Icons';
import { cn } from '@/utils';

interface CardQuickActionsProps {
  cardId: string;
  className?: string;
}

export function CardQuickActions({ cardId, className }: CardQuickActionsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { inCollection, inWishlist, inFavorites } = useUserCardLists();
  const { flash, addCollection, addWishlist, addFavorite } = useCardActions(cardId);

  if (!user) {
    return (
      <div
        className={cn('flex justify-center', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to="/login"
          title={t('cards.loginToAddAlbum')}
          aria-label={t('cards.loginToAddAlbum')}
          className={cn(
            'relative inline-flex h-9 w-9 items-center justify-center rounded-xl',
            'bg-poke-gray-100 dark:bg-poke-gray-800 text-poke-gray-600 dark:text-poke-gray-300',
            'hover:bg-poke-red/10 hover:text-poke-red hover:scale-105 transition-all'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <CollectionIcon className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-poke-red shadow-sm dark:bg-poke-gray-900">+</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CardActionButton
        label={t('cards.addToAlbum')}
        icon={CollectionIcon}
        primary
        loading={addCollection.isPending}
        success={flash.collection}
        active={inCollection.has(cardId) && !flash.collection}
        onClick={() => addCollection.mutate()}
      />
      <CardActionButton
        label={t('cards.addToWishlist')}
        icon={WishlistIcon}
        loading={addWishlist.isPending}
        success={flash.wishlist}
        active={inWishlist.has(cardId) && !flash.wishlist}
        onClick={() => addWishlist.mutate()}
      />
      <CardActionButton
        label={t('cards.markFavorite')}
        icon={HeartIcon}
        loading={addFavorite.isPending}
        success={flash.favorite}
        active={inFavorites.has(cardId) && !flash.favorite}
        onClick={() => addFavorite.mutate()}
      />
    </div>
  );
}
