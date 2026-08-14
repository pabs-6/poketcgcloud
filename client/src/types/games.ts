export interface GamesCatalog {
  generations: Array<{
    id: number;
    slug: string;
    name: string;
    region: string;
    games: Array<{
      slug: string;
      name: string;
      hasTeams: boolean;
    }>;
  }>;
  games: Array<{
    slug: string;
    name: string;
    generationId: number;
    hasTeams: boolean;
  }>;
  gamesWithTeams: string[];
}

export interface PokedexEntry {
  dexNumber: number;
  speciesId: number;
  name: string;
  sprite: string;
  shinySprite: string;
  categories: PokemonCategory[];
}

export type PokemonCategory =
  | 'legendary'
  | 'mythical'
  | 'pseudo-legendary'
  | 'ultra-beast'
  | 'paradox'
  | 'baby';

export interface PokedexListResult {
  title: string;
  context: { type: string; slug: string; versionGroup?: string };
  count: number;
  entries: PokedexEntry[];
}

export interface PokemonEvolution {
  speciesId: number;
  name: string;
  sprite: string;
  shinySprite: string;
  evolvesFrom: string | null;
  method: string | null;
}

export interface PokemonMove {
  name: string;
  power: number | null;
  type: string;
  category: string;
  level: number;
  method: string;
}

export interface PokemonDetail {
  id: number;
  speciesId: number;
  name: string;
  slug: string;
  genus: string;
  flavorText: string;
  sprite: string;
  shinySprite: string;
  types: string[];
  height: number;
  weight: number;
  stats: Record<string, number>;
  statsLocalized: Array<{ key: string; label: string; value: number }>;
  abilities: Array<{ name: string; hidden: boolean }>;
  moves: PokemonMove[];
  evolution: PokemonEvolution[];
  matchups: {
    strongAgainst: string[];
    weakTo: string[];
    resistantTo: string[];
    immuneTo: string[];
  };
  natureSuggestions: Array<{ name: string; reason: string }>;
  highlightedMoves: PokemonMove[];
  versionGroup?: string;
  categories: PokemonCategory[];
}

export interface NatureInfo {
  id: number;
  name: string;
  increasedStat: string | null;
  decreasedStat: string | null;
}

export interface TeamSummary {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export interface TeamGameSummary {
  gameSlug: string;
  gameName: string;
  generationId: number;
  teamCount: number;
}

export interface TeamMemberDetail {
  id: number;
  name: string;
  sprite: string;
  shinySprite: string;
  role: string;
  nature: string;
  moves: string[];
}

export interface TeamDetail {
  id: string;
  gameSlug: string;
  gameName: string;
  name: string;
  description: string;
  members: TeamMemberDetail[];
}
