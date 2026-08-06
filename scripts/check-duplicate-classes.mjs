import fs from 'node:fs';
import path from 'node:path';

const roots = ['apps', 'ds', 'modules', 'packages'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const matches = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (extensions.has(path.extname(entry.name))) inspect(absolute);
  }
}

function inspect(file) {
  const source = fs.readFileSync(file, 'utf8');
  const pattern = /(?:className|classNames?)\s*=\s*["'`]([^"'`\n]+)["'`]/g;
  for (const match of source.matchAll(pattern)) {
    const classes = match[1].trim().split(/\s+/).filter(Boolean);
    const duplicates = classes.filter((name, index) => classes.indexOf(name) !== index);
    if (duplicates.length > 0) {
      const line = source.slice(0, match.index).split('\n').length;
      matches.push(
        `${path.relative(process.cwd(), file)}:${line} repeated class(es): ${[...new Set(duplicates)].join(', ')}`,
      );
    }
  }
}

for (const root of roots) walk(root);

if (matches.length > 0) {
  console.error(matches.join('\n'));
  process.exitCode = 1;
} else {
  console.log('No repeated static class names found.');
}
