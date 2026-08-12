#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import process from 'node:process';

const outcomes = new Set(['passed', 'failed', 'cancelled']);

function validateObservations(document) {
  const errors = [];
  if (document?.version !== 1) errors.push('version must be 1');
  if (!Array.isArray(document?.observations) || document.observations.length === 0) {
    errors.push('observations must contain at least one entry');
    return errors;
  }

  const ids = new Set();
  for (const [index, observation] of document.observations.entries()) {
    const label = `observations[${index}]`;
    if (!observation?.id?.trim()) errors.push(`${label}.id is required`);
    if (observation?.id && ids.has(observation.id)) errors.push(`${label}.id must be unique`);
    if (observation?.id) ids.add(observation.id);
    for (const field of ['representativeClass', 'source']) {
      if (!observation?.[field]?.trim()) errors.push(`${label}.${field} is required`);
    }
    if (!Number.isFinite(observation?.durationSeconds) || observation.durationSeconds < 0) {
      errors.push(`${label}.durationSeconds must be a non-negative number`);
    }
    if (!outcomes.has(observation?.outcome)) errors.push(`${label}.outcome is invalid`);
    for (const field of ['selectedControls', 'skippedControls', 'duplicateRisks']) {
      if (!Array.isArray(observation?.[field])) errors.push(`${label}.${field} must be an array`);
    }
    if (typeof observation?.falseSkip !== 'boolean') errors.push(`${label}.falseSkip must be boolean`);
    if (typeof observation?.falseRun !== 'boolean') errors.push(`${label}.falseRun must be boolean`);
    for (const skipped of observation?.skippedControls ?? []) {
      if (!skipped?.id?.trim() || !skipped?.reason?.trim()) {
        errors.push(`${label}.skippedControls entries require id and reason`);
      }
    }
  }
  return errors;
}

function summarizeObservations(document) {
  const observations = document.observations;
  const durationSeconds = observations.reduce((total, item) => total + item.durationSeconds, 0);
  return {
    count: observations.length,
    averageDurationSeconds: durationSeconds / observations.length,
    falseSkips: observations.filter((item) => item.falseSkip).length,
    falseRuns: observations.filter((item) => item.falseRun).length,
    duplicateRisks: observations.reduce((total, item) => total + item.duplicateRisks.length, 0),
  };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/validate-observations.mjs <file>');
    process.exit(1);
  }
  const document = JSON.parse(readFileSync(file, 'utf8'));
  const errors = validateObservations(document);
  if (errors.length > 0) {
    console.error(`Validation observations failed:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  const summary = summarizeObservations(document);
  console.log(
    `Validation observations passed: ${summary.count} record(s), ` +
      `average ${summary.averageDurationSeconds}s, ` +
      `${summary.falseSkips} false skip(s), ${summary.falseRuns} false run(s), ` +
      `${summary.duplicateRisks} duplicate risk(s).`,
  );
}

export { summarizeObservations, validateObservations };

if (process.argv[1]?.endsWith('validate-observations.mjs')) main();