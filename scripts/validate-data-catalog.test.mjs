import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDataCatalog } from './validate-data-catalog.mjs';

const catalog = {
  version: 1,
  root: 'supabase/tests/database',
  domains: {
    platform: ['001_platform_core.sql'],
    communications: [],
  },
};

test('accepts assigned SQL files and an explicit empty future domain', () => {
  assert.deepEqual(validateDataCatalog(catalog, ['001_platform_core.sql']), []);
});

test('rejects unassigned SQL files', () => {
  const errors = validateDataCatalog(catalog, ['001_platform_core.sql', '007_communications.sql']);

  assert.ok(
    errors.some((error) => error.includes("SQL '007_communications.sql' has no data domain")),
  );
});

test('rejects duplicate SQL ownership across domains', () => {
  const invalidCatalog = {
    ...catalog,
    domains: { platform: ['001_platform_core.sql'], crm: ['001_platform_core.sql'] },
  };

  assert.ok(
    validateDataCatalog(invalidCatalog, ['001_platform_core.sql']).some((error) =>
      error.includes('assigned to both'),
    ),
  );
});

test('requires an explicit Communications domain even while it has no SQL files', () => {
  assert.ok(Object.hasOwn(catalog.domains, 'communications'));
  assert.deepEqual(catalog.domains.communications, []);
});
