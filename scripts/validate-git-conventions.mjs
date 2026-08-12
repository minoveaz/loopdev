#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const allowedBranchPrefixes = ['feature/', 'fix/', 'chore/', 'docs/', 'test/'];
const conventionalCommitPattern =
  /^(feat|fix|chore|docs|test|refactor|perf)\([a-z0-9][a-z0-9._/-]*\)!?: .+/;

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
const commitMessageFile = getOption('--commit-msg');
const range = getOption('--range');
const errors = [];

const [branchPrefix, ...branchSegments] = branch.split('/');
const hasValidBranchName =
  allowedBranchPrefixes.includes(`${branchPrefix}/`) &&
  branchSegments.length === 1 &&
  branchSegments[0].split('-').every((segment) => /^[a-z0-9]+$/.test(segment));

if (!['develop', 'main'].includes(branch) && !hasValidBranchName) {
  errors.push(
    `invalid branch '${branch}'. Use feature/<area>-<topic>, fix/<area>-<topic>, chore/<area>-<topic>, docs/<area>-<topic>, or test/<area>-<topic>`,
  );
}

if (prTitle && !conventionalCommitPattern.test(prTitle)) {
  errors.push(`invalid PR title '${prTitle}'. Use type(scope): imperative description`);
}

if (commitMessageFile) {
  const subject = readFileSync(commitMessageFile, 'utf8').split('\n', 1)[0].trim();
  if (!conventionalCommitPattern.test(subject)) {
    errors.push(`invalid commit message '${subject}'. Use type(scope): imperative description`);
  }
}

if (range) {
  const commits = runGit(['log', '--first-parent', '--format=%H%x09%s', range])
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
