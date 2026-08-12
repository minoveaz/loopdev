import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const registry = JSON.parse(readFileSync(new URL('../config/validation-registry.json', import.meta.url), 'utf8'));

test('every registered control has ownership, risk, command, cost, and execution modes', () => {
  for (const check of registry.checks) {
    for (const field of ['id', 'domain', 'layer', 'environment', 'risk', 'owner', 'command', 'cost', 'modes']) {
      assert.ok(check[field], `${check.id} is missing ${field}`);
    }
    assert.match(check.command, /^pnpm /, `${check.id} command must start with pnpm`);
  }
});

test('control ids and commands are unique', () => {
  const ids = registry.checks.map((check) => check.id);
  const commands = registry.checks.map((check) => check.command);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(commands).size, commands.length);
});

test('registers visual intent as a web experience control', () => {
  const control = registry.checks.find((check) => check.id === 'visual-contract-intent');

  assert.deepEqual(
    {
      domain: control.domain,
      layer: control.layer,
      risk: control.risk,
      modes: control.modes,
    },
    {
      domain: 'web',
      layer: 'experience',
      risk: 'unreviewed visual contract change',
      modes: ['changed', 'domain'],
    },
  );
});