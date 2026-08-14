import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const toggle = () => {
    void i18n.changeLanguage(isEn ? 'es' : 'en');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={t('nav.languageSwitch')}
      aria-label={t('nav.languageSwitch')}
      className="inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-poke-gray-500 hover:bg-poke-gray-100 hover:text-poke-red dark:hover:bg-poke-gray-800 transition-colors min-h-[44px] min-w-[44px]"
    >
      <span className={!isEn ? 'text-poke-red' : ''}>ES</span>
      <span className="text-poke-gray-300 dark:text-poke-gray-600">/</span>
      <span className={isEn ? 'text-poke-red' : ''}>EN</span>
    </button>
  );
}
