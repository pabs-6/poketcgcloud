import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PokemonEvolution } from '@/types/games';
import { PokemonSprite } from './PokemonSprite';

interface EvolutionChainProps {
  evolution: PokemonEvolution[];
  game?: string;
  shiny?: boolean;
}

export function EvolutionChain({ evolution, game, shiny = false }: EvolutionChainProps) {
  const { t } = useTranslation();

  if (evolution.length <= 1) {
    return <p className="text-sm text-poke-gray-500">{t('games.noEvolution')}</p>;
  }

  const linkFor = (speciesId: number) =>
    `/games/pokemon/${speciesId}${game ? `?game=${game}` : ''}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {evolution.map((stage, index) => (
        <div key={stage.speciesId} className="flex items-center gap-3">
          <Link to={linkFor(stage.speciesId)} className="glass-panel card-hover block p-3 text-center min-w-[100px]">
            <PokemonSprite
              speciesId={stage.speciesId}
              sprite={stage.sprite}
              shinySprite={stage.shinySprite}
              shiny={shiny}
              alt={stage.name}
              className="mx-auto h-16 w-16 object-contain"
            />
            <p className="mt-1 text-sm font-semibold">{stage.name}</p>
            {stage.method && index > 0 && (
              <p className="mt-1 text-[10px] text-poke-red font-medium">{stage.method}</p>
            )}
          </Link>
          {index < evolution.length - 1 && (
            <span className="text-poke-gray-400 text-xl">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
