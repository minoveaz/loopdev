#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import process from 'node:process';

const requiredEvidence = ['functional', 'accessibility', 'visual'];

function validateVisualContractIntent(intent) {
  const errors = [];
  if (intent?.kind !== 'visual-contract-change') errors.push('kind must be visual-contract-change');
  if (!Array.isArray(intent?.surfaces) || intent.surfaces.length === 0) {
    errors.push('surfaces must contain at least one affected surface');
  }
  if (!intent?.userIntent?.trim()) errors.push('userIntent is required');
  for (const evidence of requiredEvidence) {
    if (!intent?.evidence?.[evidence]?.trim()) errors.push(`evidence.${evidence} is required`);
  }
  if (!intent?.approvedBy?.trim()) errors.push('approvedBy is required');
  return errors;
}

function main() {
  const file = process.argv.find((argument) => argument.startsWith('--intent-file='));
  if (!file) {
    console.error('Usage: node scripts/validate-visual-contract-intent.mjs --intent-file=<path>');
    process.exit(1);
  }

  const intent = JSON.parse(readFileSync(file.slice('--intent-file='.length), 'utf8'));
  const errors = validateVisualContractIntent(intent);
  if (errors.length > 0) {
    console.error(`Visual contract intent validation failed:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Visual contract intent passed.');
}

export { validateVisualContractIntent };

if (process.argv[1]?.endsWith('validate-visual-contract-intent.mjs')) main();