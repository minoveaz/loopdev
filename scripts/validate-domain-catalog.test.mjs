import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDomainCatalog } from './validate-domain-catalog.mjs';

function catalog() {
  return {
    version: 1,
    domains: [
      {
        id: 'cimo',
        owner: 'apps',
        paths: ['apps/cimo/'],
        manifest: 'apps/cimo/package.json',
        controls: {
          lint: { script: 'lint' },
          typecheck: { script: 'typecheck' },
          unit: { script: 'test' },
          build: { script: 'build' },
        },
      },
    ],
    protectedSurfaces: [{ id: 'public-shell', owner: 'platform', paths: ['ds/packages/public-shell/'] }],
  };
}

const manifests = {
  'apps/cimo/package.json': { scripts: { lint: 'eslint src', typecheck: 'tsc --noEmit', test: 'vitest run', build: 'vite build' } },
};

test('accepts a complete domain quality contract', () => {
  assert.deepEqual(validateDomainCatalog(catalog(), manifests, ['apps/cimo/package.json']), []);
});

test('rejects a domain whose declared script is missing', () => {
  const errors = validateDomainCatalog(catalog(), { 'apps/cimo/package.json': { scripts: {} } }, ['apps/cimo/package.json']);

  assert.ok(errors.some((error) => error.includes("missing package script 'lint'")));
});

test('rejects a new application that has no domain contract', () => {
  const errors = validateDomainCatalog(catalog(), manifests, ['apps/cimo/package.json', 'apps/new-app/package.json']);

  assert.ok(errors.some((error) => error.includes("application manifest 'apps/new-app/package.json' has no domain entry")));
});

test('rejects non-platform ownership of a protected surface', () => {
  const invalidCatalog = catalog();
  invalidCatalog.protectedSurfaces[0].owner = 'apps';

  assert.ok(validateDomainCatalog(invalidCatalog, manifests, ['apps/cimo/package.json']).some((error) => error.includes('must be owned by platform')));
});