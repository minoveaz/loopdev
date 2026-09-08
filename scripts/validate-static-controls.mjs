#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
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
const prettierCli = path.resolve('node_modules/prettier/bin/prettier.cjs');
const eslintCli = path.resolve('node_modules/eslint/bin/eslint.js');
const windowsPrettierCommandLength = 7000;
const windowsLintCommandLength = 7000;
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
  const isPrettierCommand = args[0] === 'exec' && args[1] === 'prettier';
  const isEslintCommand = args[0] === 'exec' && args[1] === 'eslint';
  const localCli = isPrettierCommand ? prettierCli : isEslintCommand ? eslintCli : null;
  const executable = localCli ? process.execPath : command;
  const executableArgs = localCli ? [localCli, ...args.slice(2)] : args;
  const result = spawnSync(executable, executableArgs, {
    stdio: 'inherit',
    // Run local CLIs directly so changed paths never pass through a shell.
    shell: localCli ? false : isWindows,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function fileBatches(files, commandPrefixLength, maxCommandLength) {
  const batches = [];
  let batch = [];
  let commandLength = commandPrefixLength;

  for (const file of files) {
    // Leave room for quoting and the separator added by the Windows shell.
    const fileLength = file.length + 3;
    if (isWindows && batch.length > 0 && commandLength + fileLength > maxCommandLength) {
      batches.push(batch);
      batch = [];
      commandLength = commandPrefixLength;
    }
    batch.push(file);
    commandLength += fileLength;
  }

  if (batch.length > 0) batches.push(batch);
  return batches;
}

function prettierFileBatches(files) {
  return fileBatches(
    files,
    `${pnpmCommand} exec prettier --check `.length,
    windowsPrettierCommandLength,
  );
}

function lintFileBatches(files) {
  return fileBatches(files, `${pnpmCommand} exec eslint `.length, windowsLintCommandLength);
}

function localCommands(classification) {
  const commands = [];
  if (classification.files.length > 0) {
    const prettierFiles = classification.files.filter((file) => file !== 'pnpm-lock.yaml');
    for (const batch of prettierFileBatches(prettierFiles)) {
      commands.push(['exec', 'prettier', '--check', ...batch]);
    }
  }
  if (classification.lintFiles.length > 0) {
    for (const batch of lintFileBatches(classification.lintFiles)) {
      commands.push(['exec', 'eslint', ...batch]);
    }
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

export {
  branchCommands,
  classifyStaticFiles,
  commandsForScope,
  localCommands,
  lintFileBatches,
  prettierFileBatches,
};

if (process.argv[1]?.endsWith('validate-static-controls.mjs')) main();
