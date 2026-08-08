import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appSource = path.join(root, 'apps/loopdev-os/src');
const supportedRoots = new Set(['app', 'components', 'core', 'lib', 'services']);
const uncovered = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      visit(entryPath);
      continue;
    }

    if (!/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }

    const relativePath = path.relative(appSource, entryPath).split(path.sep);
    const sourceRoot = relativePath[0];

    if (supportedRoots.has(sourceRoot)) {
      continue;
    }

    if (relativePath.slice(0, 4).join('/') === 'suites/marketing-studio/brand-hub/components') {
      continue;
    }

    uncovered.push(path.relative(root, entryPath));
  }
}

visit(appSource);

if (uncovered.length > 0) {
  console.error('Tests outside a configured Vitest project:');
  for (const file of uncovered) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('All loopdev-os tests belong to a configured Vitest project.');
