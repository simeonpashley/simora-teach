'use client';

import { deDE, enUS, esES, frFR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { use } from 'react';

import { AppConfig } from '@/utils/AppConfig';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);
  let clerkLocale = enUS;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';
  let afterSignOutUrl = '/';

  switch (params.locale) {
    case 'fr':
      clerkLocale = frFR;
      break;
    case 'de':
      clerkLocale = deDE;
      break;
    case 'es':
      clerkLocale = esES;
      break;
    // cy (Welsh) and ga (Irish) will fall back to English
    default:
      clerkLocale = enUS;
  }

  if (params.locale !== AppConfig.defaultLocale) {
    signInUrl = `/${params.locale}${signInUrl}`;
    signUpUrl = `/${params.locale}${signUpUrl}`;
    dashboardUrl = `/${params.locale}${dashboardUrl}`;
    afterSignOutUrl = `/${params.locale}${afterSignOutUrl}`;
  }

  return (
    (
      <ClerkProvider
      // PRO: Dark mode support for Clerk
        localization={clerkLocale}
        signInUrl={signInUrl}
        signUpUrl={signUpUrl}
        signInFallbackRedirectUrl={dashboardUrl}
        signUpFallbackRedirectUrl={dashboardUrl}
        afterSignOutUrl={afterSignOutUrl}
      >
        {props.children}
      </ClerkProvider>
    )
  );
}
