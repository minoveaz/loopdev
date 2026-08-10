#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const allowedBranchPrefixes = ['feature/', 'fix/', 'chore/', 'docs/', 'test/'];
const conventionalCommitPattern =
  /^(feat|fix|chore|docs|test|refactor|perf)\([a-z0-9][a-z0-9._/-]*\)!?: .+/;
const branchPattern = /^(feature|fix|chore|docs|test)\/[a-z0-9][a-z0-9-]*(?:-[a-z0-9][a-z0-9-]*)*$/;

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(`Git convention validation failed: ${message}`);
  process.exitCode = 1;
}

const branch =
  getOption('--branch') || process.env.GITHUB_HEAD_REF || runGit(['branch', '--show-current']);
const prTitle = getOption('--pr-title') || process.env.PR_TITLE;
const range = getOption('--range');
const errors = [];

if (!['develop', 'main'].includes(branch) && !branchPattern.test(branch)) {
  errors.push(
    `invalid branch '${branch}'. Use feature/<area>-<topic>, fix/<area>-<topic>, chore/<area>-<topic>, docs/<area>-<topic>, or test/<area>-<topic>`,
  );
}

if (prTitle && !conventionalCommitPattern.test(prTitle)) {
  errors.push(`invalid PR title '${prTitle}'. Use type(scope): imperative description`);
}

if (range) {
  const commits = runGit(['log', '--format=%H%x09%s', range])
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t', 2));

  for (const [sha, subject] of commits) {
    if (!conventionalCommitPattern.test(subject)) {
      errors.push(`invalid commit ${sha.slice(0, 7)}: '${subject}'`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) fail(error);
  process.exit(1);
}

console.log(`Git conventions passed for ${branch}${prTitle ? ` and PR '${prTitle}'` : ''}.`);
