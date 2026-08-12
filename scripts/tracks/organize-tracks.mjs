import { promises as fs } from 'node:fs';
import path from 'node:path';
import { TRACKS_ROOT, getTrackFiles, readTrack } from './track-utils.mjs';

const ownerAliases = {
  'sales-crm': 'crm',
  marketing: 'marketing-studio',
};

const activeConfiguration = {
  'loopdev-saas-platform-upgrade': {
    branch: null,
    branches: '[feature/loopdev-saas-platform-fase-5d, feature/crm-core-fase-6a]',
    phase: '6',
    strategy: 'Este programa transversal se ejecuta por fases y ramas especializadas. Las ramas activas se declaran en `branches` y cada fase debe registrar su rama y evidencia antes de cerrarse.',
  },
  'loopdev-frontend-quality-system': {
    branch: null,
    branches: '[feature/frontend-work3]',
    phase: '1',
    strategy: 'El sistema de calidad se ejecuta por oleadas de certificación. Las ramas de cada oleada se registran en `branches` y la fase correspondiente conserva su evidencia.',
  },
  'mobile-app-foundation': {
    branch: null,
    branches: '[]',
    phase: '1',
    strategy: 'La fundación móvil es un programa transversal. No hay una rama única vigente; cada fase debe declarar su rama de implementación antes de iniciar cambios de código.',
  },
};

function updateFrontmatter(content, changes) {
  return content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (whole, source) => {
    const lines = source.split(/\r?\n/);
    const remaining = new Map(Object.entries(changes));
    const updated = lines.map((line) => {
      const match = line.match(/^([a-z_]+):/);
      if (!match || !remaining.has(match[1])) return line;
      const key = match[1];
      const value = remaining.get(key);
      remaining.delete(key);
      return `${key}: ${value}`;
    });
    for (const [key, value] of remaining) updated.push(`${key}: ${value}`);
    return `---\n${updated.join('\n')}\n---`;
  });
}

function addBranchStrategy(content, strategy) {
  if (!strategy || content.includes('## Branch strategy')) return content;
  return content.replace('## Fases', `## Branch strategy\n\n${strategy}\n\n## Fases`);
}

for (const filePath of await getTrackFiles()) {
  const { metadata, content } = await readTrack(filePath);
  const status = metadata.status;
  const owner = ownerAliases[metadata.owner] ?? metadata.owner;
  const configuration = activeConfiguration[metadata.id];
  const changes = {
    owner,
    lead: metadata.lead ?? 'null',
    branch: configuration?.branch === null ? 'null' : (metadata.branch ?? 'null'),
    branches: configuration?.branches ?? (metadata.branches ?? '[]'),
    phase: configuration?.phase ?? (metadata.phase ?? '0'),
    pull_requests: metadata.pull_requests ?? '[]',
    issues: metadata.issues ?? '[]',
    packages: metadata.packages ?? '[]',
    release: metadata.release ?? 'not-required',
  };

  if (status === 'closed') changes.closed = metadata.closed ?? '2026-08-12';
  let normalized = updateFrontmatter(content, changes);
  normalized = addBranchStrategy(normalized, configuration?.strategy);

  const destinationDirectory = status === 'closed'
    ? path.join(TRACKS_ROOT, 'closed', changes.closed.slice(0, 4))
    : path.join(TRACKS_ROOT, status, owner);
  const destinationPath = path.join(destinationDirectory, path.basename(filePath));
  await fs.mkdir(destinationDirectory, { recursive: true });
  await fs.writeFile(destinationPath, normalized, 'utf8');
  if (path.resolve(destinationPath) !== path.resolve(filePath)) await fs.unlink(filePath);
}

for (const status of ['planned', 'active', 'closed']) {
  const directory = path.join(TRACKS_ROOT, status);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory() && (await fs.readdir(entryPath)).length === 0) await fs.rmdir(entryPath);
  }
}

console.log('Organized tracks by canonical domain and closure year.');
