import '@/styles/global.css';

import { enUS } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

import { getMessages } from '@/i18n';
import { AllLocales } from '@/utils/AppConfig';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return AllLocales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Using internationalization in Client Components
  // TODO: Add Common/Global non-language messages for other, e.g., brand name, year, author.
  const messages = await getMessages((await props.params).locale);
  const signInUrl = '/sign-in';
  const signUpUrl = '/sign-up';
  const dashboardUrl = '/dashboard';
  const afterSignOutUrl = '/';

  const clerkLocale = enUS;
  // The `suppressHydrationWarning` in <html> is used to prevent hydration errors caused by `next-themes`.
  // Solution provided by the package itself: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app

  // The `suppressHydrationWarning` attribute in <body> is used to prevent hydration errors caused by Sentry Overlay,
  // which dynamically adds a `style` attribute to the body tag.
  return (
    (
      <html lang={(await props.params).locale} suppressHydrationWarning>
        <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
          <NextIntlClientProvider
            locale={(await props.params).locale}
            messages={messages}
            timeZone="UTC"
          >
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
          </NextIntlClientProvider>
        </body>
      </html>
    )
  );
}
