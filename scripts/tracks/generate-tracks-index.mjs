import { promises as fs } from 'node:fs';
import path from 'node:path';
import { TRACKS_ROOT, TRACK_STATUSES, getTrackFiles, readTrack, toRelativeTrackPath } from './track-utils.mjs';

const labels = { planned: 'Planificados', active: 'En curso', closed: 'Cerrados' };
const grouped = Object.fromEntries(TRACK_STATUSES.map((status) => [status, []]));

for (const filePath of await getTrackFiles()) {
  const { metadata } = await readTrack(filePath);
  grouped[metadata.status].push({
    ...metadata,
    path: toRelativeTrackPath(filePath),
    blocked: metadata.blocked_by && metadata.blocked_by !== '[]' ? ' · bloqueado' : '',
  });
}

const sections = TRACK_STATUSES.map((status) => {
  const tracks = grouped[status].sort((left, right) => left.created.localeCompare(right.created));
  const lines = tracks.length === 0
    ? ['_Sin tracks._']
    : tracks.map((track) => {
      const branch = track.branch ? ` · \`${track.branch}\`` : '';
      return `- [${track.title}](${track.path.replace(/^tracks\//, './')}) · \`${track.owner}\`${branch}${track.blocked}`;
    });
  return `## ${labels[status]}\n\n${lines.join('\n')}`;
});

const output = [
  '# LoopDev Tracks',
  '',
  '> Archivo generado por `node scripts/tracks/generate-tracks-index.mjs`. No editar manualmente.',
  '',
  ...sections,
  '',
].join('\n');

await fs.mkdir(TRACKS_ROOT, { recursive: true });
await fs.writeFile(path.join(TRACKS_ROOT, 'README.md'), output);
console.log('Generated tracks/README.md.');
