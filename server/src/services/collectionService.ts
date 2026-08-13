import { CollectionItem } from '../models/CollectionItem.js';
import * as pokemonTcgService from './pokemonTcgService.js';
import { AppError } from '../middleware/errorHandler.js';
import type { CardCondition } from '../models/CollectionItem.js';

function serializeItem(item: InstanceType<typeof CollectionItem>) {
  return {
    id: item._id.toString(),
    cardId: item.cardId,
    quantity: item.quantity,
    condition: item.condition,
    isFoil: item.isFoil,
    purchasePrice: item.purchasePrice,
    purchaseDate: item.purchaseDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getCollection(userId: string) {
  const items = await CollectionItem.find({ userId }).sort({ updatedAt: -1 });
  const cardIds = items.map((i) => i.cardId);
  const cards = await pokemonTcgService.getCardsByIds(cardIds);
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  return items.map((item) => ({
    ...serializeItem(item),
    card: cardMap.get(item.cardId) ?? null,
  }));
}

export async function addToCollection(
  userId: string,
  data: {
    cardId: string;
    quantity?: number;
    condition?: CardCondition;
    isFoil?: boolean;
    purchasePrice?: number;
    purchaseDate?: Date;
  }
) {
  try {
    await pokemonTcgService.getCardById(data.cardId);
  } catch {
    throw new AppError(404, 'Carta no encontrada en la API de Pokémon TCG', 'CARD_NOT_FOUND');
  }

  const existing = await CollectionItem.findOne({ userId, cardId: data.cardId });
  if (existing) {
    existing.quantity += data.quantity ?? 1;
    if (data.condition) existing.condition = data.condition;
    if (data.isFoil !== undefined) existing.isFoil = data.isFoil;
    if (data.purchasePrice !== undefined) existing.purchasePrice = data.purchasePrice;
    if (data.purchaseDate !== undefined) existing.purchaseDate = data.purchaseDate;
    await existing.save();
    return serializeItem(existing);
  }

  const item = await CollectionItem.create({
    userId,
    cardId: data.cardId,
    quantity: data.quantity ?? 1,
    condition: data.condition ?? 'near_mint',
    isFoil: data.isFoil ?? false,
    purchasePrice: data.purchasePrice,
    purchaseDate: data.purchaseDate,
  });

  return serializeItem(item);
}

export async function updateCollectionItem(
  userId: string,
  itemId: string,
  data: {
    quantity?: number;
    condition?: CardCondition;
    isFoil?: boolean;
    purchasePrice?: number | null;
    purchaseDate?: Date | null;
  }
) {
  const item = await CollectionItem.findOne({ _id: itemId, userId });
  if (!item) {
    throw new AppError(404, 'Carta no encontrada en el álbum', 'NOT_FOUND');
  }

  if (data.quantity !== undefined) item.quantity = data.quantity;
  if (data.condition !== undefined) item.condition = data.condition;
  if (data.isFoil !== undefined) item.isFoil = data.isFoil;
  if (data.purchasePrice !== undefined) item.purchasePrice = data.purchasePrice ?? undefined;
  if (data.purchaseDate !== undefined) item.purchaseDate = data.purchaseDate ?? undefined;

  await item.save();
  return serializeItem(item);
}

export async function removeFromCollection(userId: string, itemId: string) {
  const item = await CollectionItem.findOneAndDelete({ _id: itemId, userId });
  if (!item) {
    throw new AppError(404, 'Carta no encontrada en el álbum', 'NOT_FOUND');
  }
  return serializeItem(item);
}
