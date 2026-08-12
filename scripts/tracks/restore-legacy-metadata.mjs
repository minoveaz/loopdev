import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const metadataSources = {
  '2026-01-07-design-system-architecture.md': 'conductor/tracks/ds-refactor-org_20260107/metadata.json',
  '2026-01-07-module-essentials.md': 'conductor/tracks/module-essentials_20260107/metadata.json',
  '2026-01-07-module-workspace.md': 'conductor/tracks/module-workspace_20260107/metadata.json',
  '2026-01-07-suite-home-hardening.md': 'conductor/tracks/suite-home-hardening_20260107/metadata.json',
  '2026-01-07-suite-home.md': 'conductor/tracks/suite-home_20260107/metadata.json',
  '2026-01-08-suite-notices-rail.md': 'conductor/tracks/suite-notices-rail_20260108/metadata.json',
  '2026-01-08-technical-status-badge.md': 'conductor/tracks/technical-status-badge_20260108/metadata.json',
  '2026-01-08-brand-hub-operation.md': 'conductor/tracks/brand-hub-operation_20260108/metadata.json',
};

for (const [destinationName, sourcePath] of Object.entries(metadataSources)) {
  const destinationPath = path.resolve('tracks/closed', destinationName);
  const content = await fs.readFile(destinationPath, 'utf8');
  if (content.includes('### metadata.json')) continue;

  const metadata = execFileSync('git', ['show', `HEAD:${sourcePath}`], { encoding: 'utf8' }).trim();
  await fs.appendFile(destinationPath, `\n\n---\n\n### metadata.json\n\n\`\`\`json\n${metadata}\n\`\`\`\n`);
  console.log(`Restored ${sourcePath}.`);
}