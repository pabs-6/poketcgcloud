import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { tcgLinks, gamesLinks } from '@/config/navLinks';
import type { NavLinkItem } from '@/config/navLinks';

function NavSection({
  title,
  links,
  location,
  t,
}: {
  title: string;
  links: NavLinkItem[];
  location: ReturnType<typeof useLocation>;
  t: (key: string) => string;
}) {
  return (
    <div className="glass-panel p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-poke-gray-500">{title}</p>
      <nav className="space-y-2">
        {links.filter((l) => l.primary).map(({ to, labelKey, descKey, Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'block rounded-xl px-3 py-3 min-h-[48px] transition-all',
                active
                  ? 'bg-poke-red text-white shadow-md shadow-poke-red/20'
                  : 'bg-poke-gray-100 dark:bg-poke-gray-800 hover:bg-poke-red/10'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{t(labelKey)}</p>
                  {descKey && (
                    <p className={cn('text-[11px]', active ? 'text-white/80' : 'text-poke-gray-500')}>{t(descKey)}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      {links.some((l) => !l.primary) && (
        <nav className="mt-2 space-y-1">
          {links.filter((l) => !l.primary).map(({ to, labelKey, Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'nav-link min-h-[44px]',
                  active
                    ? 'bg-poke-red/10 text-poke-red font-medium'
                    : 'text-poke-gray-500 hover:bg-poke-gray-100 dark:hover:bg-poke-gray-800'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-4">
        <NavSection title={t('nav.sections.tcg')} links={tcgLinks} location={location} t={t} />
        <NavSection title={t('nav.sections.games')} links={gamesLinks} location={location} t={t} />
      </div>
    </aside>
  );
}
