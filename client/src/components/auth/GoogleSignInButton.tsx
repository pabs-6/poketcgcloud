import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { GoogleIcon } from '@/components/icons/Icons';
import { cn } from '@/utils';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void | Promise<void>;
  onError?: (message?: string) => void;
  loading?: boolean;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
const MIN_BUTTON_WIDTH = 200;
const MAX_BUTTON_WIDTH = 400;

export function isGoogleConfigured(): boolean {
  return clientId.length > 0;
}

export function GoogleSignInButton({ onSuccess, onError, loading }: GoogleSignInButtonProps) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(280);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const next = Math.min(MAX_BUTTON_WIDTH, Math.max(MIN_BUTTON_WIDTH, Math.floor(el.clientWidth)));
      setButtonWidth(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!isGoogleConfigured()) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm">
        <div className="flex items-start gap-3">
          <GoogleIcon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-2 text-amber-900 dark:text-amber-200">
            <p className="font-medium">{t('auth.googleNotConfigured')}</p>
            <p className="text-xs leading-relaxed opacity-90">
              {t('auth.googleSetupHint')}{' '}
              <code className="bg-white/60 dark:bg-black/30 px-1 rounded">client/.env</code> {t('auth.googleAndEnv')}{' '}
              <code className="bg-white/60 dark:bg-black/30 px-1 rounded">server/.env</code>:
            </p>
            <pre className="text-[10px] bg-white/60 dark:bg-black/30 p-2 rounded overflow-x-auto">
{`VITE_GOOGLE_CLIENT_ID=tu-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=tu-id.apps.googleusercontent.com`}
            </pre>
            <p className="text-[11px] opacity-80">
              {t('auth.googleOriginHint')} <strong>http://localhost:5173</strong> · {t('auth.googleRestart')}{' '}
              <code>npm run dev</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[320px]" style={{ height: 44 }}>
      <div
        className={cn(
          'absolute inset-0 inline-flex items-center justify-center gap-2 rounded-lg border border-poke-gray-200 dark:border-poke-gray-600',
          'bg-transparent px-3 text-xs font-medium text-poke-gray-700 dark:text-poke-gray-200',
          'pointer-events-none select-none',
          loading && 'opacity-50'
        )}
        aria-hidden="true"
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-poke-gray-300 border-t-poke-red" />
            <span>{t('auth.googleConnecting')}</span>
          </>
        ) : (
          <>
            <GoogleIcon className="h-4 w-4 shrink-0" />
            <span>{t('auth.continueWithGoogle')}</span>
          </>
        )}
      </div>

      {!loading && (
        <div className="absolute inset-0 z-10 overflow-hidden opacity-[0.011]">
          <GoogleLogin
            onSuccess={(response: CredentialResponse) => {
              if (response.credential) {
                void onSuccess(response.credential);
              } else {
                onError?.(t('auth.googleNoCredential'));
              }
            }}
            onError={() => onError?.(t('auth.googleConnectionError'))}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width={buttonWidth}
            locale={i18n.language.startsWith('en') ? 'en' : 'es'}
          />
        </div>
      )}
    </div>
  );
}
