import assert from 'node:assert/strict';
import test from 'node:test';
import { commandsForPlan } from './validate-local.mjs';

test('runs branch-level catalogs and CI for a changed fallback plan', () => {
  const commands = commandsForPlan({ fullFallback: true, selected: [] }, 'changed');

  assert.deepEqual(commands, [
    ['validate:branch-base'],
    ['validate:data-catalog'],
    ['validate:e2e-catalog'],
    ['validate:ci'],
  ]);
});

test('keeps worktree documentation validation free of branch and functional controls', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [] }, 'worktree');

  assert.deepEqual(commands, []);
});

test('keeps commit documentation validation free of branch and functional controls', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [] }, 'commit');

  assert.deepEqual(commands, []);
});

test('runs catalogs and CI without branch preflight for a commit fallback', () => {
  const commands = commandsForPlan({ fullFallback: true, selected: [] }, 'commit');

  assert.deepEqual(commands, [
    ['validate:data-catalog'],
    ['validate:e2e-catalog'],
    ['validate:ci'],
  ]);
});

test('keeps branch-base preflight for documentation-only branch plans', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [] }, 'branch');

  assert.deepEqual(commands, [['validate:branch-base']]);
});

test('routes accumulated branch domains through their changed controls', () => {
  const commands = commandsForPlan(
    { fullFallback: false, selected: [{ id: 'shell' }, { id: 'packages' }] },
    'branch',
  );

  assert.deepEqual(commands, [
    ['validate:branch-base'],
    ['test:shell:changed'],
    ['validate:package-impact'],
  ]);
});

test('deduplicates controls selected by overlapping changed domains', () => {
  const commands = commandsForPlan(
    { fullFallback: false, selected: [{ id: 'shell' }, { id: 'packages' }] },
    'changed',
  );

  assert.deepEqual(commands, [
    ['validate:branch-base'],
    ['test:shell:changed'],
    ['validate:package-impact'],
  ]);
});

test('selects only the requested shell experience control', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [] }, 'experience', 'shell');

  assert.deepEqual(commands, [['validate:branch-base'], ['test:shell:changed']]);
});

test('adds visual intent validation for changed web surfaces', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [{ id: 'web' }] }, 'changed');

  assert.deepEqual(commands, [
    ['validate:branch-base'],
    ['validate:e2e-catalog'],
    ['design:visual:changed'],
  ]);
});

test('rejects an unknown domain instead of silently widening validation', () => {
  assert.throws(
    () => commandsForPlan({ fullFallback: false, selected: [] }, 'domain', 'unknown'),
    /Unknown domain scope/,
  );
});
