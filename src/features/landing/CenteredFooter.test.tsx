import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import messages from '@/locales/en.json';

import { CenteredFooter } from './CenteredFooter';

// Mock next-intl
const mockTranslations = {
  copyright: (params: { year: number; name: string }) =>
    `© Copyright ${params.year} ${params.name}`,
  designed_by: 'Designed by {author}',
};

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useTranslations: () => {
    const t = (key: string, params?: { year: number; name: string }) => {
      if (key === 'copyright' && params) {
        return mockTranslations.copyright(params);
      }
      return mockTranslations[key as keyof typeof mockTranslations] || key;
    };
    t.rich = (key: string, { author }: { author: (chunks: string) => ReactNode }) => {
      if (key === 'designed_by') {
        return author('Simora');
      }
      return '';
    };
    return t;
  },
}));

describe('CenteredFooter', () => {
  describe('Core functionality', () => {
    it('should render all required props', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CenteredFooter
            logo={<div data-testid="logo">Logo</div>}
            name="Test Company"
            iconList={<div data-testid="icon-list">Icons</div>}
            legalLinks={<div data-testid="legal-links">Legal Links</div>}
          >
            <div data-testid="menu-items">Menu Items</div>
          </CenteredFooter>
        </NextIntlClientProvider>,
      );

      // Verify all core elements are rendered
      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('icon-list')).toBeInTheDocument();
      expect(screen.getByTestId('legal-links')).toBeInTheDocument();
      expect(screen.getByTestId('menu-items')).toBeInTheDocument();
      expect(screen.getByText(/Test Company/)).toBeInTheDocument();
    });
  });

  describe('Render method', () => {
    it('should have copyright information', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CenteredFooter
            logo={<div>Logo</div>}
            name="Test Company"
            iconList={<div>Icons</div>}
            legalLinks={<div>Legal Links</div>}
          >
            <div>Menu Items</div>
          </CenteredFooter>
        </NextIntlClientProvider>,
      );

      expect(screen.getByText(/© Copyright/)).toBeInTheDocument();
      expect(screen.getByText(/Test Company/)).toBeInTheDocument();
    });
  });
});
