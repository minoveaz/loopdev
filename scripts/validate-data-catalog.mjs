#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

function validateDataCatalog(catalog, availableFiles = []) {
  const errors = [];
  if (catalog?.version !== 1) errors.push('version must be 1');
  if (!catalog?.root?.trim()) errors.push('root is required');
  if (!catalog?.domains || typeof catalog.domains !== 'object' || Array.isArray(catalog.domains)) {
    errors.push('domains must be an object');
    return errors;
  }

  const knownFiles = new Set(availableFiles);
  const nonTestFiles = new Set(Object.keys(catalog.nonTestFiles ?? {}));
  const assigned = new Map();
  for (const [domain, files] of Object.entries(catalog.domains)) {
    if (!Array.isArray(files)) {
      errors.push(`domain '${domain}' must contain an array`);
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.sql')) errors.push(`domain '${domain}' has non-SQL file '${file}'`);
      if (knownFiles.size > 0 && !knownFiles.has(file))
        errors.push(`domain '${domain}' references missing SQL '${file}'`);
      if (assigned.has(file))
        errors.push(`SQL '${file}' is assigned to both '${assigned.get(file)}' and '${domain}'`);
      assigned.set(file, domain);
    }
  }

  for (const file of knownFiles) {
    if (!assigned.has(file) && !nonTestFiles.has(file))
      errors.push(`SQL '${file}' has no data domain`);
  }
  for (const file of nonTestFiles) {
    if (!knownFiles.has(file)) errors.push(`non-test SQL '${file}' does not exist`);
    if (assigned.has(file))
      errors.push(`non-test SQL '${file}' cannot also be assigned to a domain`);
  }
  return errors;
}

function availableSqlFiles(
  repositoryRoot = process.cwd(),
  catalog = loadDataCatalog(repositoryRoot),
) {
  return readdirSync(path.join(repositoryRoot, catalog.root), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();
}

function loadDataCatalog(repositoryRoot = process.cwd()) {
  return JSON.parse(
    readFileSync(path.join(repositoryRoot, 'config/validation-data-catalog.json'), 'utf8'),
  );
}

function main() {
  const repositoryRoot = process.cwd();
  const catalog = loadDataCatalog(repositoryRoot);
  const availableFiles = availableSqlFiles(repositoryRoot, catalog);
  const errors = validateDataCatalog(catalog, availableFiles);
  if (errors.length > 0) {
    console.error(`Data catalog validation failed:\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Data catalog validation passed for ${availableFiles.length} SQL tests across ${Object.keys(catalog.domains).length} domains.`,
  );
}

export { availableSqlFiles, validateDataCatalog };

if (process.argv[1]?.endsWith('validate-data-catalog.mjs')) main();
