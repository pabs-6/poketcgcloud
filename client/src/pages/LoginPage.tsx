import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { CardsIcon } from '@/components/icons/Icons';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential: string) => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="grid min-h-[75vh] gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col justify-center space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-poke-red/10 text-poke-red">
          <CardsIcon className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('auth.welcomeBack')}</h1>
        <p className="max-w-md text-poke-gray-500 leading-relaxed">
          {t('auth.loginSubtitle')}
        </p>
        <ul className="space-y-2 text-sm text-poke-gray-500">
          <li>{t('auth.benefitSync')}</li>
          <li>{t('auth.benefitPrices')}</li>
          <li>{t('auth.benefitProgress')}</li>
        </ul>
      </div>

      <div className="glass-panel flex flex-col justify-center p-8">
        <h2 className="text-xl font-semibold mb-6">{t('auth.loginTitle')}</h2>
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <div className="space-y-4 mt-4">
          <GoogleSignInButton
            onSuccess={handleGoogle}
            onError={(msg) => setError(msg ?? t('auth.googleLoginError'))}
            loading={googleLoading}
          />

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-poke-gray-200 dark:border-poke-gray-800" /></div>
            <p className="relative text-center text-xs uppercase tracking-wider text-poke-gray-500 bg-white dark:bg-poke-gray-800 px-3 mx-auto w-fit">{t('auth.orEmail')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PasswordInput label={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" loading={loading}>{t('auth.loginSubmit')}</Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-poke-gray-500">
          {t('auth.noAccount')} <Link to="/register" className="text-poke-red hover:underline font-medium">{t('auth.registerLink')}</Link>
        </p>
      </div>
    </div>
  );
}
