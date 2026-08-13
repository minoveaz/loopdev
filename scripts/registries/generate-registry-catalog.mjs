import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const indexPath = path.join(root, 'docs/registries/index.json');
const outputPath = path.join(root, 'docs/registries/REGISTRY_CATALOG.md');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return {
    relativePath,
    document: JSON.parse(fs.readFileSync(absolutePath, 'utf8')),
  };
}

function escapeCell(value) {
  return String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function validateRegistries(registries) {
  const entries = registries.flatMap(({ document }) => document.entries);
  const ids = new Set();

  for (const entry of entries) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate registry entry id: ${entry.id}`);
    }
    ids.add(entry.id);
  }

  for (const entry of entries) {
    for (const dependency of entry.dependencies ?? []) {
      if (!ids.has(dependency)) {
        throw new Error(`${entry.id} references unknown dependency: ${dependency}`);
      }
    }
  }

  return entries;
}

function renderCatalog(registries, entries) {
  const generatedAt = new Date().toISOString().slice(0, 10);
  const grouped = new Map();

  for (const entry of entries) {
    const domainEntries = grouped.get(entry.domain) ?? [];
    domainEntries.push(entry);
    grouped.set(entry.domain, domainEntries);
  }

  const lines = [
    '# LoopDev Registry Catalog',
    '',
    '> Generated file. Do not edit manually.',
    `> Generated on ${generatedAt} from \`docs/registries/index.json\`.`,
    '',
    'The domain registries are the sources of truth. This catalog is a read-only',
    'view for navigation, audits, and cross-domain discovery.',
    '',
    '## Summary',
    '',
    '| Domain | Entries |',
    '| --- | ---: |',
  ];

  for (const [domain, domainEntries] of [...grouped.entries()].sort()) {
    lines.push(`| ${domain} | ${domainEntries.length} |`);
  }

  lines.push(`| **Total** | **${entries.length}** |`, '', '## Entries', '');

  for (const [domain, domainEntries] of [...grouped.entries()].sort()) {
    lines.push(`### ${domain}`, '', '| ID | Name | Owner | Type | Status | Evidence gaps |', '| --- | --- | --- | --- | --- | --- |');
    for (const entry of domainEntries.sort((left, right) => left.id.localeCompare(right.id))) {
      const gaps = entry.evidence_gaps?.length ? entry.evidence_gaps.join(', ') : '—';
      lines.push(`| \`${escapeCell(entry.id)}\` | ${escapeCell(entry.name)} | ${escapeCell(entry.owner)} | ${escapeCell(entry.type)} | ${escapeCell(entry.status)} | ${escapeCell(gaps)} |`);
    }
    lines.push('');
  }

  lines.push('## Source registries', '');
  for (const { relativePath, document } of registries) {
    lines.push(`- [${relativePath}](./${path.posix.basename(relativePath)}) — ${document.entries.length} entries`);
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

const registries = index.registries
  .filter((registry) => registry.path.endsWith('.json'))
  .map((registry) => readJson(registry.path));
const entries = validateRegistries(registries);
const output = renderCatalog(registries, entries);

if (process.argv.includes('--check')) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
  if (current !== output) {
    console.error('Registry catalog is out of date. Run pnpm registries:generate.');
    process.exit(1);
  }
  console.log('Registry catalog is up to date.');
} else {
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${path.relative(root, outputPath)} from ${entries.length} entries.`);
}
