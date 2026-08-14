import { useTranslation } from 'react-i18next';
import { TypeBadge } from './TypeBadge';

interface TypeMatchupsProps {
  strongAgainst: string[];
  weakTo: string[];
  resistantTo: string[];
  immuneTo: string[];
}

function TypeList({ types }: { types: string[] }) {
  if (types.length === 0) return <span className="text-poke-gray-500 text-sm">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((t) => <TypeBadge key={t} type={t} />)}
    </div>
  );
}

export function TypeMatchups({ strongAgainst, weakTo, resistantTo, immuneTo }: TypeMatchupsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="glass-panel p-4">
        <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">{t('games.strongAgainst')}</h4>
        <TypeList types={strongAgainst} />
      </div>
      <div className="glass-panel p-4">
        <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">{t('games.weakTo')}</h4>
        <TypeList types={weakTo} />
      </div>
      <div className="glass-panel p-4">
        <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('games.resistantTo')}</h4>
        <TypeList types={resistantTo} />
      </div>
      <div className="glass-panel p-4">
        <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">{t('games.immuneTo')}</h4>
        <TypeList types={immuneTo} />
      </div>
    </div>
  );
}
