import { CollectionItem } from '../models/CollectionItem.js';
import * as pokemonTcgService from './pokemonTcgService.js';

export async function getStats(userId: string) {
  const items = await CollectionItem.find({ userId });
  const cardIds = items.map((i) => i.cardId);
  const cards = await pokemonTcgService.getCardsByIds(cardIds);
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  let totalCards = 0;
  let estimatedValue = 0;
  const byRarity: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const bySet: Record<string, { setId: string; setName: string; owned: Set<string> }> = {};

  for (const item of items) {
    totalCards += item.quantity;
    const card = cardMap.get(item.cardId);
    if (!card) continue;

    const price = pokemonTcgService.getMarketPrice(card);
    estimatedValue += price * item.quantity;

    const rarity = card.rarity ?? 'Unknown';
    byRarity[rarity] = (byRarity[rarity] ?? 0) + item.quantity;

    const types = card.types ?? ['Unknown'];
    for (const type of types) {
      byType[type] = (byType[type] ?? 0) + item.quantity;
    }

    const setId = card.set.id;
    if (!bySet[setId]) {
      bySet[setId] = { setId, setName: card.set.name, owned: new Set() };
    }
    bySet[setId].owned.add(item.cardId);
  }

  const setProgress = await Promise.all(
    Object.values(bySet).map(async (set) => {
      const totalInSet = await pokemonTcgService.getSetCardCount(set.setId);
      const ownedCount = set.owned.size;
      const percentage = totalInSet > 0 ? Math.round((ownedCount / totalInSet) * 100) : 0;
      return {
        setId: set.setId,
        setName: set.setName,
        owned: ownedCount,
        total: totalInSet,
        percentage,
      };
    })
  );

  setProgress.sort((a, b) => b.percentage - a.percentage);

  const recentItems = await CollectionItem.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  const recentCardIds = recentItems.map((i) => i.cardId);
  const recentCards = await pokemonTcgService.getCardsByIds(recentCardIds);
  const recentCardMap = new Map(recentCards.map((c) => [c.id, c]));

  const recentCardsAdded = recentItems.map((item) => ({
    id: item._id.toString(),
    cardId: item.cardId,
    quantity: item.quantity,
    createdAt: item.createdAt,
    card: recentCardMap.get(item.cardId) ?? null,
  }));

  return {
    totalCards,
    estimatedValue: Math.round(estimatedValue * 100) / 100,
    byRarity: Object.entries(byRarity).map(([name, count]) => ({ name, count })),
    byType: Object.entries(byType).map(([name, count]) => ({ name, count })),
    setProgress,
    recentCardsAdded,
  };
}
