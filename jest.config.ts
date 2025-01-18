import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*',
    '!<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  passWithNoTests: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

//  outgoing vitest config
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   test: {
//     globals: true, // This is needed by @testing-library to be cleaned up after each test
//     include: ['src/**/*.test.{js,jsx,ts,tsx}'],
//     coverage: {
//       include: ['src/**/*'],
//       exclude: ['src/**/*.stories.{js,jsx,ts,tsx}', '**/*.d.ts'],
//     },
//     environmentMatchGlobs: [
//       ['**/*.test.tsx', 'jsdom'],
//       ['src/hooks/**/*.test.ts', 'jsdom'],
//     ],
//     setupFiles: ['./vitest-setup.ts'],
//     env: loadEnv('', process.cwd(), ''),
//   },
// });
