#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import {
  domainForId,
  loadDomainCatalog,
  packageNameFromManifest,
} from './validation-domain-catalog-utils.mjs';

const controlOrder = ['lint', 'typecheck', 'unit', 'build'];
const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';

function commandForControl(domain, controlName, manifest) {
  const control = domain.controls[controlName];
  if (control.notApplicable) return null;
  if (control.command) return control.command.trim().split(/\s+/);
  return ['--filter', packageNameFromManifest(domain, manifest), control.script];
}

function commandsForDomain(domain, manifest, { includeBuild = false } = {}) {
  return controlOrder
    .filter((controlName) => includeBuild || controlName !== 'build')
    .map((controlName) => commandForControl(domain, controlName, manifest))
    .filter(Boolean);
}

function main() {
  const id = process.argv[2];
  const includeBuild = process.argv.includes('--include-build');
  const dryRun = process.argv.includes('--dry-run');
  const catalog = loadDomainCatalog();
  const domain = domainForId(id, catalog);
  if (!domain) throw new Error(`Unknown domain: ${id || '(missing)'}`);
  const manifest = JSON.parse(readFileSync(domain.manifest, 'utf8'));
  const commands = commandsForDomain(domain, manifest, { includeBuild });

  console.log(`Domain controls: ${domain.id}${includeBuild ? ' (including build)' : ''}`);
  for (const args of commands) {
    console.log(`- ${pnpmCommand} ${args.join(' ')}`);
    if (dryRun) continue;
    const result = spawnSync(pnpmCommand, args, { stdio: 'inherit', shell: isWindows });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

export { commandForControl, commandsForDomain };

if (process.argv[1]?.endsWith('validate-domain-controls.mjs')) main();
