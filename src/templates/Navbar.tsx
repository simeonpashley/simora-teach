'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const { isSignedIn } = useAuth();

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={<Logo />}
        rightMenu={(
          <>
            {isSignedIn
              ? (
                  <>
                    <li className="ml-1 mr-2.5" data-fade>
                      <Link className={buttonVariants()} href="/dashboard">{t('dashboard')}</Link>
                    </li>
                    <li>
                      <Link href="/sign-out">
                        {t('sign_out')}
                      </Link>
                    </li>
                  </>
                )
              : (
                  <>
                    <li className="ml-1 mr-2.5" data-fade>
                      <Link href="/sign-in">{t('sign_in')}</Link>
                    </li>
                    <li>
                      <Link className={buttonVariants()} href="/sign-up">
                        {t('sign_up')}
                      </Link>
                    </li>
                  </>
                )}
          </>
        )}
      >
        <li>
          <Link href="/sign-up">{t('product')}</Link>
        </li>
        <li>
          <Link href="/sign-up">{t('company')}</Link>
        </li>
      </CenteredMenu>
    </Section>
  );
};
