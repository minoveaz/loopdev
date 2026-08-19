#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DB_URL;
const outputPath =
  process.env.CRM_BACKEND_BOOTSTRAP_OUTPUT ?? '/tmp/loopdev-crm-backend-bootstrap.json';

if (!anonKey || !dbUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_DB_URL are required');
}

function runPsql(args, options = {}) {
  try {
    return execFileSync('psql', [dbUrl, ...args], options);
  } catch (error) {
    if (error.code !== 'ENOENT' || !process.env.SUPABASE_DB_CONTAINER) throw error;
    return execFileSync(
      'docker',
      [
        'exec',
        process.env.SUPABASE_DB_CONTAINER,
        'psql',
        '-U',
        'postgres',
        '-d',
        'postgres',
        ...args,
      ],
      options,
    );
  }
}

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `crm-backend-${suffix}@example.test`;
const viewerEmail = `crm-backend-viewer-${suffix}@example.test`;
const password = `CrmBackend!${suffix}`;
const headers = { apikey: anonKey, 'Content-Type': 'application/json' };

async function createSession(userEmail) {
  const signupResponse = await fetch(`${apiUrl}/auth/v1/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: userEmail, password }),
  });
  const signup = await signupResponse.json();
  if (!signupResponse.ok || !signup.user?.id) {
    throw new Error(`Unable to create CRM integration user: ${JSON.stringify(signup)}`);
  }
  const tokenResponse = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: userEmail, password }),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || !token.access_token) {
    throw new Error(`Unable to authenticate CRM integration user: ${JSON.stringify(token)}`);
  }
  return { userId: signup.user.id, token };
}

const owner = await createSession(email);
const viewer = await createSession(viewerEmail);
const sql = `
insert into public.organization_memberships (organization_id, user_id, role, status)
select id, members.user_id, members.role, 'active'
from public.organizations
cross join (values
  ('${owner.userId}'::uuid, 'owner'::text),
  ('${viewer.userId}'::uuid, 'viewer'::text)
) as members(user_id, role)
where slug = 'estar-protegidos'
on conflict (organization_id, user_id)
do update set role = excluded.role, status = 'active';
`;
runPsql(['-v', 'ON_ERROR_STOP=1', '-c', sql], { stdio: 'inherit' });

const organizationId = runPsql(
  ['-At', '-c', "select id from public.organizations where slug = 'estar-protegidos' limit 1"],
  { encoding: 'utf8' },
).trim();
const workspaceId = runPsql(
  [
    '-At',
    '-c',
    `select id from public.workspaces where organization_id = '${organizationId}' and suite_key = 'crm' order by id limit 1`,
  ],
  { encoding: 'utf8' },
).trim();

writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      apiUrl,
      accessToken: owner.token.access_token,
      refreshToken: owner.token.refresh_token,
      expiresAt: owner.token.expires_at,
      expiresIn: owner.token.expires_in,
      viewerAccessToken: viewer.token.access_token,
      viewerRefreshToken: viewer.token.refresh_token,
      viewerExpiresAt: viewer.token.expires_at,
      viewerExpiresIn: viewer.token.expires_in,
      email,
      organizationId,
      workspaceId,
    },
    null,
    2,
  )}\n`,
  { mode: 0o600 },
);
console.log(`CRM backend bootstrap written to ${outputPath}`);
