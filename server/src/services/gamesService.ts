import {
  GENERATIONS,
  GAMES,
  NATIONAL_POKEDEX_ID,
  getGameBySlug,
  getGenerationById,
  getGamesByGeneration,
} from '../data/gamesCatalog.js';
import {
  getTeamsForGame,
  getTeamById,
  getGamesWithTeams,
} from '../data/teamsData.js';
import {
  computeTypeMatchups,
  suggestNatures,
  STAT_NAMES,
} from '../data/typeChart.js';
import * as pokeApi from './pokeApiService.js';
import { AppError } from '../middleware/errorHandler.js';

function parseLang(lang?: string): 'es' | 'en' {
  return lang?.startsWith('en') ? 'en' : 'es';
}

export function getCatalog(lang?: string) {
  const l = parseLang(lang);
  return {
    generations: GENERATIONS.map((g) => ({
      id: g.id,
      slug: g.slug,
      name: l === 'es' ? g.nameEs : g.nameEn,
      region: l === 'es' ? g.regionEs : g.regionEn,
      games: getGamesByGeneration(g.id).map((game) => ({
        slug: game.slug,
        name: l === 'es' ? game.nameEs : game.nameEn,
        hasTeams: getGamesWithTeams().includes(game.slug),
      })),
    })),
    games: GAMES.map((g) => ({
      slug: g.slug,
      name: l === 'es' ? g.nameEs : g.nameEn,
      generationId: g.generationId,
      hasTeams: getGamesWithTeams().includes(g.slug),
    })),
    gamesWithTeams: getGamesWithTeams(),
  };
}

export async function getPokedexList(params: {
  game?: string;
  generation?: string;
  national?: string;
  lang?: string;
}) {
  const lang = params.lang ?? 'es';
  let entries;
  let title: string;
  let context: { type: string; slug: string; versionGroup?: string };

  if (params.national === 'true') {
    entries = await pokeApi.getPokedexEntries(NATIONAL_POKEDEX_ID, lang);
    title = lang.startsWith('en') ? 'National Pokédex' : 'Pokédex Nacional';
    context = { type: 'national', slug: 'national' };
  } else if (params.game) {
    const game = getGameBySlug(params.game);
    if (!game) throw new AppError(404, 'Juego no encontrado', 'GAME_NOT_FOUND');
    entries = await pokeApi.getPokedexEntries(game.pokedexId, lang);
    title = lang.startsWith('en') ? `${game.nameEn} Pokédex` : `Pokédex ${game.nameEs}`;
    context = { type: 'game', slug: game.slug, versionGroup: game.versionGroup };
  } else if (params.generation) {
    const genId = Number(params.generation);
    const gen = getGenerationById(genId);
    if (!gen) throw new AppError(404, 'Generación no encontrada', 'GENERATION_NOT_FOUND');
    entries = await pokeApi.getGenerationEntries(genId, lang);
    title = lang.startsWith('en') ? gen.nameEn : gen.nameEs;
    context = { type: 'generation', slug: gen.slug };
  } else {
    throw new AppError(400, 'Indica game, generation o national=true', 'INVALID_POKEDEX_QUERY');
  }

  return { title, context, count: entries.length, entries };
}

export async function getPokemonDetail(id: string, game?: string, lang?: string) {
  const l = parseLang(lang);
  let versionGroup: string | undefined;
  if (game) {
    const gameEntry = getGameBySlug(game);
    versionGroup = gameEntry?.versionGroup;
  }

  const detail = await pokeApi.getPokemonDetail(id, versionGroup, lang ?? 'es');
  const matchups = computeTypeMatchups(detail.types);
  const natureSuggestions = suggestNatures(detail.stats, l);

  const pokemonTypes = new Set(detail.types);
  const highlightedMoves = detail.moves
    .filter((m) => m.power && m.power >= 60)
    .sort((a, b) => {
      const aStab = pokemonTypes.has(a.type) ? 1 : 0;
      const bStab = pokemonTypes.has(b.type) ? 1 : 0;
      if (aStab !== bStab) return bStab - aStab;
      return (b.power ?? 0) - (a.power ?? 0);
    })
    .slice(0, 8);

  const statsLocalized = Object.entries(detail.stats).map(([key, value]) => ({
    key,
    label: STAT_NAMES[key]?.[l] ?? key,
    value,
  }));

  return {
    ...detail,
    matchups,
    natureSuggestions,
    highlightedMoves,
    statsLocalized,
    versionGroup,
  };
}

export async function getNaturesList(lang?: string) {
  return pokeApi.getNatures(lang ?? 'es');
}

export function getTeamsList(lang?: string) {
  const l = parseLang(lang);
  const gameSlugs = getGamesWithTeams();
  return gameSlugs.map((slug) => {
    const game = getGameBySlug(slug)!;
    const teams = getTeamsForGame(slug);
    return {
      gameSlug: slug,
      gameName: l === 'es' ? game.nameEs : game.nameEn,
      generationId: game.generationId,
      teamCount: teams.length,
    };
  });
}

export async function getTeamDetail(teamId: string, lang?: string) {
  const l = parseLang(lang);
  const team = getTeamById(teamId);
  if (!team) throw new AppError(404, 'Equipo no encontrado', 'TEAM_NOT_FOUND');

  const game = getGameBySlug(team.gameSlug)!;
  const members = await Promise.all(
    team.members.map(async (member) => {
      const species = await pokeApi.getSpeciesBasic(member.speciesId, lang ?? 'es');
      return {
        ...species,
        role: l === 'es' ? member.roleEs : member.roleEn,
        nature: l === 'es' ? member.natureEs : member.natureEn,
        moves: l === 'es' ? member.movesEs : member.movesEn,
      };
    })
  );

  return {
    id: team.id,
    gameSlug: team.gameSlug,
    gameName: l === 'es' ? game.nameEs : game.nameEn,
    name: l === 'es' ? team.nameEs : team.nameEn,
    description: l === 'es' ? team.descriptionEs : team.descriptionEn,
    members,
  };
}

export function getTeamsForGameSlug(gameSlug: string, lang?: string) {
  const l = parseLang(lang);
  const game = getGameBySlug(gameSlug);
  if (!game) throw new AppError(404, 'Juego no encontrado', 'GAME_NOT_FOUND');

  return getTeamsForGame(gameSlug).map((team) => ({
    id: team.id,
    name: l === 'es' ? team.nameEs : team.nameEn,
    description: l === 'es' ? team.descriptionEs : team.descriptionEn,
    memberCount: team.members.length,
  }));
}
