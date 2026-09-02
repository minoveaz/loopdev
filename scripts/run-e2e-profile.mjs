#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { loadE2eCatalog, specsForDomain, specsForProfile } from './validate-e2e-catalog.mjs';

const profiles = new Set([
  'smoke',
  'functional',
  'domain',
  'component',
  'accessibility',
  'visual',
  'responsive',
  'diagnostic',
  'contract',
  'full',
]);
const isWindows = process.platform === 'win32';
const playwrightCommand = isWindows ? 'playwright.cmd' : 'playwright';

function filesForSelection(selection, catalog) {
  if (selection === 'full') return null;
  if (selection.startsWith('files:')) {
    const files = selection.slice('files:'.length).split(',').filter(Boolean);
    if (files.length === 0) throw new Error('File selection requires at least one E2E spec');
    const knownFiles = new Set(
      (catalog ?? loadE2eCatalog()).specs.map((spec) => `e2e/${spec.file}`),
    );
    if (files.some((file) => !knownFiles.has(file))) {
      throw new Error(`Unknown E2E spec in file selection: ${files.join(', ')}`);
    }
    return files;
  }
  if (selection.startsWith('domain:'))
    return specsForDomain(selection.slice('domain:'.length), catalog).map(
      (spec) => `e2e/${spec.file}`,
    );
  if (profiles.has(selection))
    return specsForProfile(selection, catalog).map((spec) => `e2e/${spec.file}`);
  throw new Error(`Unknown E2E profile: ${selection}`);
}

function main() {
  const selection = process.argv.slice(2).find((arg) => arg !== '--') ?? 'smoke';
  const projects = process.argv.slice(2).filter((arg) => arg.startsWith('--project='));
  const files = filesForSelection(selection);
  const args = ['test', ...(files ?? []), ...projects];
  console.log(`E2E profile: ${selection}`);
  console.log(`- ${playwrightCommand} ${args.join(' ')}`);
  const result = spawnSync(playwrightCommand, args, { stdio: 'inherit', shell: isWindows });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export { filesForSelection };

if (process.argv[1]?.endsWith('run-e2e-profile.mjs')) main();
