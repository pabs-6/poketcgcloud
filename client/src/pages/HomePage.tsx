import { Link, Navigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { SearchIcon, CollectionIcon, ChartIcon, CardsIcon, PokedexIcon } from '@/components/icons/Icons';

export function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-poke-gray-200 dark:border-poke-gray-800 bg-white dark:bg-poke-gray-800 p-5 sm:p-8 md:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-poke-red/10 blur-3xl" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-poke-red/20 bg-poke-red/5 px-4 py-1.5 text-sm font-medium text-poke-red">
            <CardsIcon className="h-4 w-4" />
            {t('home.badge')}
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <Trans i18nKey="home.title" components={{ 1: <span className="text-poke-red" />, 2: <span className="text-poke-red" /> }} />
          </h1>
          <p className="text-base sm:text-lg text-poke-gray-500 leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/cards" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <SearchIcon className="h-5 w-5" />
                {t('home.exploreGallery')}
              </Button>
            </Link>
            {user ? (
              <Link to="/collection" className="flex-1 sm:flex-none">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 border-2 border-poke-red/30 text-poke-red hover:bg-poke-red hover:text-white">
                  <CollectionIcon className="h-5 w-5" />
                  {t('home.openAlbum')}
                </Button>
              </Link>
            ) : (
              <Link to="/register" className="flex-1 sm:flex-none">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {t('home.createAccount')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/cards" className="glass-panel card-hover group p-5 sm:p-8 block">
          <SearchIcon className="h-8 w-8 sm:h-10 sm:w-10 text-poke-red mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-poke-red transition-colors">{t('home.galleryTitle')}</h2>
          <p className="text-poke-gray-500 leading-relaxed">
            {t('home.galleryDesc')}
          </p>
          <p className="mt-4 text-sm font-semibold text-poke-red">{t('home.galleryLink')}</p>
        </Link>

        <Link to={user ? '/collection' : '/login'} className="glass-panel card-hover group p-5 sm:p-8 block border-2 border-poke-red/15">
          <CollectionIcon className="h-8 w-8 sm:h-10 sm:w-10 text-poke-black dark:text-poke-white mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('home.albumTitle')}</h2>
          <p className="text-poke-gray-500 leading-relaxed">
            {t('home.albumDesc')}
          </p>
          <p className="mt-4 text-sm font-semibold text-poke-red">{user ? t('home.albumLinkOpen') : t('home.albumLinkLogin')}</p>
        </Link>

        <Link to="/games/pokedex" className="glass-panel card-hover group p-5 sm:p-8 block md:col-span-2 lg:col-span-1">
          <PokedexIcon className="h-8 w-8 sm:h-10 sm:w-10 text-poke-red mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-poke-red transition-colors">{t('home.gamesTitle')}</h2>
          <p className="text-poke-gray-500 leading-relaxed">
            {t('home.gamesDesc')}
          </p>
          <p className="mt-4 text-sm font-semibold text-poke-red">{t('home.gamesLink')}</p>
        </Link>
      </section>

      {user && (
        <section className="text-center">
          <Link to="/profile">
            <Button variant="ghost" className="gap-2">
              <ChartIcon className="h-4 w-4" />
              {t('home.statsLink')}
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
}

export function DashboardRedirect() {
  return <Navigate to="/profile#estadisticas" replace />;
}
