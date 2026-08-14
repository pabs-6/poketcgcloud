import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';
import { getGameVisual, pokemonArtwork } from '@/data/gameVisuals';

interface GameLogoProps {
  slug: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function GameLogo({ slug, size = 'sm', className }: GameLogoProps) {
  const visual = getGameVisual(slug);
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-lg bg-poke-gray-100 dark:bg-poke-gray-800 p-0.5',
        dim,
        className
      )}
    >
      <img
        src={pokemonArtwork(visual.speciesId)}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

interface GameLinkProps {
  slug: string;
  name: string;
  to: string;
}

export function GameLink({ slug, name, to }: GameLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-sm font-medium text-poke-gray-700 dark:text-poke-gray-200 hover:bg-poke-red/10 hover:text-poke-red transition-colors"
    >
      <GameLogo slug={slug} />
      {name}
    </Link>
  );
}

interface GameListProps {
  games: Array<{ slug: string; name: string }>;
  basePath: string;
  className?: string;
}

export function GameList({ games, basePath, className }: GameListProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-y-1', className)}>
      {games.map((game, index) => (
        <Fragment key={game.slug}>
          {index > 0 && <span className="mx-1 text-poke-gray-300 dark:text-poke-gray-600">·</span>}
          <GameLink slug={game.slug} name={game.name} to={`${basePath}/${game.slug}`} />
        </Fragment>
      ))}
    </div>
  );
}
