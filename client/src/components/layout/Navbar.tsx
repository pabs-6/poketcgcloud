import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import {
  SearchIcon,
  CollectionIcon,
  WishlistIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
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

  const isGallery = location.pathname.startsWith('/cards');
  const isAlbum = location.pathname.startsWith('/collection');

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-poke-gray-200/80 dark:border-poke-gray-800 bg-white/90 dark:bg-poke-black/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
            <img src="/pokeball.svg" alt="" className="h-9 w-9" />
            <span className="hidden sm:inline">
              <span className="text-poke-red">Poké</span>
              <span className="text-poke-black dark:text-poke-white">Binder</span>
            </span>
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-2 max-w-xl">
            <Link
              to="/cards"
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-5',
                isGallery
                  ? 'bg-poke-red text-white shadow-md shadow-poke-red/25'
                  : 'bg-poke-gray-100 dark:bg-poke-gray-800 text-poke-black dark:text-poke-white hover:bg-poke-red/10 hover:text-poke-red'
              )}
            >
              <SearchIcon className="h-4 w-4 shrink-0" />
              <span>{t('nav.gallery')}</span>
            </Link>
            {user ? (
              <Link
                to="/collection"
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-5',
                  isAlbum
                    ? 'bg-poke-black dark:bg-poke-white text-white dark:text-poke-black shadow-md'
                    : 'border-2 border-poke-red/30 text-poke-red hover:bg-poke-red hover:text-white hover:border-poke-red'
                )}
              >
                <CollectionIcon className="h-4 w-4 shrink-0" />
                <span>{t('nav.myAlbum')}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-1 sm:flex-none">
                <span className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-poke-red/30 px-3 py-2.5 text-sm font-semibold text-poke-red hover:bg-poke-red hover:text-white sm:px-5">
                  <CollectionIcon className="h-4 w-4" />
                  {t('nav.myAlbum')}
                </span>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <nav className="hidden md:flex items-center gap-1 mr-1">
              {secondaryLinks.map(({ to, labelKey, Icon, auth }) =>
                !auth || user ? (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-poke-gray-500 hover:text-poke-red"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t(labelKey)}
                  </Link>
                ) : null
              )}
            </nav>

            <LanguageSwitcher />

            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={t('nav.themeToggle')} className="!px-2">
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-poke-gray-100 dark:hover:bg-poke-gray-800">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-poke-red/10 text-poke-red">
                      <UserIcon className="h-4 w-4" />
                    </span>
                  )}
                </Link>
                <Button variant="secondary" size="sm" onClick={logout} className="hidden sm:inline-flex">{t('nav.logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
                <Link to="/register"><Button size="sm">{t('nav.register')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {user && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-poke-gray-200 dark:border-poke-gray-800 bg-white/95 dark:bg-poke-black/95 backdrop-blur safe-area-pb">
          <div className="mx-auto grid max-w-lg grid-cols-4 py-2">
            <Link to="/cards" className={cn('flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium', isGallery ? 'text-poke-red' : 'text-poke-gray-500')}>
              <SearchIcon className="h-5 w-5" />
              {t('nav.gallery')}
            </Link>
            <Link to="/collection" className={cn('flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium', isAlbum ? 'text-poke-red' : 'text-poke-gray-500')}>
              <CollectionIcon className="h-5 w-5" />
              {t('nav.album')}
            </Link>
            <Link to="/wishlist" className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-poke-gray-500 hover:text-poke-red">
              <WishlistIcon className="h-5 w-5" />
              {t('nav.wishlist')}
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-poke-gray-500 hover:text-poke-red">
              <UserIcon className="h-5 w-5" />
              {t('nav.profile')}
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
