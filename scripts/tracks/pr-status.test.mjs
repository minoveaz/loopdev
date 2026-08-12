import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MANAGED_TRACK_LABEL,
  TRACK_STATUS_MARKER,
  buildTrackStatusComment,
  getTrackLabels,
  isTrackPath,
  parseTrackStatus,
} from './pr-status.mjs';

const trackContent = `---
id: crm-platform
title: CRM Platform
status: active
owner: crm
phase: 6
blocked_by: [provider-access]
---

# CRM Platform
`;

test('recognizes every lifecycle track path and excludes generated files', () => {
  assert.equal(isTrackPath('tracks/planned/crm/2026-08-12-crm.md'), true);
  assert.equal(isTrackPath('tracks/active/platform/2026-08-12-shell.md'), true);
  assert.equal(isTrackPath('tracks/closed/2026/2026-08-12-old.md'), true);
  assert.equal(isTrackPath('tracks/README.md'), false);
  assert.equal(isTrackPath('tracks/domains.md'), false);
});

test('parses label metadata and blocking state', () => {
  assert.deepEqual(parseTrackStatus(trackContent, 'tracks/active/crm/2026-08-12-crm.md'), {
    id: 'crm-platform',
    owner: 'crm',
    phase: '6',
    status: 'active',
    blocked: true,
    path: 'tracks/active/crm/2026-08-12-crm.md',
  });
});

test('rejects incomplete or unsafe metadata', () => {
  assert.equal(
    parseTrackStatus('---\nid: Invalid ID\nowner: crm\nphase: 1\n---\n', 'track.md'),
    null,
  );
  assert.equal(parseTrackStatus('no frontmatter', 'track.md'), null);
});

test('derives synchronized labels', () => {
  const track = parseTrackStatus(trackContent, 'tracks/active/crm/2026-08-12-crm.md');
  assert.deepEqual(
    [...getTrackLabels([track], true)],
    ['tracks:changed', 'domain:crm', 'track:crm-platform', 'phase:6', 'blocked'],
  );
  assert.equal(MANAGED_TRACK_LABEL.test('domain:crm'), true);
  assert.equal(MANAGED_TRACK_LABEL.test('manual-label'), false);
});

test('builds an idempotent status comment body', () => {
  const track = parseTrackStatus(trackContent, 'tracks/active/crm/2026-08-12-crm.md');
  const body = buildTrackStatusComment([track], ['tracks/planned/crm/old.md'], 'abc123');
  assert.match(body, new RegExp(TRACK_STATUS_MARKER));
  assert.match(body, /domain|Dominio/);
  assert.match(body, /crm-platform/);
  assert.match(body, /abc123/);
  assert.match(body, /old\.md/);
});
