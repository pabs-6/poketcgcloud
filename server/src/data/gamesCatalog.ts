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
  { id: 8, slug: 'gen8', nameEs: 'Generación VIII', nameEn: 'Generation VIII', regionEs: 'Galar', regionEn: 'Galar' },
  { id: 9, slug: 'gen9', nameEs: 'Generación IX', nameEn: 'Generation IX', regionEs: 'Paldea', regionEn: 'Paldea' },
];

export const GAMES: GameEntry[] = [
  // Gen I — Kanto
  { slug: 'red', nameEs: 'Rojo', nameEn: 'Red', generationId: 1, pokedexId: 2, versionGroup: 'red-blue' },
  { slug: 'blue', nameEs: 'Azul', nameEn: 'Blue', generationId: 1, pokedexId: 2, versionGroup: 'red-blue' },
  { slug: 'yellow', nameEs: 'Amarillo', nameEn: 'Yellow', generationId: 1, pokedexId: 2, versionGroup: 'yellow' },
  { slug: 'firered', nameEs: 'Rojo Fuego', nameEn: 'FireRed', generationId: 1, pokedexId: 2, versionGroup: 'firered-leafgreen' },
  { slug: 'leafgreen', nameEs: 'Verde Hoja', nameEn: 'LeafGreen', generationId: 1, pokedexId: 2, versionGroup: 'firered-leafgreen' },
  { slug: 'lets-go-pikachu', nameEs: "Let's Go, Pikachu", nameEn: "Let's Go, Pikachu", generationId: 1, pokedexId: 26, versionGroup: 'lets-go-pikachu-lets-go-eevee' },
  { slug: 'lets-go-eevee', nameEs: "Let's Go, Eevee", nameEn: "Let's Go, Eevee", generationId: 1, pokedexId: 26, versionGroup: 'lets-go-pikachu-lets-go-eevee' },
  // Gen II — Johto
  { slug: 'gold', nameEs: 'Oro', nameEn: 'Gold', generationId: 2, pokedexId: 3, versionGroup: 'gold-silver' },
  { slug: 'silver', nameEs: 'Plata', nameEn: 'Silver', generationId: 2, pokedexId: 3, versionGroup: 'gold-silver' },
  { slug: 'crystal', nameEs: 'Cristal', nameEn: 'Crystal', generationId: 2, pokedexId: 7, versionGroup: 'crystal' },
  { slug: 'heartgold', nameEs: 'HeartGold', nameEn: 'HeartGold', generationId: 2, pokedexId: 7, versionGroup: 'heartgold-soulsilver' },
  { slug: 'soulsilver', nameEs: 'SoulSilver', nameEn: 'SoulSilver', generationId: 2, pokedexId: 7, versionGroup: 'heartgold-soulsilver' },
  // Gen III — Hoenn
  { slug: 'ruby', nameEs: 'Rubí', nameEn: 'Ruby', generationId: 3, pokedexId: 4, versionGroup: 'ruby-sapphire' },
  { slug: 'sapphire', nameEs: 'Zafiro', nameEn: 'Sapphire', generationId: 3, pokedexId: 4, versionGroup: 'ruby-sapphire' },
  { slug: 'emerald', nameEs: 'Esmeralda', nameEn: 'Emerald', generationId: 3, pokedexId: 15, versionGroup: 'emerald' },
  { slug: 'omega-ruby', nameEs: 'Rubí Omega', nameEn: 'Omega Ruby', generationId: 3, pokedexId: 15, versionGroup: 'omega-ruby-alpha-sapphire' },
  { slug: 'alpha-sapphire', nameEs: 'Zafiro Alpha', nameEn: 'Alpha Sapphire', generationId: 3, pokedexId: 15, versionGroup: 'omega-ruby-alpha-sapphire' },
  // Gen IV — Sinnoh
  { slug: 'diamond', nameEs: 'Diamante', nameEn: 'Diamond', generationId: 4, pokedexId: 5, versionGroup: 'diamond-pearl' },
  { slug: 'pearl', nameEs: 'Perla', nameEn: 'Pearl', generationId: 4, pokedexId: 5, versionGroup: 'diamond-pearl' },
  { slug: 'platinum', nameEs: 'Platino', nameEn: 'Platinum', generationId: 4, pokedexId: 6, versionGroup: 'platinum' },
  { slug: 'brilliant-diamond', nameEs: 'Diamante Brillante', nameEn: 'Brilliant Diamond', generationId: 4, pokedexId: 6, versionGroup: 'brilliant-diamond-shining-pearl' },
  { slug: 'shining-pearl', nameEs: 'Perla Reluciente', nameEn: 'Shining Pearl', generationId: 4, pokedexId: 6, versionGroup: 'brilliant-diamond-shining-pearl' },
  { slug: 'legends-arceus', nameEs: 'Legends Arceus', nameEn: 'Legends Arceus', generationId: 4, pokedexId: 30, versionGroup: 'legends-arceus' },
  // Gen V — Unova
  { slug: 'black', nameEs: 'Negro', nameEn: 'Black', generationId: 5, pokedexId: 8, versionGroup: 'black-white' },
  { slug: 'white', nameEs: 'Blanco', nameEn: 'White', generationId: 5, pokedexId: 8, versionGroup: 'black-white' },
  { slug: 'black-2', nameEs: 'Negro 2', nameEn: 'Black 2', generationId: 5, pokedexId: 9, versionGroup: 'black-2-white-2' },
  { slug: 'white-2', nameEs: 'Blanco 2', nameEn: 'White 2', generationId: 5, pokedexId: 9, versionGroup: 'black-2-white-2' },
  // Gen VI — Kalos
  { slug: 'x', nameEs: 'X', nameEn: 'X', generationId: 6, pokedexId: 12, versionGroup: 'x-y' },
  { slug: 'y', nameEs: 'Y', nameEn: 'Y', generationId: 6, pokedexId: 12, versionGroup: 'x-y' },
  { slug: 'legends-za', nameEs: 'Legends Z-A', nameEn: 'Legends Z-A', generationId: 6, pokedexId: 34, versionGroup: 'legends-za' },
  // Gen VII — Alola
  { slug: 'sun', nameEs: 'Sol', nameEn: 'Sun', generationId: 7, pokedexId: 16, versionGroup: 'sun-moon' },
  { slug: 'moon', nameEs: 'Luna', nameEn: 'Moon', generationId: 7, pokedexId: 16, versionGroup: 'sun-moon' },
  { slug: 'ultra-sun', nameEs: 'Ultra Sol', nameEn: 'Ultra Sun', generationId: 7, pokedexId: 21, versionGroup: 'ultra-sun-ultra-moon' },
  { slug: 'ultra-moon', nameEs: 'Ultra Luna', nameEn: 'Ultra Moon', generationId: 7, pokedexId: 21, versionGroup: 'ultra-sun-ultra-moon' },
  // Gen VIII — Galar
  { slug: 'sword', nameEs: 'Espada', nameEn: 'Sword', generationId: 8, pokedexId: 27, versionGroup: 'sword-shield' },
  { slug: 'shield', nameEs: 'Escudo', nameEn: 'Shield', generationId: 8, pokedexId: 27, versionGroup: 'sword-shield' },
  // Gen IX — Paldea
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
