import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { statsApi, wishlistApi, favoritesApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProfileStatsSection } from '@/components/profile/ProfileStatsSection';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';
import { useFormatDate, useFormatPrice } from '@/hooks/useLocale';
import { UserIcon, PencilIcon } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';

export function ProfilePage() {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getAll,
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getAll,
  });

  if (!user) return null;

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('profile.title')}
        description={t('profile.desc')}
      >
        <Link to="/collection">
          <Button>{t('profile.goToAlbum')}</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="flex flex-col items-center p-6 text-center h-fit">
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-24 w-24 rounded-full object-cover ring-4 ring-poke-red/20" />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-poke-red/10 text-poke-red ring-4 ring-poke-red/20">
                <UserIcon className="h-10 w-10" />
              </span>
            )}
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              title={t('profile.editPhoto')}
              aria-label={t('profile.editPhoto')}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-poke-red text-white shadow-md hover:bg-poke-red-dark transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold">{user.username}</h2>
          <p className="text-sm text-poke-gray-500 break-all">{user.email}</p>
          <p className="mt-2 text-xs text-poke-gray-500">{t('profile.memberSince', { date: formatDate(user.createdAt) })}</p>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <StatCard
                label={t('profile.cardsInAlbum')}
                value={stats?.totalCards ?? 0}
                hint={t('profile.cardsHint')}
              />
              <StatCard
                label={t('profile.estimatedValue')}
                value={formatPrice(stats?.estimatedValue)}
                hint={t('profile.valueHint')}
              />
              <StatCard label={t('profile.inWishlist')} value={wishlist?.length ?? 0} />
              <StatCard label={t('profile.favoritesCount')} value={favorites?.length ?? 0} />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/cards" className="glass-panel card-hover p-5 block">
          <p className="font-semibold text-poke-red">{t('profile.galleryQuick')}</p>
          <p className="text-sm text-poke-gray-500 mt-1">{t('profile.galleryQuickDesc')}</p>
        </Link>
        <Link to="/collection" className="glass-panel card-hover p-5 block border-2 border-poke-red/20">
          <p className="font-semibold">{t('profile.albumQuick')}</p>
          <p className="text-sm text-poke-gray-500 mt-1">{t('profile.albumQuickDesc')}</p>
        </Link>
        <Link to="/wishlist" className="glass-panel card-hover p-5 block">
          <p className="font-semibold">{t('profile.wishlistQuick')}</p>
          <p className="text-sm text-poke-gray-500 mt-1">{t('profile.wishlistPending', { count: wishlist?.length ?? 0 })}</p>
        </Link>
      </div>

      <section id="estadisticas" className="space-y-4">
        <h2 className="text-2xl font-bold">{t('profile.statsTitle')}</h2>
        <ProfileStatsSection />
      </section>

      <ProfileEditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} />
    </div>
  );
}
