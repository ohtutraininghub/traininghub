import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
/** */

const clientTestConfig = {
  displayName: 'Client-side',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/components/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

const serverTestConfig = {
  displayName: 'Server-side',
  testEnvironment: 'jest-environment-node',
  testMatch: ['<rootDir>/src/app/api/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

const config = {
  projects: [
    await createJestConfig(clientTestConfig)(),
    await createJestConfig(serverTestConfig)(),
  ],
};

export default config;
