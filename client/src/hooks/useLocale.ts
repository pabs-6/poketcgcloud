import { useTranslation } from 'react-i18next';
import type { CardCondition } from '@/types';

export function useConditionLabels(): Record<CardCondition, string> {
  const { t } = useTranslation();
  return {
    mint: t('common.conditions.mint'),
    near_mint: t('common.conditions.near_mint'),
    excellent: t('common.conditions.excellent'),
    good: t('common.conditions.good'),
    played: t('common.conditions.played'),
    poor: t('common.conditions.poor'),
  };
}

export function useFormatDate() {
  const { i18n } = useTranslation();
  return (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString(i18n.language.startsWith('en') ? 'en-US' : 'es-ES');
  };
}

export function useFormatPrice() {
  const { t } = useTranslation();
  return (price?: number) => {
    if (price === undefined || price === 0) return t('common.noPrice');
    return `$${price.toFixed(2)}`;
  };
}
