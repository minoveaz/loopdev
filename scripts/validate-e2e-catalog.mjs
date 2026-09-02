#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const profiles = new Set([
  'smoke',
  'functional',
  'domain',
  'component',
  'accessibility',
  'visual',
  'responsive',
  'diagnostic',
  'contract',
]);

function validateE2eCatalog(catalog, availableFiles = []) {
  const errors = [];
  if (catalog?.version !== 1) errors.push('version must be 1');
  if (!Array.isArray(catalog?.projects) || catalog.projects.length === 0)
    errors.push('projects must contain at least one project');
  if (!Array.isArray(catalog?.specs) || catalog.specs.length === 0) {
    errors.push('specs must contain at least one entry');
    return errors;
  }

  const knownProjects = new Set(catalog.projects ?? []);
  const knownFiles = new Set(availableFiles);
  const assigned = new Set();
  for (const spec of catalog.specs) {
    const label = `spec '${spec?.file ?? 'unknown'}'`;
    if (!spec?.file?.endsWith('.spec.mjs')) errors.push(`${label} must be a Playwright spec`);
    if (!spec?.domain?.trim()) errors.push(`${label}.domain is required`);
    if (!profiles.has(spec?.profile)) errors.push(`${label}.profile is invalid`);
    if (!Array.isArray(spec?.projects) || spec.projects.length === 0)
      errors.push(`${label}.projects is required`);
    if (assigned.has(spec?.file)) errors.push(`${label} is duplicated`);
    assigned.add(spec?.file);
    if (knownFiles.size > 0 && !knownFiles.has(spec.file))
      errors.push(`${label} is missing from e2e/`);
    for (const project of spec?.projects ?? []) {
      if (!knownProjects.has(project))
        errors.push(`${label} references unknown project '${project}'`);
    }
  }
  for (const file of knownFiles) {
    if (!assigned.has(file)) errors.push(`E2E spec '${file}' has no catalog entry`);
  }
  return errors;
}

function availableE2eFiles(repositoryRoot = process.cwd()) {
  return readdirSync(path.join(repositoryRoot, 'e2e'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.spec.mjs'))
    .map((entry) => entry.name)
    .sort();
}

function specsForProfile(profile, catalog = loadE2eCatalog()) {
  return catalog.specs.filter((spec) => spec.profile === profile);
}

function specsForDomain(domain, catalog = loadE2eCatalog()) {
  return catalog.specs.filter((spec) => spec.domain === domain);
}

function loadE2eCatalog(repositoryRoot = process.cwd()) {
  return JSON.parse(
    readFileSync(path.join(repositoryRoot, 'config/e2e-validation-catalog.json'), 'utf8'),
  );
}

function main() {
  const root = process.cwd();
  const catalog = loadE2eCatalog(root);
  const errors = validateE2eCatalog(catalog, availableE2eFiles(root));
  if (errors.length > 0) {
    console.error(`E2E catalog validation failed:\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `E2E catalog validation passed for ${catalog.specs.length} specs and ${catalog.projects.length} projects.`,
  );
}

export { availableE2eFiles, loadE2eCatalog, specsForDomain, specsForProfile, validateE2eCatalog };

if (process.argv[1]?.endsWith('validate-e2e-catalog.mjs')) main();
