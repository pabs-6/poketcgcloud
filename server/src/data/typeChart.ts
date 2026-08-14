/** Efectividad ofensiva: tipo atacante → tipos que reciben x2 */
export const TYPE_OFFENSIVE: Record<string, string[]> = {
  normal: [''],
  fire: ['grass', 'ice', 'bug', 'steel'],
  water: ['fire', 'ground', 'rock'],
  electric: ['water', 'flying'],
  grass: ['water', 'ground', 'rock'],
  ice: ['grass', 'ground', 'flying', 'dragon'],
  fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison: ['grass', 'fairy'],
  ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'poison'],
  bug: ['grass', 'psychic', 'dark'],
  rock: ['fire', 'ice', 'flying', 'bug'],
  ghost: ['psychic', 'ghost'],
  dragon: ['dragon'],
  dark: ['psychic', 'ghost'],
  steel: ['ice', 'rock', 'fairy'],
  fairy: ['fighting', 'dragon', 'dark'],
};

/** Efectividad defensiva: tipo defensor → tipos que le hacen x2 */
export const TYPE_DEFENSIVE_WEAK: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel'],
};

export const TYPE_DEFENSIVE_RESIST: Record<string, string[]> = {
  normal: [],
  fire: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
  water: ['fire', 'water', 'ice', 'steel'],
  electric: ['electric', 'flying', 'steel'],
  grass: ['water', 'electric', 'grass', 'ground'],
  ice: ['ice'],
  fighting: ['rock', 'bug', 'dark'],
  poison: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
  ground: ['poison', 'rock'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'psychic'],
  bug: ['grass', 'fighting', 'ground'],
  rock: ['normal', 'fire', 'poison', 'flying'],
  ghost: ['poison', 'bug'],
  dragon: ['fire', 'water', 'electric', 'grass'],
  dark: ['ghost', 'dark'],
  steel: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
  fairy: ['fighting', 'bug', 'dark'],
};

export const TYPE_DEFENSIVE_IMMUNE: Record<string, string[]> = {
  normal: ['ghost'],
  ground: ['electric'],
  flying: ['ground'],
  ghost: ['normal', 'fighting'],
  steel: ['poison'],
  fairy: ['dragon'],
};

export const STAT_NAMES: Record<string, { es: string; en: string }> = {
  hp: { es: 'PS', en: 'HP' },
  attack: { es: 'Ataque', en: 'Attack' },
  defense: { es: 'Defensa', en: 'Defense' },
  'special-attack': { es: 'At. Esp.', en: 'Sp. Atk' },
  'special-defense': { es: 'Def. Esp.', en: 'Sp. Def' },
  speed: { es: 'Velocidad', en: 'Speed' },
};

export const EVOLUTION_TRIGGER_ES: Record<string, string> = {
  'level-up': 'Subir de nivel',
  trade: 'Intercambio',
  'use-item': 'Usar objeto',
  'shed': 'Evolución especial',
  spin: 'Girar',
  'tower-of-darkness': 'Torre de la Oscuridad',
  'tower-of-waters': 'Torre del Agua',
  'three-critical-hits': '3 golpes críticos',
  'take-damage': 'Recibir daño',
  'other': 'Condición especial',
};

export const EVOLUTION_TRIGGER_EN: Record<string, string> = {
  'level-up': 'Level up',
  trade: 'Trade',
  'use-item': 'Use item',
  'shed': 'Special evolution',
  spin: 'Spin',
  'tower-of-darkness': 'Tower of Darkness',
  'tower-of-waters': 'Tower of Waters',
  'three-critical-hits': '3 critical hits',
  'take-damage': 'Take damage',
  'other': 'Special condition',
};

export const ITEM_NAMES_ES: Record<string, string> = {
  'fire-stone': 'Piedra Fuego',
  'water-stone': 'Piedra Agua',
  'thunder-stone': 'Piedra Trueno',
  'leaf-stone': 'Piedra Hoja',
  'moon-stone': 'Piedra Lunar',
  'sun-stone': 'Piedra Solar',
  'shiny-stone': 'Piedra Día',
  'dusk-stone': 'Piedra Noche',
  'dawn-stone': 'Piedra Alba',
  'ice-stone': 'Piedra Hielo',
  'dragon-scale': 'Escama Dragón',
  'kings-rock': 'Roca del Rey',
  'metal-coat': 'Revest. Metálico',
  'upgrade': 'Mejora',
  'protector': 'Protector',
  'electirizer': 'Electrizador',
  'magmarizer': 'Magmatizador',
  'reaper-cloth': 'Tela Terrible',
  'prism-scale': 'Escama Bella',
  'oval-stone': 'Piedra Oval',
  'razor-claw': 'Garra Afilada',
  'razor-fang': 'Colmillo Agudo',
  'deep-sea-tooth': 'Diente Marino',
  'deep-sea-scale': 'Escama Marina',
  'dubious-disc': 'Disco Extraño',
  'sachet': 'Saquito Fragancia',
  'whipped-dream': 'Nata Montada',
  'sweet-apple': 'Manzana Dulce',
  'tart-apple': 'Manzana Ácida',
  'cracked-pot': 'Tetera Agrietada',
  'chipped-pot': 'Tetera Rota',
  'galarica-cuff': 'Brazalete Galanuez',
  'galarica-wreath': 'Corona Galanuez',
  'auspicious-armor': 'Armadura Auspicia',
  'malicious-armor': 'Armadura Maldita',
  'black-augurite': 'Augita Negra',
  'peat-block': 'Bloque Turba',
  'linking-cord': 'Cordón Unión',
};

export function computeTypeMatchups(types: string[]) {
  const strongAgainst = new Set<string>();
  const weakTo = new Set<string>();
  const resistantTo = new Set<string>();
  const immuneTo = new Set<string>();

  for (const type of types) {
    for (const t of TYPE_OFFENSIVE[type] ?? []) {
      if (t) strongAgainst.add(t);
    }
    for (const t of TYPE_DEFENSIVE_WEAK[type] ?? []) weakTo.add(t);
    for (const t of TYPE_DEFENSIVE_RESIST[type] ?? []) resistantTo.add(t);
    for (const t of TYPE_DEFENSIVE_IMMUNE[type] ?? []) immuneTo.add(t);
  }

  return {
    strongAgainst: [...strongAgainst].sort(),
    weakTo: [...weakTo].sort(),
    resistantTo: [...resistantTo].sort(),
    immuneTo: [...immuneTo].sort(),
  };
}

export function suggestNatures(stats: Record<string, number>, lang: 'es' | 'en') {
  const attack = stats.attack ?? 0;
  const spAttack = stats['special-attack'] ?? 0;
  const defense = stats.defense ?? 0;
  const spDefense = stats['special-defense'] ?? 0;
  const speed = stats.speed ?? 0;

  const suggestions: Array<{ name: string; reason: string }> = [];

  if (spAttack >= attack && spAttack >= speed) {
    suggestions.push({
      name: lang === 'es' ? 'Modesta' : 'Modest',
      reason: lang === 'es' ? 'Potencia el At. Especial' : 'Boosts Special Attack',
    });
  }
  if (attack >= spAttack && attack >= speed) {
    suggestions.push({
      name: lang === 'es' ? 'Adamante' : 'Adamant',
      reason: lang === 'es' ? 'Potencia el Ataque físico' : 'Boosts physical Attack',
    });
  }
  if (speed >= attack && speed >= spAttack) {
    suggestions.push({
      name: lang === 'es' ? 'Jovial' : 'Jolly',
      reason: lang === 'es' ? 'Potencia la Velocidad' : 'Boosts Speed',
    });
  }
  if (defense >= spDefense) {
    suggestions.push({
      name: lang === 'es' ? 'Relajada' : 'Relaxed',
      reason: lang === 'es' ? 'Potencia la Defensa' : 'Boosts Defense',
    });
  }
  if (spDefense >= defense) {
    suggestions.push({
      name: lang === 'es' ? 'Cuidadosa' : 'Careful',
      reason: lang === 'es' ? 'Potencia la Def. Especial' : 'Boosts Special Defense',
    });
  }

  return suggestions.slice(0, 3);
}
