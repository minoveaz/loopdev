# EntityTable Certification Report

Status: **Front_Certified**

Date: 2026-08-16

Branch: `feature/crm-ui-foundation`

Commit: `16489ed feat(crm): complete entity table composition`

## Scope

This certification covers the reusable CRM `EntityTable` composition, its
controlled selection contract, filters, row actions, responsive table layout,
light/dark theme behavior and accessibility boundary.

Primary implementation: `apps/loopdev-os/src/components/composites/data-tables/EntityTable.tsx`

## Evidence

| Gate | Evidence | Result |
| --- | --- | --- |
| Source contract | `scripts/certification/check-source-contracts.mjs` | Pass |
| Registry | `docs/registries/frontend-components.json` and `REGISTRY_CATALOG.md` | Pass |
| Unit/component tests | `EntityTable.test.tsx`, aggregate relevant suites | Pass, 43/43 |
| Preflight | `pnpm e2e:preflight` | Pass |
| Smoke | `pnpm e2e:entity-table:smoke` | Pass |
| Desktop flow | `pnpm e2e:entity-table:desktop` | Pass |
| Responsive matrix | `pnpm e2e:entity-table:matrix` | Pass |
| Accessibility | Axe structural light/dark checks in the dedicated spec | Pass, 0 violations |
| Layout pressure | Desktop, mobile and 320px compact viewport checks | Pass |
| Visual contract | Responsive geometry assertions and reviewed browser fixture | Pass |

## Verified behaviors

- Checkbox state and selected-row state share one controlled source of truth.
- Clicking the row selects it; checkbox and `Open` retain their independent
  interaction semantics.
- `Clear selection` clears the controlled selection state.
- Primary actions and pagination remain outside the horizontal table scroller.
- All columns remain reachable on narrow viewports without shell-level overflow.
- Active and paused statuses use the shared Badge contract and theme tokens.
- Keyboard and semantic table interactions remain available through the shared
  `ResponsiveTable` primitive.

The dedicated Axe run scopes structural checks to the EntityTable region. The
catalog currently has a pre-existing contrast warning for muted filter icons in
the dark theme; it is excluded from this component gate and remains a design
token follow-up, not a new EntityTable violation.

## Workflow exception

The repository does not use Changesets for this application package. The CRM
track declares `release: not-required`; therefore no release changeset is
required for this UI composition certification. Source-contract, registry,
track and test evidence remain mandatory and are included above.

## Reproduction

From the repository root, with the configured server available at port 3001:

```bash
pnpm e2e:preflight
pnpm e2e:entity-table:smoke
pnpm e2e:entity-table:desktop
pnpm e2e:entity-table:matrix
pnpm certification:source-contracts
```