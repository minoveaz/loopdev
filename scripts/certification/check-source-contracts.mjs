import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifestArgument = process.argv.find((argument) => argument.startsWith('--manifest='));
const manifestPath = manifestArgument
  ? path.resolve(root, manifestArgument.slice('--manifest='.length))
  : path.join(root, 'scripts/certification/source-contract-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const rules = {
  'raw-palette-class': /(?:bg|text|border)-(?:slate|gray|zinc|neutral|stone|red|blue|green|purple|orange|amber)-/i,
  'domain-copy': /CRM|Marketing Studio|Operations|pipeline|customer|contact|task/i,
  'default-visible-copy': /(?:placeholder|emptyMessage|title|closeLabel)\s*=\s*['"`]/,
  'hardcoded-data-array': /const\s+(?:commands|items|options|records|rows)\s*=\s*\[/,
  'raw-z-index': /zIndex\s*:\s*\d+|z-index\s*:\s*\d+/i,
  'inline-visual-style': /style\s*=\s*\{\{/,
};

function read(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(`${root}${path.sep}`)) throw new Error(`Path escapes repository: ${relativePath}`);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing source-contract path: ${relativePath}`);
  return fs.readFileSync(absolutePath, 'utf8');
}

function validateComponent(component) {
  const issues = [];
  for (const relativePath of [component.implementation, ...(component.sourceFiles ?? [])]) {
    const source = read(relativePath);
    for (const ruleName of component.forbiddenPatterns) {
      const rule = rules[ruleName];
      if (rule?.test(source)) issues.push(`${component.id}: ${ruleName} in ${relativePath}`);
    }
  }
  for (const fixturePath of component.fixturePaths ?? []) read(fixturePath);
  return issues;
}

const issues = manifest.components.flatMap(validateComponent);
if (issues.length > 0) {
  console.error(`Source-contract validation failed (${issues.length} issue${issues.length === 1 ? '' : 's'}):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Source-contract validation passed for ${manifest.components.length} component${manifest.components.length === 1 ? '' : 's'} (${manifest.policy}).`);