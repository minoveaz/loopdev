#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const requiredControls = ['lint', 'typecheck', 'unit', 'build'];

function validateControl(control, label) {
  if (!control || typeof control !== 'object') return [`${label} is required`];
  const keys = ['script', 'command', 'notApplicable'].filter(
    (key) => typeof control[key] === 'string' && control[key].trim(),
  );
  return keys.length === 1
    ? []
    : [`${label} must declare exactly one of script, command, or notApplicable`];
}

function pathsOverlap(first, second) {
  return first === second || first.startsWith(second) || second.startsWith(first);
}

function validateDomainCatalog(catalog, manifests = {}, applicationManifests = []) {
  const errors = [];
  if (catalog?.version !== 1) errors.push('version must be 1');
  if (!Array.isArray(catalog?.domains) || catalog.domains.length === 0) {
    errors.push('domains must contain at least one entry');
    return errors;
  }
  if (!Array.isArray(catalog?.protectedSurfaces)) errors.push('protectedSurfaces must be an array');

  const ids = new Set();
  const domainPaths = [];
  const manifestsInCatalog = new Set();
  for (const domain of catalog.domains) {
    const label = `domain '${domain?.id ?? 'unknown'}'`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(domain?.id ?? ''))
      errors.push(`${label} has an invalid id`);
    if (ids.has(domain?.id)) errors.push(`${label} is duplicated`);
    ids.add(domain?.id);
    if (!domain?.owner?.trim()) errors.push(`${label}.owner is required`);
    if (!Array.isArray(domain?.paths) || domain.paths.length === 0)
      errors.push(`${label}.paths is required`);
    if (domain?.manifest !== 'package.json' && !domain?.manifest?.endsWith('/package.json'))
      errors.push(`${label}.manifest must reference package.json`);
    manifestsInCatalog.add(domain?.manifest);
    for (const domainPath of domain?.paths ?? []) {
      if (typeof domainPath !== 'string' || !domainPath.endsWith('/'))
        errors.push(`${label} path '${domainPath}' must end with /`);
      domainPaths.push({ id: domain.id, path: domainPath });
    }
    for (const controlName of requiredControls) {
      errors.push(
        ...validateControl(domain?.controls?.[controlName], `${label}.controls.${controlName}`),
      );
      const script = domain?.controls?.[controlName]?.script;
      if (script && !manifests[domain.manifest]?.scripts?.[script]) {
        errors.push(`${label} declares missing package script '${script}'`);
      }
    }
    if (domain.routing) {
      for (const field of ['frontend', 'mobile', 'packageImpact']) {
        if (field in domain.routing && typeof domain.routing[field] !== 'boolean') {
          errors.push(`${label}.routing.${field} must be boolean`);
        }
      }
      if (
        domain.routing.packageRule !== undefined &&
        (typeof domain.routing.packageRule !== 'string' || !domain.routing.packageRule.trim())
      ) {
        errors.push(`${label}.routing.packageRule must be a non-empty string`);
      }
      if (domain.routing.advisory !== undefined && typeof domain.routing.advisory !== 'boolean') {
        errors.push(`${label}.routing.advisory must be boolean`);
      }
      if (
        domain.routing.packageImpact !== undefined &&
        typeof domain.routing.packageImpact !== 'boolean'
      ) {
        errors.push(`${label}.routing.packageImpact must be boolean`);
      }
      if (
        domain.routing.planDomain !== undefined &&
        (typeof domain.routing.planDomain !== 'string' || !domain.routing.planDomain.trim())
      ) {
        errors.push(`${label}.routing.planDomain must be a non-empty string`);
      }
      if (
        domain.routing.excludePaths !== undefined &&
        (!Array.isArray(domain.routing.excludePaths) ||
          domain.routing.excludePaths.some((excludedPath) => typeof excludedPath !== 'string'))
      ) {
        errors.push(`${label}.routing.excludePaths must be an array of paths`);
      }
    }
  }

  for (let index = 0; index < domainPaths.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < domainPaths.length; otherIndex += 1) {
      const first = domainPaths[index];
      const second = domainPaths[otherIndex];
      if (first.id !== second.id && pathsOverlap(first.path, second.path)) {
        errors.push(`domain paths overlap: '${first.id}' and '${second.id}'`);
      }
    }
  }

  for (const manifest of applicationManifests) {
    if (!manifestsInCatalog.has(manifest))
      errors.push(`application manifest '${manifest}' has no domain entry`);
  }

  for (const surface of catalog?.protectedSurfaces ?? []) {
    const label = `protected surface '${surface?.id ?? 'unknown'}'`;
    if (surface?.owner !== 'platform') errors.push(`${label} must be owned by platform`);
    if (!Array.isArray(surface?.paths) || surface.paths.length === 0)
      errors.push(`${label}.paths is required`);
  }

  return errors;
}

function loadManifests(repositoryRoot, catalog) {
  return Object.fromEntries(
    catalog.domains.map((domain) => [
      domain.manifest,
      JSON.parse(readFileSync(path.join(repositoryRoot, domain.manifest), 'utf8')),
    ]),
  );
}

function applicationManifests(repositoryRoot) {
  const appsDirectory = path.join(repositoryRoot, 'apps');
  return readdirSync(appsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `apps/${entry.name}/package.json`)
    .filter((manifest) => {
      try {
        readFileSync(path.join(repositoryRoot, manifest), 'utf8');
        return true;
      } catch {
        return false;
      }
    });
}

function main() {
  const repositoryRoot = process.cwd();
  const catalog = JSON.parse(
    readFileSync(path.join(repositoryRoot, 'config/validation-domain-catalog.json'), 'utf8'),
  );
  const errors = validateDomainCatalog(
    catalog,
    loadManifests(repositoryRoot, catalog),
    applicationManifests(repositoryRoot),
  );
  if (errors.length > 0) {
    console.error(`Domain catalog validation failed:\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Domain catalog validation passed for ${catalog.domains.length} domains and ${catalog.protectedSurfaces.length} protected surfaces.`,
  );
}

export { validateDomainCatalog };

if (process.argv[1]?.endsWith('validate-domain-catalog.mjs')) main();
