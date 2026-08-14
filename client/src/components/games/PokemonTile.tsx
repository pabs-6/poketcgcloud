import { Link } from 'react-router-dom';
import type { PokedexEntry } from '@/types/games';
import { TypeBadge } from './TypeBadge';
import { PokemonCategoryBadges } from './PokemonCategoryBadge';
import { PokemonSprite } from './PokemonSprite';

interface PokemonTileProps {
  entry: PokedexEntry;
  to: string;
  types?: string[];
  shiny?: boolean;
}

export function PokemonTile({ entry, to, types, shiny = false }: PokemonTileProps) {
  return (
    <Link to={to} className="glass-panel card-hover block p-3 text-center">
      <p className="text-[10px] font-mono text-poke-gray-500">#{String(entry.dexNumber).padStart(3, '0')}</p>
      <div className="mx-auto my-2 flex h-20 w-20 items-center justify-center">
        <PokemonSprite
          speciesId={entry.speciesId}
          sprite={entry.sprite}
          shinySprite={entry.shinySprite}
          shiny={shiny}
          alt={entry.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <p className="text-sm font-semibold truncate">{entry.name}</p>
      <PokemonCategoryBadges categories={entry.categories} className="mt-2" />
      {types && types.length > 0 && (
        <div className="mt-2 flex justify-center gap-1 flex-wrap">
          {types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>
      )}
    </Link>
  );
}
