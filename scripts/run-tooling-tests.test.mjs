import assert from 'node:assert/strict';
import test from 'node:test';
import { toolingTestFiles } from './run-tooling-tests.mjs';

test('discovers only versioned tooling test files', () => {
  const files = toolingTestFiles();

  assert.ok(files.length >= 18);
  assert.ok(files.every((file) => file.startsWith('scripts/') && file.endsWith('.test.mjs')));
  assert.ok(!files.some((file) => file.includes('node_modules')));
});
