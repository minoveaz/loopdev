import path from 'node:path';
import { REQUIRED_FIELDS, TRACK_STATUSES, getDomains, getTrackFiles, readTrack, toRelativeTrackPath } from './track-utils.mjs';

const errors = [];
const ids = new Map();
const filenamePattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const domains = await getDomains();

for (const filePath of await getTrackFiles()) {
  const relativePath = toRelativeTrackPath(filePath);
  const relativeSegments = relativePath.split('/');
  const directoryStatus = relativeSegments[1];
  const domainOrYear = relativeSegments[2];
  const parsed = await readTrack(filePath);

  if (!parsed.metadata) {
    errors.push(`${relativePath}: missing YAML frontmatter`);
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed.metadata)) errors.push(`${relativePath}: missing required field '${field}'`);
  }
  if (!filenamePattern.test(path.basename(filePath))) errors.push(`${relativePath}: filename must use YYYY-MM-DD-slug.md`);
  if (!TRACK_STATUSES.includes(parsed.metadata.status)) errors.push(`${relativePath}: invalid status '${parsed.metadata.status}'`);
  if (parsed.metadata.status !== directoryStatus) errors.push(`${relativePath}: status '${parsed.metadata.status}' does not match directory '${directoryStatus}'`);
  if (!domains.has(parsed.metadata.owner)) errors.push(`${relativePath}: owner '${parsed.metadata.owner}' is not a canonical domain`);
  if (parsed.metadata.status === 'closed') {
    if (!/^\d{4}$/.test(domainOrYear)) errors.push(`${relativePath}: closed tracks must use tracks/closed/<year>/`);
    if (!parsed.metadata.closed) errors.push(`${relativePath}: closed tracks require a closed date`);
    if (parsed.metadata.closed && !parsed.metadata.closed.startsWith(domainOrYear)) errors.push(`${relativePath}: closure year does not match directory '${domainOrYear}'`);
  } else if (domainOrYear !== parsed.metadata.owner) {
    errors.push(`${relativePath}: owner '${parsed.metadata.owner}' does not match domain directory '${domainOrYear}'`);
  }
  if (parsed.metadata.status === 'active' && parsed.metadata.branch === null && parsed.metadata.branches === '[]' && !parsed.body.includes('## Branch strategy')) {
    errors.push(`${relativePath}: active tracks require branch or documented multi-branch strategy`);
  }
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
