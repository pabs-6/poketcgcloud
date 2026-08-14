import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { ShinyToggle } from '@/components/games/ShinyToggle';

export type PokemonCategory =
  | 'legendary'
  | 'mythical'
  | 'pseudo-legendary'
  | 'ultra-beast'
  | 'paradox'
  | 'baby';

const CATEGORY_STYLES: Record<PokemonCategory, string> = {
  legendary: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  mythical: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  'pseudo-legendary': 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
  'ultra-beast': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
  paradox: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  baby: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
};

interface PokemonCategoryBadgeProps {
  category: PokemonCategory;
  size?: 'xs' | 'sm';
}

export function PokemonCategoryBadge({ category, size = 'xs' }: PokemonCategoryBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
        CATEGORY_STYLES[category]
      )}
    >
      {t(`games.categories.${category}`)}
    </span>
  );
}

interface PokemonCategoryBadgesProps {
  categories: PokemonCategory[];
  size?: 'xs' | 'sm';
  className?: string;
}

export function PokemonCategoryBadges({ categories, size = 'xs', className }: PokemonCategoryBadgesProps) {
  if (categories.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap justify-center gap-1', className)}>
      {categories.map((category) => (
        <PokemonCategoryBadge key={category} category={category} size={size} />
      ))}
    </div>
  );
}

export function PokemonCategoryLegend({
  shiny,
  onToggleShiny,
  showCategories = true,
}: {
  shiny?: boolean;
  onToggleShiny?: () => void;
  showCategories?: boolean;
}) {
  const { t } = useTranslation();
  const samples: PokemonCategory[] = ['legendary', 'mythical', 'pseudo-legendary', 'ultra-beast', 'paradox', 'baby'];
  const showToggle = shiny !== undefined && onToggleShiny;

  if (!showCategories && !showToggle) return null;

  return (
    <div className="glass-panel p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {showCategories ? (
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-poke-gray-500 mb-2">
              {t('games.categoryLegend')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {samples.map((category) => (
                <PokemonCategoryBadge key={category} category={category} size="sm" />
              ))}
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

        {showToggle && (
          <div className={cn('flex shrink-0', showCategories ? 'sm:justify-end' : 'justify-end w-full')}>
            <ShinyToggle shiny={shiny} onToggle={onToggleShiny} />
          </div>
        )}
      </div>
    </div>
  );
}
