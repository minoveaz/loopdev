import { promises as fs } from 'node:fs';
import path from 'node:path';
import { TRACKS_ROOT, TRACK_STATUSES, getDomains, getTrackFiles, readTrack, toRelativeTrackPath } from './track-utils.mjs';

const labels = { planned: 'Planificados', active: 'En curso', closed: 'Cerrados' };
const grouped = Object.fromEntries(TRACK_STATUSES.map((status) => [status, []]));
const domains = await getDomains();

for (const filePath of await getTrackFiles()) {
  const { metadata } = await readTrack(filePath);
  grouped[metadata.status].push({
    ...metadata,
    path: toRelativeTrackPath(filePath),
    blocked: metadata.blocked_by && metadata.blocked_by !== '[]' ? ' · bloqueado' : '',
  });
}

function trackLine(track) {
  const branch = track.branch ? ` · \`${track.branch}\`` : '';
  const phase = track.phase && track.phase !== 'null' ? ` · fase ${track.phase}` : '';
  return `- [${track.title}](${track.path.replace(/^tracks\//, './')})${branch}${phase}${track.blocked}`;
}

function domainLabel(domain) {
  if (domain === 'crm') return 'CRM';
  if (domain === 'ai-platform') return 'AI Platform';
  return domain.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

function groupedDomainSection(status) {
  const tracks = grouped[status].sort((left, right) => left.created.localeCompare(right.created));
  if (tracks.length === 0) return `## ${labels[status]}\n\n_Sin tracks._`;

  const byDomain = Object.fromEntries([...domains].map((domain) => [domain, []]));
  for (const track of tracks) byDomain[track.owner] ??= [], byDomain[track.owner].push(track);
  const groups = Object.entries(byDomain)
    .filter(([, domainTracks]) => domainTracks.length > 0)
    .map(([domain, domainTracks]) => `### ${domainLabel(domain)}\n\n${domainTracks.map(trackLine).join('\n')}`);
  return `## ${labels[status]}\n\n${groups.join('\n\n')}`;
}

function closedSection() {
  const tracks = grouped.closed.sort((left, right) => left.closed.localeCompare(right.closed));
  if (tracks.length === 0) return '## Cerrados\n\n_Sin tracks._';
  const byYear = {};
  for (const track of tracks) {
    const year = track.closed.slice(0, 4);
    (byYear[year] ??= []).push(track);
  }
  const groups = Object.entries(byYear)
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([year, yearTracks]) => `### ${year}\n\n${yearTracks.map(trackLine).join('\n')}`);
  return `## Cerrados\n\n${groups.join('\n\n')}`;
}

const sections = [groupedDomainSection('planned'), groupedDomainSection('active'), closedSection()];

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
