import { formatTypeName, getTypeColor } from '@/utils/pokemonTypes';
import { useTranslation } from 'react-i18next';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const { i18n } = useTranslation();
  const color = getTypeColor(type);
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold text-white shadow-sm ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      style={{ backgroundColor: color }}
    >
      {formatTypeName(type, i18n.language)}
    </span>
  );
}
