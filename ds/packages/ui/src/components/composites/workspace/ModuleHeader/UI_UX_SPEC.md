# UI/UX Specification: ModuleHeader

- Implementation: `ds/packages/ui/src/components/composites/workspace/ModuleHeader`
- Public export: `@loopdev/ui` / `ModuleHeader`
- Owner: `workspace composite`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-08-17`
- Consumers: `composition-showcase`, `shell-showcase`, future CRM and Marketing Studio modules
- Related track: `tracks/active/platform/2026-08-14-saas-visual-standardization.md`
- Spec version: `1.0`
- Contract version: `rows + three slots + semantic breadcrumbs`
- Compatible since: `2026-08-17`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: a module needs identity, breadcrumbs, status and local actions inside `SuiteCanvas`.
- Do not use when: the content is global platform context or suite navigation.
- Main composition: `SuiteRuntime -> SuiteCanvas -> ModuleHeader`.
- Compatible with: `IndustrialBreadcrumbs`, `TechnicalStatusBadge`, `IconButton`, module actions.
- Not compatible with: a second platform header, suite navigation or page-local shell geometry.
- Certification: `in-progress`; technical tests pass, visual review pending.

## Purpose and responsibility

`ModuleHeader` gives the user orientation and module context before the primary
canvas content. It owns semantic header structure, stable three-slot geometry,
breadcrumb/status composition and the optional module-context toggle.

It does not own routing, permissions, persistence, domain data, shell
navigation, context-panel state or arbitrary widths and colors.

## Anatomy and composition

```text
SuiteCanvas
└── ModuleHeader
    ├── left: context toggle + breadcrumbs
    ├── center: status or consumer context
    └── right: module-owned actions
```

- Desktop uses stable `left / center / right` grid columns.
- A two-row header stacks the left and right context on small screens while
  preserving the semantic reading order.
- Surfaces and borders use semantic shell tokens.
- Tenant variation is token-only; LoopDev identity remains platform-owned.
- Long breadcrumb labels truncate inside the left slot; actions remain reachable.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `segments` | Breadcrumb hierarchy | Uses `IndustrialBreadcrumbs` | Consumer owns navigation targets | `nav[aria-label=Breadcrumb]` |
| `leftSlot` | Override for breadcrumb composition | Replaces default breadcrumbs | Consumer owns actions | Must retain accessible names |
| `centerSlot` | Status/context content | Centered on desktop | Consumer-owned | Must expose its own semantics |
| `rightSlot` | Module actions | Right aligned | Consumer-owned | Native controls required |
| `sidebarToggle` | Module context visibility | Stable icon control | Calls `onToggle` | Explicit accessible label and `aria-expanded` |
| `rows` | One or two visual rows | Stable height/min-height contract | No state ownership | Exposed through `data-module-header-rows` |
| `visibleOnMobile/Desktop` | Responsive presence | Hides the zone at the selected breakpoint | No hidden duplicate interaction | Hidden zones are absent from layout |

## Interaction and state model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Breadcrumb | Move to a parent context | Activates linked segment | Enter activates focused link/control | Not applicable | Route change owned by consumer |
| Context toggle | Open/close module context | Activates `IconButton` | Enter/Space; focus remains on control | Parent owns Escape | `aria-expanded` reflects state |
| Module action | Perform local action | Consumer control | Native keyboard behavior | Consumer-owned | Consumer state/status |

There are no overlays owned by `ModuleHeader`; Escape and outside interaction
belong to the shell or consuming context zone.

## State model

| State | Status | Required UI |
| --- | --- | --- |
| `ready` | applicable | Breadcrumbs, optional status and actions |
| `loading` | applicable | Stable structure; loading content owned by consumer |
| `empty` | not-applicable | Header remains structural; empty state belongs to canvas |
| `error` | applicable | Consumer may expose recovery action in `rightSlot` |
| `read-only` | applicable | Actions disabled/read-only by consumer |
| `disabled` | applicable | Toggle/action state communicates disabled semantics |
| `forbidden` | applicable | Consumer communicates access state without removing orientation |
| `skeleton` | deferred | Requires a dedicated visual contract before certification |

## Responsive and accessibility contract

- Desktop: three stable columns, 56px tokenized height by default.
- Tablet: preserve hierarchy, allow long labels to truncate and actions to wrap only in `rows=2`.
- Mobile: compact horizontal padding; status may be hidden by the component's responsive contract; two-row mode stacks context and actions without page overflow.
- Semantic element: `header` with configurable accessible name, default `Module header`.
- Focus: native controls retain visible focus; the shell owns focus restoration for drawers.
- Motion: transitions must respect the repository reduced-motion rules.
- Contrast: semantic tokens and non-color labels are required in light/dark themes.

## Usage recipes

### Recommended

```tsx
<ModuleHeader
  segments={[{ id: 'suite', label: 'CRM' }, { id: 'contacts', label: 'Contacts', isActive: true }]}
  statusLabel="Ready"
  statusSeverity="success"
  rightSlot={<Button variant="primary">Create contact</Button>}
/>
```

The runtime owns placement; the module owns labels and actions.

### Avoid

Do not add a second header inside the page, use arbitrary pixel widths, or
move shell navigation into `rightSlot`. Use `SuiteRuntime` and the declared
module zones instead.

## Suite portability

| Consumer | Allowed configuration | Consumer-owned behavior |
| --- | --- | --- |
| CRM | breadcrumbs, status, context toggle, actions | permissions, entity labels and mutations |
| Marketing Studio | breadcrumbs, status, compact actions | brand/module semantics and workflow actions |
| Operations | dense breadcrumbs, status and recovery action | operational state and authorization |

## Technical and visual evidence

- Contract: `verified` by `ModuleHeader.test.tsx`.
- Accessibility: `in-progress`; role/name and toggle label are covered, Axe/browser evidence pending.
- Responsive: `in-progress`; class contract covered, viewport review pending.
- Visual review: `pending`.
- Reopen triggers: new row model, new action ownership, new consumer, new responsive transformation or theme behavior.

## Decisions

| Decision | Current behavior | Required change | Evidence |
| --- | --- | --- | --- |
| `adapt` | Flexible flex layout and implicit toggle label | Stable grid, tokenized height and explicit accessible label | Focused tests |
| `keep` | Consumer-owned breadcrumbs/status/actions | Preserve ownership boundaries | Existing consumers |
| `defer` | Skeleton-specific header visuals | Define only when a loading contract requires it | Track risk |

## Spec history

| Date | Version | Change | Impact |
| --- | --- | --- | --- |
| 2026-08-17 | 1.0 | Defined stable slots, rows, responsive and accessibility contract | Reopens responsive, interaction and visual gates |
