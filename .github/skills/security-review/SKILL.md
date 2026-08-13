---
name: security-review
description: "Use when reviewing LoopDev changes for organization isolation, RLS, contracts, migrations, secrets, or release security."
---

# Security Review

Use this skill for a security-focused review of implementation changes. The
repository is organization-based: `organizations` and `organization_id` are
canonical. `tenants` and `tenant_id` are legacy compatibility fields only.

## Review scope

Review the changed implementation, its dependent contracts and migrations, and
the applicable track evidence. Do not treat a document, prompt, or checklist
as current authority unless it is linked from the current platform guidance or
the active track.

## Required checks

### 1. Organization isolation

- Organization-owned tables use `organization_id` as a foreign key to
  `public.organizations(id)`.
- Organization-owned records cannot be read or mutated across organizations.
- Organization context is resolved from authenticated membership, never trusted
  from an unverified client parameter.
- New contracts use `organization_id`; legacy `tenant_id` is allowed only when
  the compatibility boundary is explicit.

### 2. Database and RLS

- New or changed business tables enable RLS.
- Policies cover reads and writes and use organization membership or an
  equivalent server-side authorization function.
- Migrations are versioned, reproducible, and preserve data during legacy
  tenancy transitions.
- Database isolation tests are updated when policies or ownership boundaries
  change.

Relevant repository authorities:

- `docs/03-platform/MULTI_TENANCY_STRATEGY.md`
- `docs/03-platform/DATABASE_SECURITY_RLS.md`
- `docs/03-platform/INFRA_DEFINITION_OF_READY.md`
- `docs/03-platform/INFRA_DEFINITION_OF_DONE.md`

### 3. Contracts and API boundaries

- Request and response shapes are defined in the shared contracts package when
  the feature crosses an API boundary.
- Inputs are validated at the server boundary.
- Errors do not expose secrets, stack traces, or cross-organization data.
- API changes follow `docs/03-platform/API_STANDARDS.md`.

### 4. Secrets and operational safety

- No credentials, tokens, or environment files are committed.
- Storage paths and signed URLs follow
  `docs/03-platform/STORAGE_CONVENTIONS.md`.
- Logs contain enough context to investigate failures without logging secrets
  or sensitive payloads.

### 5. Release and evidence

- The applicable track records scope, risks, decisions, validation, and
  residual work.
- Run the narrowest validation that protects the changed risk:

```bash
pnpm validate:plan
pnpm validate:changed
pnpm docs:links:check
pnpm registries:check
```

- Use `pnpm validate:domain -- <domain>` for a known affected domain.
- Use `pnpm validate:experience -- <experience>` for user-facing, responsive,
  accessibility, or visual changes.
- Use `pnpm validate:full` for shared infrastructure, contracts, dependencies,
  workflows, releases, or ambiguous changes.
- Run the relevant Playwright tests for browser, flow, or visual behavior.
- Run `git diff --check` before reporting the review complete.

## Review output

Report findings ordered by severity:

1. Cross-organization access or missing RLS.
2. Secret exposure or unsafe migration.
3. Contract or authorization boundary violations.
4. Missing required validation or track evidence.

Each finding must include the affected path, the concrete risk, and the
required corrective action. If no findings exist, report the checks run,
explicitly note skipped checks and why, and identify any residual risk.
