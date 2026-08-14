import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import {
  tcgPrimaryLinks,
  tcgSecondaryLinks,
  gamesLinks,
  type NavLinkItem,
} from '@/config/navLinks';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MenuLink({
  item,
  active,
  onClose,
  t,
}: {
  item: NavLinkItem;
  active: boolean;
  onClose: () => void;
  t: (key: string) => string;
}) {
  const { Icon } = item;
  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-3 min-h-[48px] transition-colors',
        active
          ? 'bg-poke-red text-white'
          : 'bg-poke-gray-100 dark:bg-poke-gray-800 hover:bg-poke-red/10'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{t(item.labelKey)}</p>
        {item.descKey && (
          <p className={cn('text-[11px]', active ? 'text-white/80' : 'text-poke-gray-500')}>
            {t(item.descKey)}
          </p>
        )}
      </div>
    </Link>
  );
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const visibleLinks = (links: NavLinkItem[]) =>
    links.filter((link) => !link.auth || user);

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t('common.close')}
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-white dark:bg-poke-gray-900 shadow-2xl safe-area-pt safe-area-pb">
        <div className="flex items-center justify-between border-b border-poke-gray-200 dark:border-poke-gray-800 px-4 py-3">
          <p className="font-semibold">{t('nav.menu')}</p>
          <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px] min-w-[44px]">
            ✕
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-poke-gray-500">
              {t('nav.sections.tcg')}
            </p>
            <nav className="space-y-2">
              {visibleLinks(tcgPrimaryLinks).map((item) => (
                <MenuLink key={item.to} item={item} active={isActive(item.to)} onClose={onClose} t={t} />
              ))}
              {visibleLinks(tcgSecondaryLinks).map((item) => (
                <MenuLink key={item.to} item={item} active={isActive(item.to)} onClose={onClose} t={t} />
              ))}
            </nav>
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-poke-gray-500">
              {t('nav.sections.games')}
            </p>
            <nav className="space-y-2">
              {gamesLinks.map((item) => (
                <MenuLink key={item.to} item={item} active={isActive(item.to)} onClose={onClose} t={t} />
              ))}
            </nav>
          </section>
        </div>

        <div className="border-t border-poke-gray-200 dark:border-poke-gray-800 p-4 space-y-2">
          {user ? (
            <Button variant="secondary" className="w-full min-h-[44px]" onClick={() => { logout(); onClose(); }}>
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="block">
                <Button variant="secondary" className="w-full min-h-[44px]">{t('nav.login')}</Button>
              </Link>
              <Link to="/register" onClick={onClose} className="block">
                <Button className="w-full min-h-[44px]">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
