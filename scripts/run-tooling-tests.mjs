#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function collectTestFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectTestFiles(filePath));
    if (entry.isFile() && entry.name.endsWith('.test.mjs')) files.push(filePath);
  }
  return files.sort();
}

function toolingTestFiles(root = process.cwd()) {
  return collectTestFiles(path.join(root, 'scripts')).map((file) =>
    path.relative(root, file).replaceAll('\\', '/'),
  );
}

function main() {
  const files = toolingTestFiles();
  if (files.length === 0) {
    console.log('No tooling tests found.');
    return;
  }
  console.log(`Running ${files.length} tooling test files.`);
  execFileSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
}

export { toolingTestFiles };

if (process.argv[1]?.endsWith('run-tooling-tests.mjs')) main();
