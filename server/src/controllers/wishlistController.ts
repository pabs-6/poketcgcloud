import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate.js';
import * as wishlistService from '../services/wishlistService.js';
import { wishlistCreateSchema } from '../validators/collectionValidators.js';

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await wishlistService.getWishlist(req.user!.userId);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = wishlistCreateSchema.parse(req.body);

    if (input.moveToCollection) {
      const item = await wishlistService.moveToCollection(req.user!.userId, input.cardId, {
        quantity: input.quantity,
        condition: input.condition,
        isFoil: input.isFoil,
      });
      res.status(201).json({ success: true, data: { moved: true, collectionItem: item } });
      return;
    }

    const item = await wishlistService.addToWishlist(req.user!.userId, input.cardId);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await wishlistService.removeFromWishlist(req.user!.userId, String(req.params.cardId));
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function moveToCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await wishlistService.moveToCollection(req.user!.userId, String(req.params.cardId));
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}
