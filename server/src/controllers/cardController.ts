import { Response, NextFunction } from 'express';
import * as pokemonTcgService from '../services/pokemonTcgService.js';
import { cardSearchSchema } from '../validators/collectionValidators.js';

export async function searchCards(req: import('express').Request, res: Response, next: NextFunction) {
  try {
    const params = cardSearchSchema.parse(req.query);
    const result = await pokemonTcgService.searchCards(params);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getCardById(req: import('express').Request, res: Response, next: NextFunction) {
  try {
    const card = await pokemonTcgService.getCardById(String(req.params.id));
    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function getSets(_req: import('express').Request, res: Response, next: NextFunction) {
  try {
    const sets = await pokemonTcgService.getSets();
    res.json({ success: true, data: sets });
  } catch (error) {
    next(error);
  }
}
