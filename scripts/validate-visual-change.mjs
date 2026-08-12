#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { validateVisualContractIntent } from './validate-visual-contract-intent.mjs';

function getOption(name) {
  const inline = process.argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function changedFilesFromGit() {
  const base = getOption('--base') || process.env.BASE_SHA || 'HEAD^';
  const head = getOption('--head') || process.env.HEAD_SHA || 'HEAD';
  return execFileSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
}

function isVisualSnapshot(file) {
  return file.includes('-snapshots/') || file.endsWith('.snap');
}

function isVisualIntentFile(file) {
  return /^config\/visual-contract-intents\/[^/]+\.json$/.test(file);
}

function validateVisualChange(files, intent, intentFiles = [], selectedIntentFile) {
  const snapshotFiles = files.filter(isVisualSnapshot);
  if (snapshotFiles.length === 0) {
    return { required: false, snapshotFiles, errors: [] };
  }

  if (intentFiles.length !== 1) {
    return {
      required: true,
      snapshotFiles,
      errors: [
        intentFiles.length === 0
          ? 'exactly one changed config/visual-contract-intents/*.json file is required'
          : 'only one changed config/visual-contract-intents/*.json file is allowed',
      ],
    };
  }

  if (selectedIntentFile && selectedIntentFile !== intentFiles[0]) {
    return {
      required: true,
      snapshotFiles,
      errors: ['intent file must be the single changed config/visual-contract-intents/*.json file'],
    };
  }

  return {
    required: true,
    snapshotFiles,
    errors: validateVisualContractIntent(intent ?? {}),
  };
}

function main() {
  const intentFile = getOption('--intent-file') || process.env.VISUAL_CONTRACT_INTENT_FILE;
  const files = changedFilesFromGit();
  const changedIntentFiles = files.filter(isVisualIntentFile);
  const selectedIntentFile = intentFile || changedIntentFiles[0];
  const intent = selectedIntentFile ? JSON.parse(readFileSync(selectedIntentFile, 'utf8')) : undefined;
  const result = validateVisualChange(files, intent, changedIntentFiles, selectedIntentFile);

  if (!result.required) {
    console.log('Visual contract intent not required: no snapshot files changed.');
    return;
  }
  if (result.errors.length > 0) {
    console.error(`Visual contract intent required for:\n- ${result.snapshotFiles.join('\n- ')}`);
    console.error(`Missing or invalid intent:\n- ${result.errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Visual contract intent passed for ${result.snapshotFiles.length} snapshot file(s).`);
}

export { isVisualIntentFile, isVisualSnapshot, validateVisualChange };

if (process.argv[1]?.endsWith('validate-visual-change.mjs')) main();