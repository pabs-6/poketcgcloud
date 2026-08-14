import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { MobileMenu } from '@/components/layout/MobileMenu';
import {
  SearchIcon,
  CollectionIcon,
  WishlistIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  PokedexIcon,
  MenuIcon,
} from '@/components/icons/Icons';
import { cn } from '@/utils';

const secondaryLinks = [
  { to: '/wishlist', labelKey: 'nav.wishlist', Icon: WishlistIcon, auth: true },
  { to: '/favorites', labelKey: 'nav.favorites', Icon: HeartIcon, auth: true },
];

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isGallery = location.pathname.startsWith('/cards');
  const isAlbum = location.pathname.startsWith('/collection');
  const isWishlist = location.pathname.startsWith('/wishlist');
  const isFavorites = location.pathname.startsWith('/favorites');
  const isProfile = location.pathname.startsWith('/profile');
  const isPokedex = location.pathname.startsWith('/games/pokedex') || location.pathname.startsWith('/games/pokemon');
  const isGames = location.pathname.startsWith('/games');

  const bottomNavClass = (active: boolean) =>
    cn(
      'flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium min-h-[56px] touch-manipulation',
      active ? 'text-poke-red' : 'text-poke-gray-500'
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-poke-gray-200/80 dark:border-poke-gray-800 bg-white/90 dark:bg-poke-black/90 backdrop-blur safe-area-pt">
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 lg:px-8">
          <div className="flex items-center gap-1 shrink-0 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.menu')}
              className="lg:hidden !px-2 min-h-[44px] min-w-[44px]"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl min-w-0">
              <img src="/pokeball.svg" alt="" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              <span className="hidden min-[380px]:inline truncate">
                <span className="text-poke-red">Poké</span>
                <span className="text-poke-black dark:text-poke-white">Binder</span>
              </span>
            </Link>
          </div>

          <nav className="hidden sm:flex flex-1 items-center justify-center gap-1.5 sm:gap-2 max-w-md min-w-0">
            <Link
              to="/cards"
              title={t('nav.gallery')}
              aria-label={t('nav.gallery')}
              className={cn(
                'flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[44px]',
                isGallery
                  ? 'bg-poke-red text-white shadow-md shadow-poke-red/25'
                  : 'bg-poke-gray-100 dark:bg-poke-gray-800 text-poke-black dark:text-poke-white hover:bg-poke-red/10 hover:text-poke-red'
              )}
            >
              <SearchIcon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline truncate">{t('nav.gallery')}</span>
            </Link>
            {user ? (
              <Link
                to="/collection"
                title={t('nav.myAlbum')}
                aria-label={t('nav.myAlbum')}
                className={cn(
                  'flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[44px]',
                  isAlbum
                    ? 'bg-poke-black dark:bg-poke-white text-white dark:text-poke-black shadow-md'
                    : 'border-2 border-poke-red/30 text-poke-red hover:bg-poke-red hover:text-white hover:border-poke-red'
                )}
              >
                <CollectionIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline truncate">{t('nav.myAlbum')}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-1 sm:flex-none min-w-0" title={t('nav.myAlbum')}>
                <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-poke-red/30 px-2.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-poke-red hover:bg-poke-red hover:text-white min-h-[44px]">
                  <CollectionIcon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline truncate">{t('nav.myAlbum')}</span>
                </span>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <nav className="hidden lg:flex items-center gap-1 mr-1">
              {secondaryLinks.map(({ to, labelKey, Icon, auth }) =>
                !auth || user ? (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-poke-gray-500 hover:text-poke-red min-h-[44px]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t(labelKey)}
                  </Link>
                ) : null
              )}
            </nav>

            <LanguageSwitcher />

            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={t('nav.themeToggle')} className="!px-2 min-h-[44px] min-w-[44px]">
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                <Link to="/profile" className="hidden lg:flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-poke-gray-100 dark:hover:bg-poke-gray-800 min-h-[44px]">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-poke-red/10 text-poke-red">
                      <UserIcon className="h-4 w-4" />
                    </span>
                  )}
                </Link>
                <Button variant="secondary" size="sm" onClick={logout} className="hidden xl:inline-flex min-h-[44px]">{t('nav.logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="min-h-[44px]">{t('nav.login')}</Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm" className="text-xs sm:text-sm px-2.5 sm:px-4 min-h-[44px]">{t('nav.register')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-poke-gray-200 dark:border-poke-gray-800 bg-white/95 dark:bg-poke-black/95 backdrop-blur safe-area-pb"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 py-1">
          {user ? (
            <>
              <Link to="/cards" className={bottomNavClass(isGallery)}>
                <SearchIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.gallery')}</span>
              </Link>
              <Link to="/collection" className={bottomNavClass(isAlbum)}>
                <CollectionIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.album')}</span>
              </Link>
              <Link to="/games/pokedex" className={bottomNavClass(isPokedex)}>
                <PokedexIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.links.pokedex.label')}</span>
              </Link>
              <Link to="/favorites" className={bottomNavClass(isFavorites)}>
                <HeartIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.favorites')}</span>
              </Link>
              <Link to="/profile" className={bottomNavClass(isProfile || isWishlist)}>
                <UserIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.profile')}</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/cards" className={bottomNavClass(isGallery)}>
                <SearchIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.gallery')}</span>
              </Link>
              <Link to="/games/pokedex" className={bottomNavClass(isGames)}>
                <PokedexIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.links.pokedex.label')}</span>
              </Link>
              <Link to="/login" className={bottomNavClass(location.pathname === '/login')}>
                <UserIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.login')}</span>
              </Link>
              <Link to="/register" className={bottomNavClass(location.pathname === '/register')}>
                <CollectionIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.register')}</span>
              </Link>
              <button type="button" onClick={() => setMenuOpen(true)} className={bottomNavClass(menuOpen)}>
                <MenuIcon className="h-5 w-5" />
                <span className="truncate max-w-full">{t('nav.menu')}</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
