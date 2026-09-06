#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const supabaseCommand = isWindows ? 'supabase.exe' : 'supabase';

function loadCatalog(root = process.cwd()) {
  return JSON.parse(readFileSync(path.join(root, 'config/validation-data-catalog.json'), 'utf8'));
}

function sqlFilesForDomain(domain, catalog = loadCatalog()) {
  if (domain === 'full') return Object.values(catalog.domains).flat();
  if (!(domain in catalog.domains)) throw new Error(`Unknown data domain: ${domain}`);
  return catalog.domains[domain];
}

function databaseCommand(domain, catalog = loadCatalog()) {
  const files = sqlFilesForDomain(domain, catalog);
  if (files.length === 0) return null;
  return ['test', 'db', '--local', ...files.map((file) => path.posix.join(catalog.root, file))];
}

function main() {
  const domain =
    process.argv.slice(2).find((argument) => argument !== '--' && !argument.startsWith('--')) ??
    'full';
  const dryRun = process.argv.includes('--dry-run');
  const command = databaseCommand(domain);
  if (!command) {
    console.log(`No SQL tests are versioned for data domain '${domain}'.`);
    return;
  }
  console.log(`Database validation domain: ${domain}`);
  console.log(`- ${supabaseCommand} ${command.join(' ')}`);
  if (!dryRun) {
    const result = spawnSync(supabaseCommand, command, { stdio: 'inherit', shell: isWindows });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

export { databaseCommand, sqlFilesForDomain };

if (process.argv[1]?.endsWith('run-database-tests.mjs')) main();
