import i18n from '@/i18n';

const MESSAGE_TO_CODE: Record<string, string> = {
  'Request failed': 'REQUEST_FAILED',
  'Internal server error': 'INTERNAL_ERROR',
  'Route not found': 'ROUTE_NOT_FOUND',
  'Validation error': 'VALIDATION_ERROR',
  'Email already registered': 'EMAIL_EXISTS',
  'Invalid credentials': 'INVALID_CREDENTIALS',
  'This account uses Google Sign-In': 'USE_GOOGLE',
  'Google Sign-In is not configured': 'GOOGLE_NOT_CONFIGURED',
  'Invalid Google token': 'INVALID_GOOGLE_TOKEN',
  'Authentication required': 'UNAUTHORIZED',
  'Invalid or expired token': 'INVALID_TOKEN',
  'Too many attempts': 'RATE_LIMIT',
  'User not found': 'USER_NOT_FOUND',
  'Card not found': 'CARD_NOT_FOUND',
  'Card not found in Pokémon TCG API': 'POKEMON_CARD_NOT_FOUND',
  'Collection item not found': 'COLLECTION_ITEM_NOT_FOUND',
  'Wishlist item not found': 'WISHLIST_ITEM_NOT_FOUND',
  'Favorite not found': 'FAVORITE_NOT_FOUND',
};

export function translateErrorMessage(message: string, code?: string): string {
  const key = code ?? MESSAGE_TO_CODE[message];
  if (key) {
    const translated = i18n.t(`errors.${key}`);
    if (translated !== `errors.${key}`) return translated;
  }
  return message;
}
