import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyStaticFiles, commandsForScope } from './validate-static-controls.mjs';

test('limits local static validation to changed source and lint files', () => {
  const classification = classifyStaticFiles([
    'apps/cimo/src/App.tsx',
    'docs/testing-guide.md',
    'node_modules/example/index.ts',
    'apps/cimo/dist/index.js',
    'pnpm-lock.yaml',
    'tracks/README.md',
  ]);

  assert.deepEqual(classification.files, [
    'apps/cimo/src/App.tsx',
    'docs/testing-guide.md',
    'pnpm-lock.yaml',
  ]);
  assert.deepEqual(classification.lintFiles, ['apps/cimo/src/App.tsx']);
});

test('does not schedule repository-wide scans for worktree or commit scopes', () => {
  const classification = classifyStaticFiles(['apps/cimo/src/App.tsx']);

  assert.deepEqual(
    commandsForScope('worktree', classification).map((command) => command[1]),
    ['prettier', 'eslint'],
  );
  assert.deepEqual(
    commandsForScope('commit', classification).map((command) => command[1]),
    ['prettier', 'eslint'],
  );
});

test('reserves repository-wide static scans for branch scope', () => {
  const commands = commandsForScope('branch', classifyStaticFiles(['apps/cimo/src/App.tsx']));
  const commandNames = commands.map((command) => (command[0] === 'exec' ? command[1] : command[0]));

  assert.ok(commandNames.includes('classes:check'));
  assert.ok(commandNames.includes('duplication:check'));
  assert.ok(commandNames.includes('knip'));
});
