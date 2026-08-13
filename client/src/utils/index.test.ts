import { describe, it, expect } from 'vitest';
import { cn, formatPrice, CONDITION_LABELS } from './index';

describe('utils', () => {
  it('cn merges classes', () => {
    expect(cn('a', false, 'b')).toBe('a b');
  });

  it('formatPrice formats numbers', () => {
    expect(formatPrice(10.5)).toBe('$10.50');
    expect(formatPrice(undefined)).toBe('N/D');
  });

  it('CONDITION_LABELS has entries', () => {
    expect(CONDITION_LABELS.mint).toBe('Perfecta (Mint)');
  });
});
