import { Favorite } from '../models/Favorite.js';
import * as pokemonTcgService from './pokemonTcgService.js';
import { AppError } from '../middleware/errorHandler.js';

function serializeFavorite(item: InstanceType<typeof Favorite>) {
  return {
    id: item._id.toString(),
    cardId: item.cardId,
    addedAt: item.addedAt,
  };
}

export async function getFavorites(userId: string) {
  const items = await Favorite.find({ userId }).sort({ addedAt: -1 });
  const cardIds = items.map((i) => i.cardId);
  const cards = await pokemonTcgService.getCardsByIds(cardIds);
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  return items.map((item) => ({
    ...serializeFavorite(item),
    card: cardMap.get(item.cardId) ?? null,
  }));
}

export async function addFavorite(userId: string, cardId: string) {
  try {
    await pokemonTcgService.getCardById(cardId);
  } catch {
    throw new AppError(404, 'Carta no encontrada en la API de Pokémon TCG', 'CARD_NOT_FOUND');
  }

  const existing = await Favorite.findOne({ userId, cardId });
  if (existing) return serializeFavorite(existing);

  const item = await Favorite.create({ userId, cardId });
  return serializeFavorite(item);
}

export async function removeFavorite(userId: string, cardId: string) {
  const item = await Favorite.findOneAndDelete({ userId, cardId });
  if (!item) {
    throw new AppError(404, 'Favorito no encontrado', 'NOT_FOUND');
  }
  return serializeFavorite(item);
}
