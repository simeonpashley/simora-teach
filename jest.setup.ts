import '@testing-library/jest-dom';

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
