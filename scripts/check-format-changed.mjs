import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const supported = /\.(cjs|css|js|json|md|mjs|ts|tsx|yaml|yml)$/;
const ignored =
  /(^|[\\/])(node_modules|\.next|\.turbo|coverage|dist|build|storybook-static)([\\/]|$)/;

function gitFiles(args) {
  try {
    return execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMR', ...args], {
      encoding: 'utf8',
    })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

const base = process.env.GITHUB_BASE_SHA;
const files = [
  ...gitFiles([]),
  ...gitFiles(['--cached']),
  ...(base ? gitFiles([`${base}...${process.env.GITHUB_SHA ?? 'HEAD'}`]) : []),
  ...execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean),
]
  .filter((file, index, all) => all.indexOf(file) === index)
  .filter((file) => supported.test(file) && !ignored.test(file) && file !== 'pnpm-lock.yaml');

if (files.length === 0) {
  console.log('No changed source files to format-check.');
  process.exit(0);
}

const prettierCli = path.resolve('node_modules/prettier/bin/prettier.cjs');
execFileSync(process.execPath, [prettierCli, '--check', ...files], { stdio: 'inherit' });
