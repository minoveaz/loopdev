import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const root = process.cwd();
const script = path.join(root, 'scripts/certification/check-source-contracts.mjs');

test('source-contract gate passes for the manifest pilot', () => {
  const output = execFileSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  assert.match(output, /Source-contract validation passed/);
});

test('source-contract gate rejects forbidden implementation content', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'loopdev-source-contract-'));
  const manifestPath = path.join(directory, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    version: 1,
    policy: 'zero-hardcode-v1',
    components: [{
      id: 'invalid-fixture',
      implementation: 'scripts/certification/fixtures/invalid-component.tsx',
      forbiddenPatterns: ['raw-palette-class', 'domain-copy', 'raw-z-index', 'inline-visual-style'],
    }],
  }));

  assert.throws(
    () => execFileSync(process.execPath, [script, `--manifest=${manifestPath}`], { cwd: root, encoding: 'utf8' }),
    /Source-contract validation failed/,
  );
  fs.rmSync(directory, { recursive: true, force: true });
});