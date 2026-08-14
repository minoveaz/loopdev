---
title: Platform Shell and SuiteCanvas mode inventory
status: phase-0-inventory
owner: platform
reviewed_at: 2026-08-14
---

# Platform Shell and SuiteCanvas mode inventory

## Evidence sources

- Contracts: `packages/contracts/src/platform/navigation.ts`,
  `packages/contracts/src/platform/shell.ts`,
  `packages/contracts/src/platform/__tests__/shell.test.ts`.
- UI boundaries: `ds/packages/ui/src/components/composites/shell/AppShell`,
  `SuiteShell`, `SuiteSidebar`, `SuiteRuntime`, `SuiteCanvas`,
  `SidebarFooter`, and `SuiteHeader`.
- Guidance: Platform Shell skill architecture, suite composition,
  interaction contracts and testing references.

## Ownership inventory

| Boundary | Owns | Must not own |
| --- | --- | --- |
| AppShell | Platform layout, global overlays and shell context | Suite module details |
| SuiteShell | Header/sidebar/content slot composition | CRM or suite business rules |
| PlatformHeader | Identity, organization, suite context and global actions | Suite navigation replacement |
| SuiteSidebar | Navigation modes, access filtering and active navigation | Canvas content or tenant business rules |
| SidebarFooter | Mode selector and portal menu relationship | Layout width mutation |
| GlobalContextPanel | Notifications, help and assistant overlays | Sidebar or suite content |
| SuiteRuntime | Suite context and navigation callbacks | CRM queries or mutations |
| SuiteCanvas | Generic surface mode composition | Domain-specific data contracts |

## Mode compatibility matrix

| Surface | Expanded | Rail | Hover | Hidden | Acceptance invariant |
| --- | --- | --- | --- | --- | --- |
| SuiteSidebar | Labels/groups visible in flow | Icons with accessible names | Expanded overlay over center | Not rendered | Center x-coordinate is stable in rail/hover |
| SidebarFooter | Selector visible | Icon/label contract | Portal menu keeps expanded state | Not rendered | Pointer gap does not collapse menu |
| SuiteCanvas | `overview`, `data`, `split`, `board`, `record`, `focus` | Same content contract | Same content contract | Route owns fallback | Mode changes restore focus and preserve route |
| NavigationSchema | Full labels and groups | Same IDs and routes | Same access-filtered items | No hidden unauthorized items | Stable IDs, deterministic priorities |
| GlobalContextPanel | Overlay available | Overlay independent | Overlay above shell surfaces | Closed | Does not change sidebar dimensions |

## Canvas consumer contract

| Mode | Intended consumer | Required child behavior |
| --- | --- | --- |
| `overview` | Suite dashboard / My Day | Summary states and primary next action |
| `data` | Contacts, Leads, Tasks lists | Cursor pagination, filters and table semantics |
| `split` | List/detail journeys | Selection, URL state and responsive fallback |
| `board` | Pipeline | Keyboard/action alternative to drag-and-drop |
| `record` | Contact, Opportunity, Customer 360, Task | Focus restoration, stale/conflict states |
| `focus` | Single task or contextual workflow | Escape/back navigation and bounded actions |

## Gaps and gates

1. Existing shell tests cover contract helpers and components, but a complete
   cross-mode matrix test is not present.
2. Portalized footer behavior needs an interaction test that spans trigger,
   portal menu and delayed collapse.
3. Hover overlay needs an invariant test proving the center content x-coordinate
   does not change.
4. Every suite needs a concrete consumer for each mode it declares; unused
   modes must not be added speculatively.
5. Permission filtering must be tested before rendering, including active route
   fallback when the current module becomes inaccessible.

No shell behavior was changed by this inventory.
