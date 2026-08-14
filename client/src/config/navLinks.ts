import type { ComponentType, SVGProps } from 'react';
import {
  SearchIcon,
  CollectionIcon,
  WishlistIcon,
  HeartIcon,
  UserIcon,
  PokedexIcon,
  TeamIcon,
} from '@/components/icons/Icons';

type IconProps = SVGProps<SVGSVGElement>;

export interface NavLinkItem {
  to: string;
  labelKey: string;
  descKey?: string;
  Icon: ComponentType<IconProps>;
  primary?: boolean;
  auth?: boolean;
}

export const tcgPrimaryLinks: NavLinkItem[] = [
  { to: '/cards', labelKey: 'nav.links.cardsGallery.label', descKey: 'nav.links.cardsGallery.desc', Icon: SearchIcon, primary: true },
  { to: '/collection', labelKey: 'nav.links.collection.label', descKey: 'nav.links.collection.desc', Icon: CollectionIcon, primary: true, auth: true },
];

export const tcgSecondaryLinks: NavLinkItem[] = [
  { to: '/wishlist', labelKey: 'nav.links.wishlist.label', Icon: WishlistIcon, auth: true },
  { to: '/favorites', labelKey: 'nav.links.favorites.label', Icon: HeartIcon, auth: true },
  { to: '/profile', labelKey: 'nav.links.profile.label', descKey: 'nav.links.profile.desc', Icon: UserIcon, auth: true },
];

export const gamesLinks: NavLinkItem[] = [
  { to: '/games/pokedex', labelKey: 'nav.links.pokedex.label', descKey: 'nav.links.pokedex.desc', Icon: PokedexIcon, primary: true },
  { to: '/games/teams', labelKey: 'nav.links.teams.label', descKey: 'nav.links.teams.desc', Icon: TeamIcon, primary: true },
];

export const tcgLinks: NavLinkItem[] = [...tcgPrimaryLinks, ...tcgSecondaryLinks];
