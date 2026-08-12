import { promises as fs } from 'node:fs';
import path from 'node:path';

export const TRACKS_ROOT = path.resolve('tracks');
export const TRACK_STATUSES = ['planned', 'active', 'closed'];
export const REQUIRED_FIELDS = ['id', 'title', 'status', 'created', 'updated', 'owner'];

export async function getTrackFiles() {
  const files = [];
  for (const status of TRACK_STATUSES) {
    const directory = path.join(TRACKS_ROOT, status);
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) files.push(path.join(directory, entry.name));
    }
  }
  return files.sort();
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!field) continue;
    const [, key, rawValue] = field;
    metadata[key] = rawValue === 'null' ? null : rawValue.replace(/^['"]|['"]$/g, '');
  }
  return { metadata, body: content.slice(match[0].length).replace(/^\r?\n/, '') };
}

export async function readTrack(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  return { filePath, content, ...parsed };
}

export function toRelativeTrackPath(filePath) {
  return path.relative(process.cwd(), filePath).replaceAll('\\', '/');
}
