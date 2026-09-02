import assert from 'node:assert/strict';
import test from 'node:test';
import { specsForDomain, specsForProfile, validateE2eCatalog } from './validate-e2e-catalog.mjs';

const catalog = {
  version: 1,
  projects: ['desktop', 'mobile'],
  specs: [
    { file: 'shell.smoke.spec.mjs', domain: 'shell', profile: 'smoke', projects: ['desktop'] },
  ],
};

test('accepts a classified E2E spec', () => {
  assert.deepEqual(validateE2eCatalog(catalog, ['shell.smoke.spec.mjs']), []);
});

test('rejects an undiscovered versioned spec', () => {
  const errors = validateE2eCatalog(catalog, ['shell.smoke.spec.mjs', 'new.spec.mjs']);

  assert.ok(errors.some((error) => error.includes("new.spec.mjs' has no catalog entry")));
});

test('rejects an unknown project or profile', () => {
  const invalid = {
    ...catalog,
    specs: [{ ...catalog.specs[0], profile: 'matrix', projects: ['tablet'] }],
  };
  const errors = validateE2eCatalog(invalid, ['shell.smoke.spec.mjs']);

  assert.ok(errors.some((error) => error.includes('profile is invalid')));
  assert.ok(errors.some((error) => error.includes("unknown project 'tablet'")));
});

test('selects E2E specs by risk profile without mixing responsive coverage into smoke', () => {
  assert.deepEqual(
    specsForProfile('smoke', catalog).map((spec) => spec.file),
    ['shell.smoke.spec.mjs'],
  );
  assert.deepEqual(specsForProfile('responsive', catalog), []);
});

test('selects specs by domain independently of their profile', () => {
  assert.deepEqual(
    specsForDomain('shell', catalog).map((spec) => spec.file),
    ['shell.smoke.spec.mjs'],
  );
});
