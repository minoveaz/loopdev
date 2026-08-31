import { readFileSync } from 'node:fs';
import path from 'node:path';

const catalogPath = path.resolve('config/validation-domain-catalog.json');

function loadDomainCatalog() {
  return JSON.parse(readFileSync(catalogPath, 'utf8'));
}

function domainForFile(file, catalog = loadDomainCatalog()) {
  const normalizedFile = file.replaceAll('\\', '/');
  return catalog.domains.find((domain) =>
    domain.paths.some(
      (domainPath) => normalizedFile === domainPath || normalizedFile.startsWith(domainPath),
    ),
  );
}

function domainForId(id, catalog = loadDomainCatalog()) {
  return catalog.domains.find((domain) => domain.id === id);
}

function packageNameFromManifest(domain, manifest) {
  const packageName = manifest?.name;
  if (!packageName)
    throw new Error(`Domain '${domain.id}' manifest '${domain.manifest}' has no package name`);
  return packageName;
}

export { domainForFile, domainForId, loadDomainCatalog, packageNameFromManifest };
