import '@testing-library/jest-dom';

import React from 'react';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Fail on console errors (migrated from vitest-fail-on-console)
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;
const originalInfo = console.info;
const originalDebug = console.debug;

const consoleSpy = false;

beforeAll(() => {
  if (consoleSpy) {
    console.error = (...args: any[]) => {
      originalError.apply(console, args);
      // Allow console.error in test setup tests that explicitly test this behavior
      if (expect.getState().testPath?.includes('setup.test.ts')
        || expect.getState().testPath?.includes('/api/')) {
        return;
      }
      throw new Error('Console error was called');
    };
    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args);
      // Allow console.warn in API tests
      if (expect.getState().testPath?.includes('/api/')) {
        return;
      }
      throw new Error('Console warn was called');
    };
    console.log = (...args: any[]) => {
      originalLog.apply(console, args);
      throw new Error('Console log was called');
    };
    console.info = (...args: any[]) => {
      originalInfo.apply(console, args);
      throw new Error('Console info was called');
    };
    console.debug = (...args: any[]) => {
      originalDebug.apply(console, args);
      throw new Error('Console debug was called');
    };
  }
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
  console.info = originalInfo;
  console.debug = originalDebug;
});

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';

// outgoing vitest setup
// import '@testing-library/jest-dom/vitest';

// import failOnConsole from 'vitest-fail-on-console';

// failOnConsole({
//   shouldFailOnDebug: true,
//   shouldFailOnError: true,
//   shouldFailOnInfo: true,
//   shouldFailOnLog: true,
//   shouldFailOnWarn: true,
// });

// // Set up environment variables for testing
// process.env.BILLING_PLAN_ENV = 'test';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => React.createElement('div', { 'data-testid': 'alert-circle' }, 'AlertCircle Icon'),
  ChevronDown: () => React.createElement('div', { 'data-testid': 'chevron-down' }, 'ChevronDown Icon'),
  ChevronUp: () => React.createElement('div', { 'data-testid': 'chevron-up' }, 'ChevronUp Icon'),
  ChevronLeft: () => React.createElement('div', { 'data-testid': 'chevron-left' }, 'ChevronLeft Icon'),
  ChevronRight: () => React.createElement('div', { 'data-testid': 'chevron-right' }, 'ChevronRight Icon'),
  ChevronsUpDown: () => React.createElement('div', { 'data-testid': 'chevrons-up-down' }, 'ChevronsUpDown Icon'),
  Check: () => React.createElement('div', { 'data-testid': 'check' }, 'Check Icon'),
  X: () => React.createElement('div', { 'data-testid': 'x' }, 'X Icon'),
  Menu: () => React.createElement('div', { 'data-testid': 'menu' }, 'Menu Icon'),
  Search: () => React.createElement('div', { 'data-testid': 'search' }, 'Search Icon'),
  SortAsc: () => React.createElement('div', { 'data-testid': 'sort-asc' }, 'SortAsc Icon'),
  SortDesc: () => React.createElement('div', { 'data-testid': 'sort-desc' }, 'SortDesc Icon'),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', props, children),
    nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
      React.createElement('nav', props, children),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));
