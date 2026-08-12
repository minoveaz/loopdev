import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const failures = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = walk(sourceRoot).filter((path) => /\.(ts|tsx)$/.test(path));
const appEntry = join(root, 'App.tsx');

if (readFileSync(appEntry, 'utf8').split(/\r?\n/).length > 5) {
  failures.push('App.tsx debe permanecer como una entrada de máximo 5 líneas.');
}

for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  const displayPath = relative(root, file).split(sep).join('/');

  if (displayPath.includes('/components/') && /features\//.test(content)) {
    failures.push(`${displayPath} no puede depender de features.`);
  }

  if (displayPath.includes('/theme/') && /(features|components)\//.test(content)) {
    failures.push(`${displayPath} no puede depender de features ni components.`);
  }

  if (displayPath.includes('/features/') && /from ['"]\.\.\/\.\.\/\.\.\/data\/(?!adapters\/|contracts\/|home-data)/.test(content)) {
    failures.push(`${displayPath} debe consumir datos desde su feature o un adaptador, no desde src/data directamente.`);
  }
}

const requiredDirectories = [
  'src/app',
  'src/components/ui',
  'src/features/auth',
  'src/features/home',
  'src/data/adapters/fixtures',
  'src/theme',
];

for (const directory of requiredDirectories) {
  if (!existsSync(join(root, directory)) || !statSync(join(root, directory)).isDirectory()) {
    failures.push(`Falta la frontera estructural ${directory}.`);
  }
}

if (failures.length > 0) {
  console.error('Mobile structure check failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Mobile structure check passed.');