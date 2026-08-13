import { execFileSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const script = path.join(root, 'scripts/components/create-component.mjs');

function run(args) {
  return execFileSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

test('blocks an existing component before write mode', () => {
  assert.throws(
    () => run(['--name', 'PageHeader', '--type', 'composite', '--category', 'content', '--write']),
    /target already exists/,
  );
});

test('dry run does not create a new scaffold', () => {
  const name = 'GeneratorSafetyProbe';
  const target = path.join(root, 'apps/loopdev-os/src/suites/crm/widgets', name);
  try {
    const output = run([
      '--name', name,
      '--type', 'widget',
      '--category', 'crm',
      '--suite', 'apps/loopdev-os/src/suites/crm',
    ]);
    assert.match(output, /No files created/);
    assert.equal(fs.existsSync(target), false);
  } finally {
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  }
});

test('rejects a suite path outside the repository', () => {
  assert.throws(
    () => run([
      '--name', 'UnsafeWidget',
      '--type', 'widget',
      '--category', 'crm',
      '--suite', '..',
    ]),
    /suite must stay inside the repository/,
  );
});

test('requires a documented decision before bypassing a registry match', () => {
  assert.throws(
    () => run([
      '--name', 'PageHeader',
      '--type', 'composite',
      '--category', 'content',
      '--duplicate-review', 'docs/04-governance/COMPONENT_LIFECYCLE.md',
      '--write',
    ]),
    /target already exists|duplicate review must record/,
  );
});
