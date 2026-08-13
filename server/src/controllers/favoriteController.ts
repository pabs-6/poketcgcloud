import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate.js';
import * as favoriteService from '../services/favoriteService.js';
import { cardIdSchema } from '../validators/collectionValidators.js';

export async function getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await favoriteService.getFavorites(req.user!.userId);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { cardId } = cardIdSchema.parse(req.body);
    const item = await favoriteService.addFavorite(req.user!.userId, cardId);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await favoriteService.removeFavorite(req.user!.userId, String(req.params.cardId));
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}
