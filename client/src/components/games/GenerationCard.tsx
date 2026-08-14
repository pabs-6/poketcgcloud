import { Link } from 'react-router-dom';
import { RegionLogo } from './RegionLogo';
import { GameList } from './GameLogo';

interface CatalogGame {
  slug: string;
  name: string;
  hasTeams?: boolean;
}

interface GenerationCardProps {
  name: string;
  region: string;
  games: CatalogGame[];
  pokedexTo: string;
}

export function GenerationCard({ name, region, games, pokedexTo }: GenerationCardProps) {
  return (
    <article className="glass-panel card-hover p-4">
      <Link to={pokedexTo} className="flex items-start gap-3 group">
        <RegionLogo region={region} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold group-hover:text-poke-red transition-colors">{name}</p>
          <p className="text-sm text-poke-gray-500">{region}</p>
        </div>
      </Link>

      {games.length > 0 && (
        <div className="mt-3 border-t border-poke-gray-200 dark:border-poke-gray-700 pt-3">
          <GameList games={games} basePath="/games/pokedex/game" />
        </div>
      )}
    </article>
  );
}
