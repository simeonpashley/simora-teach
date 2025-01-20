'use client';

import { enUS } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const signInUrl = '/sign-in';
  const signUpUrl = '/sign-up';
  const dashboardUrl = '/dashboard';
  const afterSignOutUrl = '/';

  const clerkLocale = enUS;

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
        dynamic
      >
        {props.children}
      </ClerkProvider>
    )
  );
}
