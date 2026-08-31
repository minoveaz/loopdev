import assert from 'node:assert/strict';
import test from 'node:test';
import { commandsForDomain } from './validate-domain-controls.mjs';

const cimo = {
  id: 'cimo',
  manifest: 'apps/cimo/package.json',
  controls: {
    lint: { script: 'lint' },
    typecheck: { script: 'typecheck' },
    unit: { script: 'test' },
    build: { script: 'build' },
  },
};

const manifest = { name: 'cimo' };

test('uses the domain contract without build for local feedback', () => {
  assert.deepEqual(commandsForDomain(cimo, manifest), [
    ['--filter', 'cimo', 'lint'],
    ['--filter', 'cimo', 'typecheck'],
    ['--filter', 'cimo', 'test'],
  ]);
});

test('includes build for branch-level package validation', () => {
  assert.deepEqual(commandsForDomain(cimo, manifest, { includeBuild: true }), [
    ['--filter', 'cimo', 'lint'],
    ['--filter', 'cimo', 'typecheck'],
    ['--filter', 'cimo', 'test'],
    ['--filter', 'cimo', 'build'],
  ]);
});
