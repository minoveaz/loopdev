import path from 'node:path';
import { REQUIRED_FIELDS, TRACK_STATUSES, getTrackFiles, readTrack, toRelativeTrackPath } from './track-utils.mjs';

const errors = [];
const ids = new Map();
const filenamePattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

for (const filePath of await getTrackFiles()) {
  const relativePath = toRelativeTrackPath(filePath);
  const directoryStatus = path.basename(path.dirname(filePath));
  const parsed = await readTrack(filePath);

  if (!parsed.metadata) {
    errors.push(`${relativePath}: missing YAML frontmatter`);
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!parsed.metadata[field]) errors.push(`${relativePath}: missing required field '${field}'`);
  }
  if (!filenamePattern.test(path.basename(filePath))) errors.push(`${relativePath}: filename must use YYYY-MM-DD-slug.md`);
  if (!TRACK_STATUSES.includes(parsed.metadata.status)) errors.push(`${relativePath}: invalid status '${parsed.metadata.status}'`);
  if (parsed.metadata.status !== directoryStatus) errors.push(`${relativePath}: status '${parsed.metadata.status}' does not match directory '${directoryStatus}'`);
  if (ids.has(parsed.metadata.id)) errors.push(`${relativePath}: duplicate id '${parsed.metadata.id}' also used by ${ids.get(parsed.metadata.id)}`);
  ids.set(parsed.metadata.id, relativePath);
  if (!parsed.body.startsWith(`# ${parsed.metadata.title}`)) errors.push(`${relativePath}: H1 must match metadata title`);
  if (!parsed.body.includes('## Fases')) errors.push(`${relativePath}: missing required '## Fases' section`);
  if (!parsed.body.includes('## Criterios de cierre')) errors.push(`${relativePath}: missing required '## Criterios de cierre' section`);
}

if (errors.length > 0) {
  console.error('Track validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Track validation passed.');
}
