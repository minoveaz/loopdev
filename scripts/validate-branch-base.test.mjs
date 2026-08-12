import assert from 'node:assert/strict';
import test from 'node:test';
import { isAncestor } from './validate-branch-base.mjs';

test('recognizes the current develop base as an ancestor of the branch', () => {
  assert.equal(isAncestor('origin/develop', 'HEAD'), true);
});

test('rejects a missing base reference', () => {
  assert.equal(isAncestor('origin/does-not-exist', 'HEAD'), false);
});