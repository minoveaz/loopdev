import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TEST_FILE_PATTERN = /(^|\/)(__tests__|test|tests|e2e)(\/|$)|\.(test|spec)\.[^/]+$/i;
const TEST_SUPPORT_PATTERN = /(^|\/)(vitest|playwright|jest|cypress)\.config\.[^/]+$|(^|\/)test-results(\/|$)|(^|\/).*snapshots?(\/|$)/i;
const TRACK_INTEGRITY_PATTERN = /(^|\/)(tracks\/|scripts\/tracks\/|scripts\/validate-(track|plan)|\.github\/workflows\/)/i;

export function classifyChangedFiles(files) {
  return {
    testFiles: files.filter((file) => TEST_FILE_PATTERN.test(file)),
    testSupportFiles: files.filter((file) => TEST_SUPPORT_PATTERN.test(file)),
    trackIntegrityFiles: files.filter((file) => TRACK_INTEGRITY_PATTERN.test(file)),
  };
}

export function getChangedFiles(baseSha, headSha) {
  const output = execFileSync('git', ['diff', '--name-only', `${baseSha}...${headSha}`], {
    encoding: 'utf8',
  });
  return output.split(/\r?\n/).map((file) => file.trim()).filter(Boolean);
}

function uniqueFiles(categories) {
  return [...new Set(Object.values(categories).flat())].sort();
}

export function renderSummary(files, categories) {
  const watchedFiles = uniqueFiles(categories);
  const lines = ['## Track integrity alert', ''];

  if (watchedFiles.length === 0) {
    lines.push('No test, test-support, track-integrity, or workflow files changed.');
    return lines.join('\n');
  }

  lines.push('**Review required:** validation-related files changed. This is informational and does not block the PR.', '');
  for (const [category, categoryFiles] of Object.entries(categories)) {
    if (categoryFiles.length === 0) continue;
    lines.push(`### ${category}`, ...categoryFiles.map((file) => `- \`${file}\``), '');
  }
  lines.push(`Watched files changed: ${watchedFiles.length} of ${files.length} changed files.`);
  return lines.join('\n');
}

export function main([baseSha, headSha]) {
  if (!baseSha || !headSha) {
    console.error('Usage: node scripts/validate-track-integrity.mjs <base-sha> <head-sha>');
    return 1;
  }

  const files = getChangedFiles(baseSha, headSha);
  const categories = classifyChangedFiles(files);
  const summary = renderSummary(files, categories);
  console.log(summary);

  if (Object.values(categories).some((categoryFiles) => categoryFiles.length > 0)) {
    console.log('::warning title=Validation-related files changed::Review the tests, test support, track integrity, and workflow changes listed in the job summary.');
  }

  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));