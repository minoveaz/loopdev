#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const baseUrl = process.env.CRM_BACKEND_BASE_URL ?? 'http://127.0.0.1:3001';
const fixturePath =
  process.env.CRM_BACKEND_BOOTSTRAP_OUTPUT ?? '/tmp/loopdev-crm-backend-bootstrap.json';
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
function headersFor(prefix = '') {
  const tokenFields = prefix
    ? {
        access: 'viewerAccessToken',
        refresh: 'viewerRefreshToken',
        expiresAt: 'viewerExpiresAt',
        expiresIn: 'viewerExpiresIn',
      }
    : {
        access: 'accessToken',
        refresh: 'refreshToken',
        expiresAt: 'expiresAt',
        expiresIn: 'expiresIn',
      };
  const authCookie = `sb-127-auth-token=base64-${Buffer.from(
    JSON.stringify({
      access_token: fixture[tokenFields.access],
      refresh_token: fixture[tokenFields.refresh],
      expires_at: fixture[tokenFields.expiresAt],
      expires_in: fixture[tokenFields.expiresIn],
      token_type: 'bearer',
    }),
  ).toString('base64url')}`;
  return { cookie: authCookie, 'Content-Type': 'application/json' };
}
const headers = headersFor();
const organization = fixture.organizationId;
const workspace = fixture.workspaceId;

async function responseBody(response) {
  const body = await response.json().catch(() => null);
  assert.ok(response.ok, `${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const stages = await responseBody(
  await fetch(`${baseUrl}/api/crm/pipeline/stages?organizationId=${organization}`, { headers }),
);
assert.ok(stages.some((stage) => stage.terminalType === 'open'));

const payload = {
  organizationId: organization,
  workspaceId: workspace,
  contactId: '00000000-0000-4000-a100-000000000001',
  productKey: `http-${Date.now()}`,
  name: 'CRM backend HTTP integration',
  idempotencyKey: `http-${Date.now()}-idempotency`,
};
const first = await responseBody(
  await fetch(`${baseUrl}/api/crm/opportunities`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }),
);
const retry = await responseBody(
  await fetch(`${baseUrl}/api/crm/opportunities`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }),
);
assert.equal(retry.id, first.id);

const page = await responseBody(
  await fetch(
    `${baseUrl}/api/crm/opportunities?organizationId=${organization}&workspaceId=${workspace}`,
    { headers },
  ),
);
assert.ok(page.items.some((item) => item.id === first.id));

const moved = await responseBody(
  await fetch(`${baseUrl}/api/crm/opportunities/${first.id}/stage`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      organizationId: organization,
      stageKey: 'won',
      expectedVersion: first.version,
      origin: 'record',
    }),
  }),
);
assert.equal(moved.stageKey, 'won');

const reopened = await responseBody(
  await fetch(`${baseUrl}/api/crm/opportunities/${first.id}/reopen`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      organizationId: organization,
      targetStageKey: 'qualified',
      expectedVersion: moved.version,
      reason: 'Integration test reopen',
    }),
  }),
);
assert.equal(reopened.stageKey, 'qualified');

const updated = await responseBody(
  await fetch(`${baseUrl}/api/crm/opportunities/${first.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      organizationId: organization,
      name: 'CRM backend HTTP integration updated',
      expectedVersion: reopened.version,
    }),
  }),
);
assert.equal(updated.version, reopened.version + 1);

const conflict = await fetch(`${baseUrl}/api/crm/opportunities/${first.id}`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({
    organizationId: organization,
    name: 'Stale update',
    expectedVersion: reopened.version,
  }),
});
assert.equal(conflict.status, 409);

const viewerResponse = await fetch(`${baseUrl}/api/crm/opportunities`, {
  method: 'POST',
  headers: headersFor('viewer'),
  body: JSON.stringify(payload),
});
assert.equal(viewerResponse.status, 403);
console.log('CRM backend authenticated HTTP checks passed');
