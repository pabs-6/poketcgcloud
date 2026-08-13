import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate.js';
import * as authService from '../services/authService.js';
import { registerSchema, loginSchema, googleLoginSchema, updateProfileSchema } from '../validators/authValidators.js';

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function googleLogin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = googleLoginSchema.parse(req.body);
    const result = await authService.googleLogin(input.credential);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateProfileSchema.parse(req.body);
    const user = await authService.updateProfile(req.user!.userId, input);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
