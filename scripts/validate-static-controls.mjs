#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import process from 'node:process';
import {
  changedFilesFromCommit,
  changedFilesFromGit,
  changedFilesFromWorktree,
} from './validate-plan.mjs';

const sourceFilePattern = /\.(cjs|css|js|json|md|mdx|mjs|ts|tsx|yaml|yml)$/i;
const lintFilePattern = /\.(js|jsx|mjs|ts|tsx)$/i;
const ignoredPathPattern =
  /(^|[\\/])(node_modules|\.next|\.turbo|coverage|dist|build|storybook-static)([\\/]|$)/;
const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';
const generatedFiles = new Set(['tracks/README.md']);

function changedFilesForScope(scope, revision) {
  if (scope === 'worktree') return changedFilesFromWorktree();
  if (scope === 'commit') return changedFilesFromCommit(revision || 'HEAD');
  if (scope === 'branch') return changedFilesFromGit();
  throw new Error(`Unknown static validation scope: ${scope}`);
}

function classifyStaticFiles(files) {
  const normalized = files
    .map((file) => file.replaceAll('\\', '/'))
    .filter(
      (file) =>
        sourceFilePattern.test(file) && !ignoredPathPattern.test(file) && !generatedFiles.has(file),
    );
  return {
    files: [...new Set(normalized)].sort(),
    lintFiles: [...new Set(normalized.filter((file) => lintFilePattern.test(file)))].sort(),
  };
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: isWindows });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function localCommands(classification) {
  const commands = [];
  if (classification.files.length > 0) {
    commands.push([
      'exec',
      'prettier',
      '--check',
      ...classification.files.filter((file) => file !== 'pnpm-lock.yaml'),
    ]);
  }
  if (classification.lintFiles.length > 0) {
    commands.push(['exec', 'eslint', ...classification.lintFiles]);
  }
  return commands;
}

function branchCommands() {
  return [
    ['classes:check'],
    ['contracts:ownership:check'],
    ['certification:source-contracts'],
    ['front:audit', '--fail-on-new-findings', '--baseline=config/frontend-audit-baseline.json'],
    ['duplication:check'],
    ['knip', '--no-exit-code', '--reporter', 'compact'],
  ];
}

function commandsForScope(scope, classification) {
  const local = localCommands(classification);
  return scope === 'branch' ? [...local, ...branchCommands()] : local;
}

function main() {
  const scope = process.argv[2] ?? 'worktree';
  const revision = process.argv[3];
  const classification = classifyStaticFiles(changedFilesForScope(scope, revision));
  console.log(`Static validation scope: ${scope}`);
  console.log(`Changed source files: ${classification.files.length}`);
  console.log(`Lint files: ${classification.lintFiles.length}`);
  const commands = commandsForScope(scope, classification);
  if (commands.length === 0) {
    console.log('No static validation required.');
    return;
  }
  for (const args of commands) {
    console.log(`- ${pnpmCommand} ${args.join(' ')}`);
    run(pnpmCommand, args);
  }
}

export { branchCommands, classifyStaticFiles, commandsForScope, localCommands };

if (process.argv[1]?.endsWith('validate-static-controls.mjs')) main();
