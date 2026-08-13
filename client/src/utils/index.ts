export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price?: number): string {
  if (price === undefined || price === 0) return 'N/D';
  return `$${price.toFixed(2)}`;
}

export function formatDate(date?: string): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-ES');
}

export const CONDITION_LABELS: Record<string, string> = {
  mint: 'Perfecta (Mint)',
  near_mint: 'Casi perfecta',
  excellent: 'Excelente',
  good: 'Buena',
  played: 'Jugada',
  poor: 'Mala',
};

export const POKEMON_TYPES = [
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
];

export const RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Ultra',
  'Rare Secret',
  'Promo',
];
