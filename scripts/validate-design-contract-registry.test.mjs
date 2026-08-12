import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const registry = JSON.parse(
  readFileSync(new URL('../config/design-contract-registry.json', import.meta.url), 'utf8'),
);

test('classifies every design rule as immutable or evolving with one primary risk', () => {
  const rules = Object.entries(registry.rules);

  assert.ok(rules.length > 0);
  for (const [rule, contract] of rules) {
    assert.ok(['immutable', 'evolving'].includes(contract.kind), `${rule} kind is invalid`);
    assert.ok(contract.risk, `${rule} has no primary risk`);
  }
});