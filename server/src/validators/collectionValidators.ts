import { z } from 'zod';
import { CARD_CONDITIONS } from '../models/CollectionItem.js';

export const createCollectionSchema = z.object({
  cardId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  condition: z.enum(CARD_CONDITIONS).default('near_mint'),
  isFoil: z.boolean().default(false),
  purchasePrice: z.number().min(0).optional(),
  purchaseDate: z.coerce.date().optional(),
});

export const updateCollectionSchema = z.object({
  quantity: z.number().int().min(1).optional(),
  condition: z.enum(CARD_CONDITIONS).optional(),
  isFoil: z.boolean().optional(),
  purchasePrice: z.number().min(0).nullable().optional(),
  purchaseDate: z.coerce.date().nullable().optional(),
});

export const cardIdSchema = z.object({
  cardId: z.string().min(1),
});

export const wishlistCreateSchema = z.object({
  cardId: z.string().min(1),
  moveToCollection: z.boolean().optional(),
  quantity: z.number().int().min(1).optional(),
  condition: z.enum(CARD_CONDITIONS).optional(),
  isFoil: z.boolean().optional(),
});

export const cardSearchSchema = z.object({
  q: z.string().optional(),
  name: z.string().optional(),
  set: z.string().optional(),
  rarity: z.string().optional(),
  type: z.string().optional(),
  hpMin: z.coerce.number().optional(),
  hpMax: z.coerce.number().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  orderBy: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(250).default(20),
});

export type CardSearchInput = z.infer<typeof cardSearchSchema>;
