import { WishlistItem } from '../models/WishlistItem.js';
import * as pokemonTcgService from './pokemonTcgService.js';
import * as collectionService from './collectionService.js';
import { AppError } from '../middleware/errorHandler.js';
import type { CardCondition } from '../models/CollectionItem.js';

function serializeItem(item: InstanceType<typeof WishlistItem>) {
  return {
    id: item._id.toString(),
    cardId: item.cardId,
    addedAt: item.addedAt,
  };
}

export async function getWishlist(userId: string) {
  const items = await WishlistItem.find({ userId }).sort({ addedAt: -1 });
  const cardIds = items.map((i) => i.cardId);
  const cards = await pokemonTcgService.getCardsByIds(cardIds);
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  return items.map((item) => ({
    ...serializeItem(item),
    card: cardMap.get(item.cardId) ?? null,
  }));
}

export async function addToWishlist(userId: string, cardId: string) {
  try {
    await pokemonTcgService.getCardById(cardId);
  } catch {
    throw new AppError(404, 'Carta no encontrada en la API de Pokémon TCG', 'CARD_NOT_FOUND');
  }

  const existing = await WishlistItem.findOne({ userId, cardId });
  if (existing) return serializeItem(existing);

  const item = await WishlistItem.create({ userId, cardId });
  return serializeItem(item);
}

export async function removeFromWishlist(userId: string, cardId: string) {
  const item = await WishlistItem.findOneAndDelete({ userId, cardId });
  if (!item) {
    throw new AppError(404, 'Carta no encontrada en la wishlist', 'NOT_FOUND');
  }
  return serializeItem(item);
}

export async function moveToCollection(
  userId: string,
  cardId: string,
  options?: { quantity?: number; condition?: CardCondition; isFoil?: boolean }
) {
  const wishlistItem = await WishlistItem.findOne({ userId, cardId });
  if (!wishlistItem) {
    throw new AppError(404, 'Carta no encontrada en la wishlist', 'NOT_FOUND');
  }

  const collectionItem = await collectionService.addToCollection(userId, {
    cardId,
    quantity: options?.quantity ?? 1,
    condition: options?.condition,
    isFoil: options?.isFoil,
  });

  await WishlistItem.deleteOne({ _id: wishlistItem._id });

  return collectionItem;
}
