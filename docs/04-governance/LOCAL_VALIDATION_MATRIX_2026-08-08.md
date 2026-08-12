# Local Validation Matrix

This matrix defines what must be reproducible locally before a pull request and
what remains dependent on a real Supabase environment.

## Local by default

Run `pnpm check` during development and `pnpm validate:ci` before opening or
updating a pull request.

| Area                                         | Local validation                              |
| -------------------------------------------- | --------------------------------------------- |
| Formatting, lint and typecheck               | `pnpm check`                                  |
| Frontend audit and static architecture rules | `pnpm check`                                  |
| Contracts build                              | `pnpm validate:ci`                            |
| Unit and component tests                     | `pnpm check`                                  |
| Coverage and production build                | `pnpm validate:ci`                            |
| API authorization and tenant isolation logic | Vitest with typed fixtures and Supabase mocks |
| JSON mappers and normalization               | Vitest with invalid and legacy fixtures       |
| Responsive and browser interaction           | Playwright once Phase 4 is active             |

## Supabase environment checks

These checks require a local Supabase stack or a dedicated staging project and
must not be hidden inside ordinary unit tests:

| Area                                     | Required environment            |
| ---------------------------------------- | ------------------------------- |
| Applied migrations                       | Supabase CLI or staging project |
| Effective RLS policies                   | Supabase CLI or staging project |
| SQL functions and triggers               | Supabase CLI or staging project |
| End-to-end multi-tenant reads and writes | Isolated staging project        |

The remote Supabase checks are the deliberate exception. They complement, but
do not replace, the deterministic local checks.

## Test selection contract

The root Vitest configuration owns the test projects for `@loopdev/ui`,
contracts and `loopdev-os`. A new test must live under one of those project
include patterns or the author must update `vitest.config.ts` in the same
change. A direct package test is not evidence that root `pnpm test` executes it.
