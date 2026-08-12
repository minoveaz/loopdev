#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const registry = JSON.parse(
  readFileSync(resolve('config/design-contract-registry.json'), 'utf8'),
);
const allowedKinds = new Set(['immutable', 'evolving']);
const errors = [];

for (const [rule, contract] of Object.entries(registry.rules ?? {})) {
  if (!allowedKinds.has(contract.kind)) errors.push(`${rule} has invalid kind`);
  if (!contract.risk) errors.push(`${rule} has no primary risk`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Design contract registry passed: ${Object.keys(registry.rules).length} rules.`);