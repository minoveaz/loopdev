#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import process from 'node:process';

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function isAncestor(base, head) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', base, head], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function validateBranchBase({ base = 'origin/develop', head = 'HEAD', fetch = true } = {}) {
  if (fetch) runGit(['fetch', 'origin', 'develop']);

  const branch = runGit(['branch', '--show-current']) || '(detached HEAD)';
  if (['develop', 'main'].includes(branch)) {
    return { valid: false, branch, base, reason: 'protected branches cannot be PR head branches' };
  }

  if (!isAncestor(base, head)) {
    return { valid: false, branch, base, reason: `${base} is not an ancestor of ${head}` };
  }

  return { valid: true, branch, base, reason: null };
}

function main() {
  const result = validateBranchBase({
    base: getOption('--base') || process.env.BASE_REF || 'origin/develop',
    head: getOption('--head') || process.env.HEAD_SHA || 'HEAD',
    fetch: !process.argv.includes('--no-fetch'),
  });

  if (!result.valid) {
    console.error(`Branch base validation failed: ${result.reason}`);
    process.exit(1);
  }

  console.log(`Branch base validation passed: ${result.branch} contains ${result.base}.`);
}

export { isAncestor, validateBranchBase };

if (process.argv[1]?.endsWith('validate-branch-base.mjs')) main();