#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { buildValidationPlan, changedFilesFromGit } from './validate-plan.mjs';

const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(resolve(repositoryRoot, 'config/validation-registry.json'), 'utf8'),
);

function commandArgs(command) {
  const tokens = command.trim().split(/\s+/);
  if (tokens[0] !== 'pnpm') throw new Error(`Registry command must start with pnpm: ${command}`);
  return tokens.slice(1);
}

function preflightCommands() {
  return registry.checks
    .filter((check) => check.id === 'branch-base')
    .map((check) => commandArgs(check.command));
}

function parseArgs(args) {
  const positional = args.filter((arg) => arg !== '--' && !arg.startsWith('--'));
  const mode = positional[0] ?? 'changed';
  const value = positional[1];
  return { mode, value, dryRun: args.includes('--dry-run') };
}

function commandsForPlan(plan, mode, value) {
  if (!['changed', 'domain', 'experience', 'full'].includes(mode)) {
    throw new Error(`Unknown validation mode: ${mode}`);
  }
  if (mode === 'full') {
    return [...preflightCommands(), ...registry.checks.filter((check) => check.modes.includes('full') && check.id !== 'branch-base').map((check) => commandArgs(check.command))];
  }

  const domains = mode === 'domain' || mode === 'experience' ? [value] : plan.selected.map(({ id }) => id);
  if ((mode === 'domain' || mode === 'experience') && !registry.checks.some((check) => check.domain === value && check.modes.includes(mode))) {
    throw new Error(`Unknown ${mode} scope: ${value || '(missing)'}`);
  }
  if (mode === 'changed' && plan.fullFallback) {
    return [...preflightCommands(), ...registry.checks.filter((check) => check.modes.includes('full') && check.id !== 'branch-base').map((check) => commandArgs(check.command))];
  }

  return [...preflightCommands(), ...registry.checks
    .filter((check) => check.modes.includes(mode) && domains.includes(check.domain))
    .filter((check) => check.id !== 'branch-base')
    .map((check) => commandArgs(check.command))];
}

function formatCommand(args) {
  return `${pnpmCommand} ${args.join(' ')}`;
}

function runCommand(args) {
  const result = spawnSync(pnpmCommand, args, {
    stdio: 'inherit',
    shell: isWindows,
  });

  if (result.error) throw new Error(`Unable to start ${pnpmCommand}: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function main() {
  const { mode, value, dryRun } = parseArgs(process.argv.slice(2));
  const plan = mode === 'full' ? null : buildValidationPlan(changedFilesFromGit());
  const commands = commandsForPlan(plan ?? { selected: [], fullFallback: false }, mode, value);

  console.log(`Validation scope: ${mode}${value ? ` (${value})` : ''}`);
  if (plan) {
    console.log(`Selected domains: ${plan.selected.map(({ id }) => id).join(', ') || 'none'}`);
    console.log(`Full fallback: ${plan.fullFallback ? 'yes' : 'no'}`);
  }
  console.log('\nControls:');
  for (const command of commands) {
    console.log(`- ${formatCommand(command)}`);
    if (!dryRun) runCommand(command);
  }
}

export { commandsForPlan };

if (process.argv[1]?.endsWith('validate-local.mjs')) main();