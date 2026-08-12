export const TRACK_STATUS_MARKER = '<!-- loopdev-track-status -->';
export const MANAGED_TRACK_LABEL = /^(domain:|track:|phase:|blocked$|tracks:changed$)/;

const trackPathPattern = /^tracks\/(?:(?:planned|active)\/[^/]+|closed\/\d{4})\/.*\.md$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isTrackPath(filePath) {
  return trackPathPattern.test(filePath);
}

export function parseTrackStatus(content, filePath) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) return null;

  const metadata = Object.fromEntries(
    frontmatter[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([a-z_]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^['"]|['"]$/g, '')]),
  );
  if (!slugPattern.test(metadata.id ?? '')) return null;
  if (!slugPattern.test(metadata.owner ?? '')) return null;
  if (!/^\d+$/.test(metadata.phase ?? '')) return null;

  return {
    id: metadata.id,
    owner: metadata.owner,
    phase: metadata.phase,
    status: metadata.status ?? 'unknown',
    blocked: Boolean(metadata.blocked_by && metadata.blocked_by !== '[]'),
    path: filePath,
  };
}

export function getTrackLabels(tracks, hasTrackChanges) {
  const labels = new Set(hasTrackChanges ? ['tracks:changed'] : []);
  for (const track of tracks) {
    labels.add(`domain:${track.owner}`);
    labels.add(`track:${track.id}`);
    labels.add(`phase:${track.phase}`);
    if (track.blocked) labels.add('blocked');
  }
  return labels;
}

export function buildTrackStatusComment(tracks, deletedPaths, headSha) {
  const rows =
    tracks.length === 0
      ? ['| No se pudo resolver metadata de tracks modificados | - | - | - |']
      : tracks.map(
          (track) =>
            `| [${track.id}](../blob/${headSha}/${track.path}) | ${track.owner} | ${track.phase} | ${track.status}${track.blocked ? ' · bloqueado' : ''} |`,
        );
  const deletedSection =
    deletedPaths.length === 0
      ? ''
      : `\n\n**Archivos de track eliminados:**\n${deletedPaths.map((filePath) => `- \`${filePath}\``).join('\n')}`;

  return [
    TRACK_STATUS_MARKER,
    '## LoopDev Track Status',
    '',
    '`Track validation` valida el inventario completo en este PR. Este resumen sincroniza labels desde el frontmatter de tracks modificados.',
    '',
    '| Track | Dominio | Fase | Estado |',
    '| --- | --- | --- | --- |',
    ...rows,
    deletedSection,
  ].join('\n');
}
