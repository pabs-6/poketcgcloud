import { Response, NextFunction, Request } from 'express';
import * as gamesService from '../services/gamesService.js';

export async function getCatalog(req: Request, res: Response, next: NextFunction) {
  try {
    const lang = String(req.query.lang ?? 'es');
    res.json({ success: true, data: gamesService.getCatalog(lang) });
  } catch (error) {
    next(error);
  }
}

export async function getPokedex(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await gamesService.getPokedexList({
      game: req.query.game ? String(req.query.game) : undefined,
      generation: req.query.generation ? String(req.query.generation) : undefined,
      national: req.query.national ? String(req.query.national) : undefined,
      lang: String(req.query.lang ?? 'es'),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPokemon(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await gamesService.getPokemonDetail(
      String(req.params.id),
      req.query.game ? String(req.query.game) : undefined,
      String(req.query.lang ?? 'es')
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getNatures(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await gamesService.getNaturesList(String(req.query.lang ?? 'es'));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getTeamsIndex(req: Request, res: Response, next: NextFunction) {
  try {
    const data = gamesService.getTeamsList(String(req.query.lang ?? 'es'));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getTeamsByGame(req: Request, res: Response, next: NextFunction) {
  try {
    const data = gamesService.getTeamsForGameSlug(String(req.params.gameSlug), String(req.query.lang ?? 'es'));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getTeam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await gamesService.getTeamDetail(String(req.params.id), String(req.query.lang ?? 'es'));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
