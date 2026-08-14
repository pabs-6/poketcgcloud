export interface GameEntry {
  slug: string;
  nameEs: string;
  nameEn: string;
  generationId: number;
  pokedexId: number;
  versionGroup: string;
}

export interface GenerationEntry {
  id: number;
  slug: string;
  nameEs: string;
  nameEn: string;
  regionEs: string;
  regionEn: string;
}

export const GENERATIONS: GenerationEntry[] = [
  { id: 1, slug: 'gen1', nameEs: 'Generación I', nameEn: 'Generation I', regionEs: 'Kanto', regionEn: 'Kanto' },
  { id: 2, slug: 'gen2', nameEs: 'Generación II', nameEn: 'Generation II', regionEs: 'Johto', regionEn: 'Johto' },
  { id: 3, slug: 'gen3', nameEs: 'Generación III', nameEn: 'Generation III', regionEs: 'Hoenn', regionEn: 'Hoenn' },
  { id: 4, slug: 'gen4', nameEs: 'Generación IV', nameEn: 'Generation IV', regionEs: 'Sinnoh', regionEn: 'Sinnoh' },
  { id: 5, slug: 'gen5', nameEs: 'Generación V', nameEn: 'Generation V', regionEs: 'Teselia', regionEn: 'Unova' },
  { id: 6, slug: 'gen6', nameEs: 'Generación VI', nameEn: 'Generation VI', regionEs: 'Kalos', regionEn: 'Kalos' },
  { id: 7, slug: 'gen7', nameEs: 'Generación VII', nameEn: 'Generation VII', regionEs: 'Alola', regionEn: 'Alola' },
  { id: 8, slug: 'gen8', nameEs: 'Generación VIII', nameEn: 'Generation VIII', regionEs: 'Galar / Hisui', regionEn: 'Galar / Hisui' },
  { id: 9, slug: 'gen9', nameEs: 'Generación IX', nameEn: 'Generation IX', regionEs: 'Paldea', regionEn: 'Paldea' },
];

export const GAMES: GameEntry[] = [
  { slug: 'red', nameEs: 'Rojo', nameEn: 'Red', generationId: 1, pokedexId: 2, versionGroup: 'red-blue' },
  { slug: 'blue', nameEs: 'Azul', nameEn: 'Blue', generationId: 1, pokedexId: 2, versionGroup: 'red-blue' },
  { slug: 'yellow', nameEs: 'Amarillo', nameEn: 'Yellow', generationId: 1, pokedexId: 2, versionGroup: 'yellow' },
  { slug: 'gold', nameEs: 'Oro', nameEn: 'Gold', generationId: 2, pokedexId: 3, versionGroup: 'gold-silver' },
  { slug: 'silver', nameEs: 'Plata', nameEn: 'Silver', generationId: 2, pokedexId: 3, versionGroup: 'gold-silver' },
  { slug: 'crystal', nameEs: 'Cristal', nameEn: 'Crystal', generationId: 2, pokedexId: 7, versionGroup: 'crystal' },
  { slug: 'ruby', nameEs: 'Rubí', nameEn: 'Ruby', generationId: 3, pokedexId: 4, versionGroup: 'ruby-sapphire' },
  { slug: 'sapphire', nameEs: 'Zafiro', nameEn: 'Sapphire', generationId: 3, pokedexId: 4, versionGroup: 'ruby-sapphire' },
  { slug: 'emerald', nameEs: 'Esmeralda', nameEn: 'Emerald', generationId: 3, pokedexId: 15, versionGroup: 'emerald' },
  { slug: 'diamond', nameEs: 'Diamante', nameEn: 'Diamond', generationId: 4, pokedexId: 5, versionGroup: 'diamond-pearl' },
  { slug: 'pearl', nameEs: 'Perla', nameEn: 'Pearl', generationId: 4, pokedexId: 5, versionGroup: 'diamond-pearl' },
  { slug: 'platinum', nameEs: 'Platino', nameEn: 'Platinum', generationId: 4, pokedexId: 6, versionGroup: 'platinum' },
  { slug: 'black', nameEs: 'Negro', nameEn: 'Black', generationId: 5, pokedexId: 8, versionGroup: 'black-white' },
  { slug: 'white', nameEs: 'Blanco', nameEn: 'White', generationId: 5, pokedexId: 8, versionGroup: 'black-white' },
  { slug: 'x', nameEs: 'X', nameEn: 'X', generationId: 6, pokedexId: 12, versionGroup: 'x-y' },
  { slug: 'y', nameEs: 'Y', nameEn: 'Y', generationId: 6, pokedexId: 12, versionGroup: 'x-y' },
  { slug: 'sun', nameEs: 'Sol', nameEn: 'Sun', generationId: 7, pokedexId: 16, versionGroup: 'sun-moon' },
  { slug: 'moon', nameEs: 'Luna', nameEn: 'Moon', generationId: 7, pokedexId: 16, versionGroup: 'sun-moon' },
  { slug: 'sword', nameEs: 'Espada', nameEn: 'Sword', generationId: 8, pokedexId: 27, versionGroup: 'sword-shield' },
  { slug: 'shield', nameEs: 'Escudo', nameEn: 'Shield', generationId: 8, pokedexId: 27, versionGroup: 'sword-shield' },
  { slug: 'legends-arceus', nameEs: 'Legends Arceus', nameEn: 'Legends Arceus', generationId: 8, pokedexId: 30, versionGroup: 'legends-arceus' },
  { slug: 'scarlet', nameEs: 'Escarlata', nameEn: 'Scarlet', generationId: 9, pokedexId: 31, versionGroup: 'scarlet-violet' },
  { slug: 'violet', nameEs: 'Púrpura', nameEn: 'Violet', generationId: 9, pokedexId: 31, versionGroup: 'scarlet-violet' },
];

export const NATIONAL_POKEDEX_ID = 1;

export function getGameBySlug(slug: string): GameEntry | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getGenerationById(id: number): GenerationEntry | undefined {
  return GENERATIONS.find((g) => g.id === id);
}

export function getGamesByGeneration(generationId: number): GameEntry[] {
  return GAMES.filter((g) => g.generationId === generationId);
}
