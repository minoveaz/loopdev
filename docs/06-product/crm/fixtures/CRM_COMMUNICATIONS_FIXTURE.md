---
title: CRM communications synthetic fixture
status: reproducible-local-fixture
version: 1.0
updated: 2026-09-06
---

# CRM communications synthetic fixture

The Inbox UI has a deterministic, non-production fixture for local and browser work. It contains
synthetic contacts, UUIDs, messages and an approved-template-shaped payload; it does not contain
provider credentials, real phone numbers, WABA identifiers or real customer data.

## Use

Set `NEXT_PUBLIC_CRM_COMMUNICATIONS_FIXTURE=true` when running the local app. The route then uses
`apps/loopdev-os/src/suites/sales-crm/communications/inbox.fixture.ts` through the fixture data
source. E2E runs may continue to use `NEXT_PUBLIC_E2E_AUTH_BYPASS=true`, which selects the same
fixture for deterministic browser coverage.

For persisted CRM journeys, use `supabase/seed_crm_pilot.sql`. It is explicitly marked synthetic
and must only be run against a local/reset database. No real WABA or outbound provider is activated
by either path.

This fixture is a development aid, not visual certification or staging evidence.
