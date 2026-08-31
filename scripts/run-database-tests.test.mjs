import assert from 'node:assert/strict';
import test from 'node:test';
import { databaseCommand, sqlFilesForDomain } from './run-database-tests.mjs';

const catalog = {
  root: 'supabase/tests/database',
  domains: { platform: ['001_platform_core.sql'], communications: [] },
};

test('builds a focused platform database command', () => {
  assert.deepEqual(databaseCommand('platform', catalog), [
    'test',
    'db',
    '--local',
    'supabase/tests/database/001_platform_core.sql',
  ]);
});

test('builds the full database command in catalog order', () => {
  assert.deepEqual(sqlFilesForDomain('full', catalog), ['001_platform_core.sql']);
});

test('returns no command for an explicitly empty future domain', () => {
  assert.equal(databaseCommand('communications', catalog), null);
});
