import { useTranslation } from 'react-i18next';
import { TypeBadge } from '@/components/games/TypeBadge';
import type { PokemonMove } from '@/types/games';
import { cn } from '@/utils';

interface PokemonMovesListProps {
  moves: PokemonMove[];
  showLearnInfo?: boolean;
  className?: string;
}

export function PokemonMovesList({ moves, showLearnInfo = false, className }: PokemonMovesListProps) {
  const { t } = useTranslation();

  if (moves.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid gap-2 md:hidden">
        {moves.map((move, i) => (
          <div
            key={`${move.name}-${i}-card`}
            className="rounded-xl border border-poke-gray-200 dark:border-poke-gray-700 bg-poke-gray-50/50 dark:bg-poke-gray-900/40 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium flex-1 min-w-[8rem]">{move.name}</span>
              <TypeBadge type={move.type} />
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-poke-gray-500">
              <div>
                <dt className="inline">{t('games.power')}: </dt>
                <dd className="inline font-mono text-poke-black dark:text-poke-white">{move.power ?? '—'}</dd>
              </div>
              <div>
                <dt className="inline">{t('games.category')}: </dt>
                <dd className="inline capitalize">{move.category.replace('-', ' ')}</dd>
              </div>
              {showLearnInfo && (
                <>
                  <div>
                    <dt className="inline">{t('games.method')}: </dt>
                    <dd className="inline capitalize">{move.method.replace('-', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="inline">{t('games.level')}: </dt>
                    <dd className="inline font-mono">{move.level || '—'}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden md:block rounded-xl border border-poke-gray-200 dark:border-poke-gray-700 overflow-hidden">
        <div className="panel-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-poke-gray-50 dark:bg-poke-gray-900/60">
              <tr className="border-b border-poke-gray-200 dark:border-poke-gray-700 text-left text-poke-gray-500">
                <th className="py-2.5 px-4 font-medium">{t('games.move')}</th>
                <th className="py-2.5 px-4 font-medium">{t('games.type')}</th>
                <th className="py-2.5 px-4 font-medium">{t('games.power')}</th>
                <th className="py-2.5 px-4 font-medium">{t('games.category')}</th>
                {showLearnInfo && (
                  <>
                    <th className="py-2.5 px-4 font-medium">{t('games.method')}</th>
                    <th className="py-2.5 px-4 font-medium">{t('games.level')}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {moves.map((move, i) => (
                <tr
                  key={`${move.name}-${i}-row`}
                  className="border-b border-poke-gray-100 dark:border-poke-gray-800 last:border-b-0"
                >
                  <td className="py-2.5 px-4 font-medium">{move.name}</td>
                  <td className="py-2.5 px-4"><TypeBadge type={move.type} /></td>
                  <td className="py-2.5 px-4 font-mono">{move.power ?? '—'}</td>
                  <td className="py-2.5 px-4 capitalize">{move.category.replace('-', ' ')}</td>
                  {showLearnInfo && (
                    <>
                      <td className="py-2.5 px-4 capitalize text-xs">{move.method.replace('-', ' ')}</td>
                      <td className="py-2.5 px-4 font-mono">{move.level || '—'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
