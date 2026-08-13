import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate.js';
import * as collectionService from '../services/collectionService.js';
import { createCollectionSchema, updateCollectionSchema } from '../validators/collectionValidators.js';

export async function getCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await collectionService.getCollection(req.user!.userId);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function addToCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createCollectionSchema.parse(req.body);
    const item = await collectionService.addToCollection(req.user!.userId, input);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateCollectionItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateCollectionSchema.parse(req.body);
    const item = await collectionService.updateCollectionItem(
      req.user!.userId,
      String(req.params.id),
      input
    );
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function removeFromCollection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await collectionService.removeFromCollection(req.user!.userId, String(req.params.id));
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}
