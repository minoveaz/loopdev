import 'vitest';
import '@testing-library/jest-dom/vitest';

declare module 'vitest' {
  // The empty interfaces intentionally augment Vitest's matcher types.
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
  /* eslint-enable @typescript-eslint/no-empty-object-type */
}
