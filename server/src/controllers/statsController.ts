import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate.js';
import * as statsService from '../services/statsService.js';

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await statsService.getStats(req.user!.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}
