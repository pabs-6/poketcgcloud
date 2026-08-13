import { useTranslation } from 'react-i18next';
import { GitHubIcon, LinkedInIcon } from '@/components/icons/Icons';

import { isAffiliateEnabled } from '@/utils/affiliateLinks';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 sm:mt-12 border-t border-poke-gray-200 dark:border-poke-gray-800 py-6 sm:py-8 pb-24 md:pb-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-4 px-3 text-sm text-poke-gray-500 sm:px-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p>{t('footer.tagline')}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span>{t('footer.madeBy')}</span>
            <span className="font-semibold text-poke-red">pabs-6</span>
            <div className="flex items-center gap-1.5">
              <a
                href="https://github.com/pabs-6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.githubAria')}
                className="rounded-lg p-1.5 text-poke-gray-500 transition-colors hover:bg-poke-gray-100 hover:text-poke-black dark:hover:bg-poke-gray-800 dark:hover:text-poke-white"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/pablo-serrano-mart%C3%ADn-121bb0387"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.linkedinAria')}
                className="rounded-lg p-1.5 text-poke-gray-500 transition-colors hover:bg-poke-gray-100 hover:text-[#0A66C2] dark:hover:bg-poke-gray-800"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-poke-gray-200/80 dark:border-poke-gray-800 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <p>{t('footer.copyright', { year })}</p>
          <p className="text-xs leading-relaxed lg:max-w-xl lg:text-right">
            {t('footer.disclaimer')}
            {isAffiliateEnabled() && (
              <>
                {' '}
                {t('footer.affiliateDisclaimer')}
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
