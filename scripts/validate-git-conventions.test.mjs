import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import test from 'node:test';

function validateBranch(branch) {
  return spawnSync(process.execPath, ['scripts/validate-git-conventions.mjs', '--branch', branch], {
    encoding: 'utf8',
  });
}

test('accepts the platform-generated prefix before a valid logical branch', () => {
  const result = validateBranch('loopdev-io-chore/ci-validation-optimization');

  assert.equal(result.status, 0, result.stderr);
});

test('continues rejecting malformed logical branch names', () => {
  const result = validateBranch('loopdev-io-not-valid');

  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid branch/);
});
