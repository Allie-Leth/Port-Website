const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
})

// Custom config to pass to Jest
const customJestConfig = {
  // Setup files after environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
    '!app/**/globals.css',
    '!app/demo/**',
    '!**/node_modules/**',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],

  // Coverage thresholds - 80% target as per CI
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // Test path ignore patterns - e2e tests are run by Playwright, not Jest
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup/', '/e2e/'],

  // Transform ignore patterns
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'cobertura', 'json-summary'],

  // Test result reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
      },
    ],
  ],
}

// Export the configuration
module.exports = createJestConfig(customJestConfig)
