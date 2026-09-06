import assert from 'node:assert/strict';
import test from 'node:test';
import { renderCatalog } from './generate-registry-catalog.mjs';

const registries = [{ relativePath: 'docs/registries/example.json', document: { entries: [] } }];
const entry = {
  id: 'example.control',
  name: 'Example control',
  owner: 'platform',
  type: 'control',
  status: 'ready',
};

test('catalog output is deterministic when registry entries do not change', () => {
  assert.equal(renderCatalog(registries, [entry]), renderCatalog(registries, [entry]));
  assert.doesNotMatch(renderCatalog(registries, [entry]), /Generated on \d{4}-\d{2}-\d{2}/);
});

test('catalog output changes when a registry entry changes', () => {
  const changedEntry = { ...entry, status: 'deprecated' };

  assert.notEqual(renderCatalog(registries, [entry]), renderCatalog(registries, [changedEntry]));
});

test('catalog output is independent of the current date', () => {
  const output = renderCatalog(registries, [entry]);

  assert.doesNotMatch(output, /Generated on/);
  assert.match(output, /> Generated from `docs\/registries\/index\.json`\./);
});