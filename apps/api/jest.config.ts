import type { Config } from 'jest';

export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  moduleNameMapper: {
    '^@audit-log-and-activity-tracking-saas/(.*)$': '<rootDir>/../../libs/shared/$1/src',
  },
  testMatch: ['**/__tests__/**/*.[jt]s', '**/*.spec.[jt]s'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 30000, // 30 seconds for testcontainers
  maxWorkers: 1, // Run tests serially to avoid database conflicts
};

