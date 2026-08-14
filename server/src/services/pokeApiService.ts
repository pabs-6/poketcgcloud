import { getPokemonCategories } from '../data/pokemonCategories.js';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

async function fetchPokeApi<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const cached = cache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PokeAPI error ${res.status}: ${url}`);
  }
  const data = (await res.json()) as T;
  cache.set(url, { data, expiresAt: Date.now() + CACHE_TTL });
  return data;
}

function extractId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function getLocalizedName(names: Array<{ language: { name: string }; name: string }>, lang: string): string {
  const preferred = lang.startsWith('es') ? 'es' : 'en';
  return names.find((n) => n.language.name === preferred)?.name
    ?? names.find((n) => n.language.name === 'en')?.name
    ?? names[0]?.name
    ?? '';
}

export function getSpriteUrl(speciesId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;
}

export function getShinySpriteUrl(speciesId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${speciesId}.png`;
}

export function getFallbackSpriteUrl(speciesId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`;
}

export function getShinyFallbackSpriteUrl(speciesId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${speciesId}.png`;
}

interface PokeApiPokedex {
  id: number;
  name: string;
  pokemon_entries: Array<{
    entry_number: number;
    pokemon_species: { name: string; url: string };
  }>;
}

interface PokeApiGeneration {
  id: number;
  name: string;
  pokemon_species: Array<{ name: string; url: string }>;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ slot: number; type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string };
      version_group: { name: string };
    }>;
  }>;
  species: { url: string };
}

interface PokeApiSpecies {
  id: number;
  name: string;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  names: Array<{ language: { name: string }; name: string }>;
  genera: Array<{ language: { name: string }; genus: string }>;
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string }; version: { name: string } }>;
  evolution_chain: { url: string };
}

interface PokeApiEvolutionChain {
  chain: EvolutionLink;
}

interface EvolutionLink {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionLink[];
}

interface EvolutionDetail {
  min_level: number | null;
  trigger: { name: string };
  item: { name: string } | null;
  time_of_day: string;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  location: { name: string } | null;
}

interface PokeApiMove {
  id: number;
  name: string;
  names: Array<{ language: { name: string }; name: string }>;
  power: number | null;
  type: { name: string };
  damage_class: { name: string };
}

interface PokeApiNatureList {
  results: Array<{ name: string; url: string }>;
}

interface PokeApiNature {
  id: number;
  name: string;
  names: Array<{ language: { name: string }; name: string }>;
  increased_stat: { name: string } | null;
  decreased_stat: { name: string } | null;
}

export interface PokedexEntryDTO {
  dexNumber: number;
  speciesId: number;
  name: string;
  sprite: string;
  shinySprite: string;
  categories: ReturnType<typeof getPokemonCategories>;
}

function enrichEntry(
  dexNumber: number,
  speciesId: number,
  name: string
): PokedexEntryDTO {
  return {
    dexNumber,
    speciesId,
    name,
    sprite: getSpriteUrl(speciesId),
    shinySprite: getShinySpriteUrl(speciesId),
    categories: getPokemonCategories(speciesId),
  };
}

export async function getPokedexEntries(pokedexId: number, _lang: string): Promise<PokedexEntryDTO[]> {
  const pokedex = await fetchPokeApi<PokeApiPokedex>(`/pokedex/${pokedexId}`);
  return pokedex.pokemon_entries.map((entry) => {
    const speciesId = extractId(entry.pokemon_species.url);
    return enrichEntry(
      entry.entry_number,
      speciesId,
      capitalizeName(entry.pokemon_species.name)
    );
  });
}

export async function getGenerationEntries(generationId: number, _lang: string): Promise<PokedexEntryDTO[]> {
  const generation = await fetchPokeApi<PokeApiGeneration>(`/generation/${generationId}`);
  return generation.pokemon_species.map((species, index) => {
    const speciesId = extractId(species.url);
    return enrichEntry(index + 1, speciesId, capitalizeName(species.name));
  });
}

function capitalizeName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatEvolutionDetail(detail: EvolutionDetail, lang: 'es' | 'en'): string {
  const parts: string[] = [];
  const trigger = detail.trigger?.name ?? 'level-up';

  if (trigger === 'level-up' && detail.min_level) {
    parts.push(lang === 'es' ? `Nivel ${detail.min_level}` : `Level ${detail.min_level}`);
  } else if (trigger === 'use-item' && detail.item) {
    parts.push(lang === 'es' ? `Usar ${detail.item.name.replace(/-/g, ' ')}` : `Use ${detail.item.name.replace(/-/g, ' ')}`);
  } else if (trigger === 'trade') {
    parts.push(lang === 'es' ? 'Intercambio' : 'Trade');
    if (detail.held_item) {
      parts.push(lang === 'es' ? `con ${detail.held_item.name}` : `holding ${detail.held_item.name}`);
    }
  } else if (detail.min_level) {
    parts.push(lang === 'es' ? `Nivel ${detail.min_level}` : `Level ${detail.min_level}`);
  } else {
    parts.push(trigger.replace(/-/g, ' '));
  }

  if (detail.time_of_day) {
    parts.push(lang === 'es' ? `(${detail.time_of_day})` : `(${detail.time_of_day})`);
  }

  return parts.join(' ');
}

async function parseEvolutionChain(link: EvolutionLink, lang: 'es' | 'en'): Promise<Array<{
  speciesId: number;
  name: string;
  sprite: string;
  shinySprite: string;
  evolvesFrom: string | null;
  method: string | null;
}>> {
  const result: Array<{
    speciesId: number;
    name: string;
    sprite: string;
    shinySprite: string;
    evolvesFrom: string | null;
    method: string | null;
  }> = [];

  function walk(node: EvolutionLink, parentName: string | null, method: string | null) {
    const speciesId = extractId(node.species.url);
    result.push({
      speciesId,
      name: capitalizeName(node.species.name),
      sprite: getSpriteUrl(speciesId),
      shinySprite: getShinySpriteUrl(speciesId),
      evolvesFrom: parentName,
      method,
    });
    for (const next of node.evolves_to) {
      const detail = next.evolution_details[0];
      walk(next, capitalizeName(node.species.name), detail ? formatEvolutionDetail(detail, lang) : null);
    }
  }

  walk(link, null, null);
  return result;
}

export async function getPokemonDetail(
  speciesOrId: string | number,
  versionGroup: string | undefined,
  lang: string
) {
  const pokemon = await fetchPokeApi<PokeApiPokemon>(
    typeof speciesOrId === 'number' ? `/pokemon/${speciesOrId}` : `/pokemon/${speciesOrId}`
  );
  const species = await fetchPokeApi<PokeApiSpecies>(pokemon.species.url);
  const evolutionChain = await fetchPokeApi<PokeApiEvolutionChain>(species.evolution_chain.url);
  const localizedName = getLocalizedName(species.names, lang);
  const genus = species.genera.find((g) => g.language.name === (lang.startsWith('es') ? 'es' : 'en'))?.genus
    ?? species.genera.find((g) => g.language.name === 'en')?.genus
    ?? '';

  const flavorLang = lang.startsWith('es') ? 'es' : 'en';
  const flavor = species.flavor_text_entries
    .filter((f) => f.language.name === flavorLang)
    .map((f) => f.flavor_text.replace(/\f|\n/g, ' '))
    .pop() ?? '';

  const types = pokemon.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
  const stats: Record<string, number> = {};
  for (const s of pokemon.stats) {
    stats[s.stat.name] = s.base_stat;
  }

  const abilities = pokemon.abilities.map((a) => ({
    name: capitalizeName(a.ability.name),
    hidden: a.is_hidden,
  }));

  const moveEntries = pokemon.moves.flatMap((m) =>
    m.version_group_details
      .filter((vg) => !versionGroup || vg.version_group.name === versionGroup)
      .map((vg) => ({
        moveName: m.move.name,
        moveUrl: m.move.url,
        level: vg.level_learned_at,
        method: vg.move_learn_method.name,
      }))
  );

  const uniqueMoves = new Map<string, { moveName: string; moveUrl: string; level: number; method: string }>();
  for (const m of moveEntries) {
    const key = `${m.moveName}-${m.method}-${m.level}`;
    uniqueMoves.set(key, m);
  }

  const moveDetails = await Promise.all(
    [...uniqueMoves.values()].slice(0, 80).map(async (m) => {
      try {
        const move = await fetchPokeApi<PokeApiMove>(m.moveUrl);
        return {
          name: getLocalizedName(move.names, lang) || capitalizeName(move.name),
          power: move.power,
          type: move.type.name,
          category: move.damage_class.name,
          level: m.level,
          method: m.method,
        };
      } catch {
        return {
          name: capitalizeName(m.moveName),
          power: null,
          type: 'normal',
          category: 'status',
          level: m.level,
          method: m.method,
        };
      }
    })
  );

  const langCode = lang.startsWith('es') ? 'es' : 'en' as 'es' | 'en';
  const evolution = await parseEvolutionChain(evolutionChain.chain, langCode);
  const categories = getPokemonCategories(species.id, {
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    isBaby: species.is_baby,
  });

  return {
    id: pokemon.id,
    speciesId: species.id,
    name: localizedName || capitalizeName(pokemon.name),
    slug: pokemon.name,
    genus,
    flavorText: flavor,
    sprite: getSpriteUrl(species.id),
    shinySprite: getShinySpriteUrl(species.id),
    types,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    stats,
    abilities,
    moves: moveDetails.sort((a, b) => (b.power ?? 0) - (a.power ?? 0)),
    evolution,
    categories,
  };
}

export async function getNatures(lang: string) {
  const list = await fetchPokeApi<PokeApiNatureList>('/nature?limit=30');
  const natures = await Promise.all(
    list.results.map(async (n) => {
      const detail = await fetchPokeApi<PokeApiNature>(n.url);
      return {
        id: detail.id,
        name: getLocalizedName(detail.names, lang) || capitalizeName(detail.name),
        increasedStat: detail.increased_stat?.name ?? null,
        decreasedStat: detail.decreased_stat?.name ?? null,
      };
    })
  );
  return natures;
}

export async function getSpeciesBasic(speciesId: number, lang: string) {
  const species = await fetchPokeApi<PokeApiSpecies>(`/pokemon-species/${speciesId}`);
  return {
    id: species.id,
    name: getLocalizedName(species.names, lang) || capitalizeName(species.name),
    sprite: getSpriteUrl(species.id),
    shinySprite: getShinySpriteUrl(species.id),
  };
}

export { extractId, getLocalizedName, capitalizeName };
