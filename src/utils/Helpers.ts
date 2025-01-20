import { faker } from '@faker-js/faker';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { StudentStatus } from '@/lib/db/schema';

import { AppConfig } from './AppConfig';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MILLISECONDS_IN_ONE_DAY = 86_400_000;

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://127.0.0.1:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === AppConfig.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

export function generateRandomStudent(organizationId: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dateOfBirth = faker.date.between({
    from: '2005-01-01',
    to: '2015-12-31',
  });
  const enrollmentDate = faker.date.between({
    from: '2023-01-01',
    to: new Date(),
  });
  const status = faker.helpers.arrayElement(Object.values(StudentStatus));

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    dateOfBirth,
    enrollmentDate,
    status,
    organizationId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
