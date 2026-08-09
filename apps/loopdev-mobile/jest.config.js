/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@loopdev/ui-native$': '<rootDir>/../../ds/packages/ui-native/src/index.tsx',
    '^@loopdev/tokens/semantic$': '<rootDir>/../../ds/packages/tokens/src/semantic.ts',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['App.tsx', 'src/**/*.{ts,tsx}', '!**/*.d.ts'],
};