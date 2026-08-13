import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-8xl font-bold text-poke-red/20">404</p>
      <h1 className="text-2xl font-bold mt-4">{t('notFound.title')}</h1>
      <p className="text-poke-gray-500 mt-2">{t('notFound.desc')}</p>
      <Link to="/" className="mt-6">
        <Button>{t('notFound.backHome')}</Button>
      </Link>
    </div>
  );
}
