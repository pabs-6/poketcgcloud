const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? '#888';
}

export function formatTypeName(type: string, lang: string): string {
  const names: Record<string, Record<string, string>> = {
    es: {
      normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico', grass: 'Planta',
      ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador',
      psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón',
      dark: 'Siniestro', steel: 'Acero', fairy: 'Hada',
    },
    en: {
      normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass',
      ice: 'Ice', fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying',
      psychic: 'Psychic', bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon',
      dark: 'Dark', steel: 'Steel', fairy: 'Fairy',
    },
  };
  const l = lang.startsWith('en') ? 'en' : 'es';
  return names[l][type.toLowerCase()] ?? type;
}
