import { promises as fs } from 'node:fs';
import path from 'node:path';
import { TRACKS_ROOT } from './track-utils.mjs';

const legacyRoot = path.resolve('conductor/tracks');
const migrationDate = '2026-08-12';

const legacyTracks = {
  '20260321-quant-3-tier-arch': { output: '2026-03-21-quant-3-tier-architecture.md', owner: 'quant' },
  '20260321-quant-unified-reconnection': { output: '2026-03-21-quant-unified-reconnection.md', owner: 'quant' },
  '2026-07-18-sales-crm-integration': { output: '2026-07-18-sales-crm-integration.md', owner: 'sales-crm' },
  'brand-hub-identity_20260112': { output: '2026-01-12-brand-hub-identity.md', owner: 'marketing' },
  'brand-hub-logo-system_20260119': { output: '2026-01-19-brand-hub-logo-system.md', owner: 'marketing' },
  'brand-hub-operation_20260108': { output: '2026-01-08-brand-hub-operation.md', owner: 'marketing' },
  'brand-hub-overview_20260111': { output: '2026-01-11-brand-hub-overview.md', owner: 'marketing' },
  'brand-hub-rules-engine_20260119': { output: '2026-01-19-brand-hub-rules-engine.md', owner: 'marketing' },
  'brand-hub-typography_20260119': { output: '2026-01-19-brand-hub-typography.md', owner: 'marketing' },
  'brand-hub-visual-system_20260113': { output: '2026-01-13-brand-hub-visual-system.md', owner: 'marketing' },
  'ds-refactor-org_20260107': { output: '2026-01-07-design-system-architecture.md', owner: 'platform' },
  'health-os-occupational_20260628': { output: '2026-06-28-health-os-occupational.md', owner: 'health' },
  'ingestor-hardening_20260411': { output: '2026-04-11-ingestor-hardening.md', owner: 'quant' },
  'module-essentials_20260107': { output: '2026-01-07-module-essentials.md', owner: 'platform' },
  'module-workspace_20260107': { output: '2026-01-07-module-workspace.md', owner: 'platform' },
  'order-flow-integration_20260411': { output: '2026-04-11-order-flow-integration.md', owner: 'quant' },
  'quant-ops-suite_20260120': { output: '2026-01-20-quant-ops-suite.md', owner: 'quant' },
  'suite-home_20260107': { output: '2026-01-07-suite-home.md', owner: 'platform' },
  'suite-home-hardening_20260107': { output: '2026-01-07-suite-home-hardening.md', owner: 'platform' },
  'suite-notices-rail_20260108': { output: '2026-01-08-suite-notices-rail.md', owner: 'platform' },
  'technical-status-badge_20260108': { output: '2026-01-08-technical-status-badge.md', owner: 'platform' },
};

const modernTracks = {
  '2026-08-05-loopdev-saas-platform-upgrade.md': { status: 'active', owner: 'platform' },
  '2026-08-08-estar-protegidos-crm-platform.md': { status: 'planned', owner: 'sales-crm' },
  '2026-08-08-loopdev-frontend-quality-system.md': { status: 'active', owner: 'governance' },
  '2026-08-09-marketing-studio-platform.md': { status: 'planned', owner: 'marketing' },
  '2026-08-09-mobile-app-foundation.md': { status: 'active', owner: 'mobile' },
  '2026-08-10-shell-standardization.md': { status: 'planned', owner: 'platform' },
};

function titleFrom(content, fallback) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1] ?? fallback;
  return heading.replace(/^(Plan|Especificación|Track|Implementation Plan):\s*/i, '').trim();
}

function idFrom(output) {
  return output.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function createdFrom(output) {
  return output.slice(0, 10);
}

function frontmatter({ output, title, status, owner, source }) {
  return [
    '---',
    `id: ${idFrom(output)}`,
    `title: ${title}`,
    `status: ${status}`,
    `created: ${createdFrom(output)}`,
    `updated: ${migrationDate}`,
    `owner: ${owner}`,
    'branch: null',
    'areas: []',
    'dependencies: []',
    'blocked_by: []',
    'supersedes: []',
    `migration_source: ${source}`,
    '---',
    '',
  ].join('\n');
}

async function migrateLegacy(sourceName, configuration) {
  const sourceDirectory = path.join(legacyRoot, sourceName);
  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  const sources = [];
  for (const entry of entries.filter((item) => item.isFile()).sort((left, right) => left.name.localeCompare(right.name))) {
    const content = await fs.readFile(path.join(sourceDirectory, entry.name), 'utf8');
    sources.push({ name: entry.name, content });
  }
  const title = titleFrom(sources[0]?.content ?? '', sourceName);
  const history = sources.map(({ name, content }) => {
    const rendered = name.endsWith('.json') ? `\`\`\`json\n${content.trim()}\n\`\`\`` : content.trim();
    return `### ${name}\n\n${rendered}`;
  }).join('\n\n---\n\n');
  const content = [
    frontmatter({ output: configuration.output, title, status: 'closed', owner: configuration.owner, source: `conductor/tracks/${sourceName}` }),
    `# ${title}`,
    '',
    '## Outcome',
    '',
    'Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.',
    '',
    '## Fases',
    '',
    'Las fases históricas se conservan en el historial migrado.',
    '',
    '## Criterios de cierre',
    '',
    '- [x] Consolidado en el sistema de tracks de un archivo.',
    '- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.',
    '',
    '## Cierre',
    '',
    'Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.',
    '',
    '## Historial migrado',
    '',
    history,
    '',
  ].join('\n');
  await fs.writeFile(path.join(TRACKS_ROOT, 'closed', configuration.output), content);
}

async function migrateModern(sourceName, configuration) {
  const sourcePath = path.join(legacyRoot, sourceName);
  const source = await fs.readFile(sourcePath, 'utf8');
  const title = titleFrom(source, sourceName.replace(/\.md$/, ''));
  const normalizedSource = source.replace(/^#\s+.+$/m, `# ${title}`);
  const historicalBody = normalizedSource.replace(/^#\s+.+$(?:\r?\n)?/m, '').trim();
  const content = [
    frontmatter({ output: sourceName, title, status: configuration.status, owner: configuration.owner, source: `conductor/tracks/${sourceName}` }),
    `# ${title}`,
    '',
    '## Outcome',
    '',
    'Track existente consolidado. El outcome operativo se conserva en la especificación migrada y debe formalizarse en la próxima actualización del track.',
    '',
    '## Fases',
    '',
    'Las fases, checkpoints y tareas existentes se preservan en la especificación migrada.',
    '',
    '## Criterios de cierre',
    '',
    '- [ ] Formalizar criterios de cierre verificables durante la próxima actualización.',
    '- [ ] Obtener aprobación explícita del usuario antes de mover el track a `closed`.',
    '',
    '## Especificación migrada',
    '',
    historicalBody,
    '',
    '## Registro de migración',
    '',
    `- Consolidado en el sistema de tracks de un archivo el ${migrationDate}.`,
    '- El estado y owner iniciales fueron asignados por la política de migración aprobada.',
    '',
  ].join('\n');
  await fs.writeFile(path.join(TRACKS_ROOT, configuration.status, sourceName), content);
}

for (const status of ['planned', 'active', 'closed']) await fs.mkdir(path.join(TRACKS_ROOT, status), { recursive: true });
for (const [sourceName, configuration] of Object.entries(legacyTracks)) await migrateLegacy(sourceName, configuration);
for (const [sourceName, configuration] of Object.entries(modernTracks)) await migrateModern(sourceName, configuration);

console.log(`Migrated ${Object.keys(legacyTracks).length + Object.keys(modernTracks).length} tracks into ${TRACKS_ROOT}.`);
