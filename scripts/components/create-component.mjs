import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1] || null;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function fail(message) {
  console.error(`component:new: ${message}`);
  process.exitCode = 1;
}

const name = option('name');
const type = option('type');
const category = option('category');
const suite = option('suite');
const duplicateReview = option('duplicate-review');
const write = hasFlag('write');

const types = new Set(['atom', 'composite', 'shell', 'workspace', 'entity', 'feature', 'widget']);
const sharedTypes = new Set(['atom', 'composite', 'shell', 'workspace']);
const validName = /^[A-Z][A-Za-z0-9]*$/;
const validSegment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function resolveInsideRoot(value, label) {
  const resolved = path.resolve(root, value);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    fail(`${label} must stay inside the repository`);
    return null;
  }
  return resolved;
}

if (!name || !type || !category) {
  fail('usage: pnpm component:new --name <PascalCase> --type <type> --category <category> [--suite <path>] [--write]');
} else if (!validName.test(name)) {
  fail('name must be PascalCase and contain only letters and numbers');
} else if (!types.has(type)) {
  fail(`type must be one of: ${[...types].join(', ')}`);
} else if (!sharedTypes.has(type) && !suite) {
  fail(`--suite is required for ${type} components`);
} else if (!validSegment.test(category)) {
  fail('category must be lowercase kebab-case');
} else {
  const registryPath = path.join(root, 'docs/registries/frontend-components.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const normalized = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const entries = registry.entries || [];
  const registryMatches = entries.filter((entry) => {
    const entryName = String(entry.name || '');
    const entryId = String(entry.id || '');
    return entryName.toLowerCase() === name.toLowerCase()
      || entryId.includes(normalized)
      || entryName.toLowerCase().includes(normalized.replaceAll('-', ' '));
  });

  const sharedLayer = type === 'atom' ? 'atoms'
    : type === 'shell' ? path.join('composites', 'shell')
      : type === 'workspace' ? path.join('composites', 'workspace')
        : 'composites';
  const suiteRoot = sharedTypes.has(type) ? root : resolveInsideRoot(suite, 'suite');
  const reviewPath = duplicateReview ? resolveInsideRoot(duplicateReview, 'duplicate review') : null;
  if (!suiteRoot) process.exitCode = 1;
  else if (duplicateReview && !reviewPath) process.exitCode = 1;
  else if (duplicateReview && !fs.existsSync(reviewPath)) fail(`duplicate review does not exist: ${duplicateReview}`);
  else {
    const base = sharedTypes.has(type)
      ? path.join(root, 'ds/packages/ui/src/components', sharedLayer, category, name)
      : path.join(suiteRoot, type === 'entity' ? 'entities' : `${type}s`, name);
    const relativeBase = path.relative(root, base);
    const existing = fs.existsSync(base);

    console.log(`Component inventory: ${name}`);
    console.log(`- type: ${type}`);
    console.log(`- category: ${category}`);
    console.log(`- route: ${relativeBase}`);
    console.log(`- registry matches: ${registryMatches.length}`);

    if (registryMatches.length > 0 && !duplicateReview) {
    console.log('Duplicate review required. Existing registry candidates:');
    for (const entry of registryMatches) console.log(`- ${entry.id}: ${entry.implementation || 'no implementation'}`);
    process.exitCode = 2;
    } else if (registryMatches.length > 0 && !fs.readFileSync(reviewPath, 'utf8').match(/\b(reuse|variant|compose|create)\b/i)) {
    fail('duplicate review must record a reuse, variant, compose, or create decision');
    } else if (existing) {
    fail(`target already exists: ${relativeBase}`);
    } else if (!write) {
    console.log('No files created. Review references and rerun with --write after approval.');
    } else {
    const files = {
      'index.tsx': `import type { ${name}Props } from './types';\n\nexport function ${name}(_props: ${name}Props) {\n  return null;\n}\n\nexport type { ${name}Props } from './types';\n`,
      'types.ts': `export interface ${name}Props {\n  // Define the approved public contract.\n}\n`,
      [`${name}.test.tsx`]: `import { describe, expect, it } from 'vitest';\n\nimport { ${name} } from './index';\n\ndescribe('${name}', () => {\n  it('has an implementation contract', () => {\n    expect(${name}).toBeDefined();\n  });\n});\n`,
    };
    fs.mkdirSync(base, { recursive: true });
    for (const [file, content] of Object.entries(files)) fs.writeFileSync(path.join(base, file), content);
    console.log(`Created scaffold at ${relativeBase}`);
    console.log('Registry entry and implementation must be completed before certification.');
    }
  }
}
