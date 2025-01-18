import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { AllLocales } from '@/utils/AppConfig';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !AllLocales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});

export async function getMessages(locale: string) {
  if (!locale || !AllLocales.includes(locale)) {
    notFound();
  }

  return (await import(`./locales/${locale}.json`)).default;
}
