import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const runbookPath = resolve(root, 'docs/06-product/crm/CRM_SUITE_F5_OPERATIONS.md');
const trackPath = resolve(root, 'tracks/active/crm/2026-09-06-crm-suite-closure.md');

const requiredSections = [
  '## Gate de CI',
  '## Staging reproducible',
  '## Observabilidad',
  '## Continuidad y rollback',
  '## Evidencia y bloqueos',
];

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*['"][^'"]{12,}['"]/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]{12,}['"]/,
  /SENTRY_AUTH_TOKEN\s*=\s*['"][^'"]{12,}['"]/,
];

async function validateFile(path, label) {
  const content = await readFile(path, 'utf8');
  if (!content.trim()) throw new Error(`${label} is empty`);
  return content;
}

async function main() {
  const runbook = await validateFile(runbookPath, 'CRM F5 operations runbook');
  await validateFile(trackPath, 'CRM closure track');

  for (const section of requiredSections) {
    if (!runbook.includes(section)) {
      throw new Error(`CRM F5 runbook is missing required section: ${section}`);
    }
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(runbook)) {
      throw new Error('CRM F5 runbook contains a probable real secret');
    }
  }

  console.log('CRM F5 operations gate: documentation and secret safety checks passed.');
}

if (process.argv[1]?.endsWith('validate-crm-f5-operations.mjs')) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export { requiredSections };
