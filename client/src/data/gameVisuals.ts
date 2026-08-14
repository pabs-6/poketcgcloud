const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export function pokemonArtwork(speciesId: number): string {
  return `${ARTWORK_BASE}/${speciesId}.png`;
}

export interface VisualTheme {
  from: string;
  to: string;
  accent: string;
}

export interface GenerationVisual extends VisualTheme {
  speciesId: number;
  roman: string;
}

export interface GameVisual extends VisualTheme {
  speciesId: number;
}

export const GENERATION_VISUALS: Record<number, GenerationVisual> = {
  1: { roman: 'I', speciesId: 150, from: '#E53935', to: '#B71C1C', accent: '#FF8A80' },
  2: { roman: 'II', speciesId: 249, from: '#FFD54F', to: '#F9A825', accent: '#FFE082' },
  3: { roman: 'III', speciesId: 384, from: '#66BB6A', to: '#2E7D32', accent: '#A5D6A7' },
  4: { roman: 'IV', speciesId: 483, from: '#AB47BC', to: '#6A1B9A', accent: '#CE93D8' },
  5: { roman: 'V', speciesId: 643, from: '#78909C', to: '#37474F', accent: '#B0BEC5' },
  6: { roman: 'VI', speciesId: 716, from: '#EC407A', to: '#AD1457', accent: '#F48FB1' },
  7: { roman: 'VII', speciesId: 785, from: '#FFA726', to: '#EF6C00', accent: '#FFCC80' },
  8: { roman: 'VIII', speciesId: 888, from: '#42A5F5', to: '#1565C0', accent: '#90CAF9' },
  9: { roman: 'IX', speciesId: 906, from: '#8E24AA', to: '#6A1B9A', accent: '#BA68C8' },
};

export const GAME_VISUALS: Record<string, GameVisual> = {
  red: { speciesId: 6, from: '#E3350D', to: '#A01010', accent: '#FF6B6B' },
  blue: { speciesId: 9, from: '#3B4CCA', to: '#1E2875', accent: '#6B7FFF' },
  yellow: { speciesId: 25, from: '#FFCB05', to: '#C7A008', accent: '#FFE566' },
  gold: { speciesId: 157, from: '#DAA520', to: '#8B6914', accent: '#FFD700' },
  silver: { speciesId: 245, from: '#C0C0C0', to: '#707070', accent: '#E8E8E8' },
  crystal: { speciesId: 245, from: '#4FC3F7', to: '#0288D1', accent: '#81D4FA' },
  ruby: { speciesId: 383, from: '#CC0000', to: '#7F0000', accent: '#FF4444' },
  sapphire: { speciesId: 382, from: '#0066CC', to: '#003366', accent: '#4488FF' },
  emerald: { speciesId: 384, from: '#00A86B', to: '#006B44', accent: '#50C878' },
  diamond: { speciesId: 483, from: '#B9F2FF', to: '#4FC3F7', accent: '#E1F5FE' },
  pearl: { speciesId: 484, from: '#FFB7C5', to: '#F48FB1', accent: '#FCE4EC' },
  platinum: { speciesId: 483, from: '#B0BEC5', to: '#546E7A', accent: '#CFD8DC' },
  black: { speciesId: 643, from: '#212121', to: '#000000', accent: '#616161' },
  white: { speciesId: 644, from: '#FAFAFA', to: '#BDBDBD', accent: '#FFFFFF' },
  x: { speciesId: 716, from: '#E91E63', to: '#880E4F', accent: '#F48FB1' },
  y: { speciesId: 717, from: '#E53935', to: '#B71C1C', accent: '#EF9A9A' },
  sun: { speciesId: 785, from: '#FF9800', to: '#E65100', accent: '#FFB74D' },
  moon: { speciesId: 786, from: '#7E57C2', to: '#4527A0', accent: '#B39DDB' },
  sword: { speciesId: 888, from: '#1565C0', to: '#0D47A1', accent: '#64B5F6' },
  shield: { speciesId: 889, from: '#C62828', to: '#8E0000', accent: '#EF5350' },
  'legends-arceus': { speciesId: 493, from: '#5D4037', to: '#3E2723', accent: '#A1887F' },
  scarlet: { speciesId: 1007, from: '#C62828', to: '#8E0000', accent: '#EF5350' },
  violet: { speciesId: 1008, from: '#7B1FA2', to: '#4A148C', accent: '#BA68C8' },
};

export const NATIONAL_DEX_VISUAL: GameVisual = {
  speciesId: 493,
  from: '#37474F',
  to: '#263238',
  accent: '#78909C',
};

export function getGenerationVisual(id: number): GenerationVisual {
  return GENERATION_VISUALS[id] ?? {
    roman: '?',
    speciesId: 25,
    from: '#616161',
    to: '#424242',
    accent: '#9E9E9E',
  };
}

export function getGameVisual(slug: string): GameVisual {
  return GAME_VISUALS[slug] ?? {
    speciesId: 25,
    from: '#616161',
    to: '#424242',
    accent: '#9E9E9E',
  };
}
