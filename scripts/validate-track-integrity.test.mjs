import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyChangedFiles, renderSummary } from './validate-track-integrity.mjs';

test('identifies test files and their supporting configuration', () => {
  const categories = classifyChangedFiles([
    'apps/loopdev-mobile/__tests__/App.test.tsx',
    'e2e/shell.visual.spec.mjs-snapshots/login.png',
    'playwright.config.mjs',
    'src/feature.ts',
  ]);

  assert.deepEqual(categories.testFiles, [
    'apps/loopdev-mobile/__tests__/App.test.tsx',
    'e2e/shell.visual.spec.mjs-snapshots/login.png',
  ]);
  assert.deepEqual(categories.testSupportFiles, [
    'e2e/shell.visual.spec.mjs-snapshots/login.png',
    'playwright.config.mjs',
  ]);
});

test('identifies track and workflow integrity changes', () => {
  const categories = classifyChangedFiles([
    'tracks/planned/governance/example.md',
    'scripts/tracks/validate-tracks.mjs',
    '.github/workflows/ci.yml',
  ]);

  assert.equal(categories.trackIntegrityFiles.length, 3);
});

test('renders an informational review warning without changing the result to failure', () => {
  const files = ['scripts/example.test.mjs'];
  const summary = renderSummary(files, classifyChangedFiles(files));

  assert.match(summary, /Review required/);
  assert.match(summary, /scripts\/example\.test\.mjs/);
  assert.doesNotMatch(summary, /failed|failure/i);
});

test('does not warn for a product-only change', () => {
  const files = ['apps/loopdev-os/src/app/page.tsx'];
  const categories = classifyChangedFiles(files);

  assert.deepEqual(categories, {
    testFiles: [],
    testSupportFiles: [],
    trackIntegrityFiles: [],
  });
  assert.match(renderSummary(files, categories), /No test/);
});