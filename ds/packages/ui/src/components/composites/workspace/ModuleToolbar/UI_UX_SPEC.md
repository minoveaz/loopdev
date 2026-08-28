# UI/UX Specification: ModuleToolbar

- Implementation: `ds/packages/ui/src/components/composites/workspace/ModuleToolbar`
- Public export: `@loopdev/ui` / `ModuleToolbar`
- Owner: `workspace composite`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-08-17`
- Consumers: `composition-showcase`, `shell-showcase`, Marketing Studio, future CRM and Operations modules
- Related track: `tracks/active/platform/2026-08-14-saas-visual-standardization.md`
- Spec version: `1.0`
- Contract version: `context + left/center/right slots + selection recovery`
- Compatible since: `2026-08-17`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: a module needs search, filters, view controls, selection state or local workflow actions.
- Do not use when: the action is global platform navigation or a persistent second sidebar.
- Main composition: `SuiteRuntime -> SuiteCanvas -> ModuleToolbar`.
- Compatible with: `ModuleSearch`, `Button`, `IconButton`, view/filter controls and context actions.
- Not compatible with: page-level shell overlays or arbitrary horizontal overflow.
- Certification: `in-progress`; technical tests pass, visual review pending.

## Purpose and responsibility

`ModuleToolbar` groups module-level controls below `ModuleHeader`. It owns the
stable toolbar plane, the reserved module-context slot, responsive slot layout
and the visual feedback for consumer-owned selection recovery.

It does not own queries, filtering state, permissions, persistence, business
mutations or global navigation.

## Anatomy and composition

```text
SuiteCanvas
└── ModuleToolbar[role=toolbar]
    ├── left: context + search/filters or selection recovery
    ├── center: view/sort controls
    └── right: module actions
```

- One-row mode uses stable left/center/right columns on desktop.
- Two-row mode uses left across the first mobile row and center/right on the second.
- Horizontal overflow is contained in the left control zone; it must never escape the shell.
- `contextSlot` remains a module-context affordance and must not become suite navigation.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `contextSlot` | Module context trigger | Reserved at left | Consumer/shell owns toggle | Must have accessible name and expanded state |
| `leftSlot` | Search/filter controls | Left aligned and shrink-safe | Consumer-owned | Native labels required |
| `centerSlot` | View/sort controls | Centered desktop, reachable mobile | Consumer-owned | Controls retain keyboard order |
| `rightSlot` | Actions | Right aligned | Consumer-owned | Native button semantics |
| `selection` | Active selection summary | Clear action and count replace left content | Calls consumer `onClear` | Clear has explicit label |
| `rows` | One or two rows | Stable tokenized height/min-height | No state ownership | Exposed through `data-module-toolbar-rows` |
| `density` | Compact or comfortable spacing | Adjusts gaps only | No semantic change | Same target reachability |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Search/filter | Refine module data | Consumer control | Native input order | Consumer-owned popup rules | Consumer-owned result state |
| View/sort | Change presentation | Consumer control | Native control behavior | Consumer-owned | Active state is non-color-only |
| Clear selection | Recover from selection | Activates clear icon | Enter/Space; focus returns to consumer target | No popup owned here | Consumer receives `onClear` |
| Context action | Open module context | Consumer/shell control | Native button semantics | Shell owns Escape/outside | `aria-expanded` from consumer |

The toolbar owns no popup. Select, deselect, clear, Escape and outside-click
behavior for filters or menus remain in the consuming control.

## State model

| State | Status | Required UI |
| --- | --- | --- |
| `ready` | applicable | Slots render with stable geometry |
| `loading` | applicable | Consumer keeps control dimensions stable |
| `empty` | not-applicable | Empty result belongs to canvas; filters remain available |
| `error` | applicable | Consumer may provide retry in `rightSlot` |
| `read-only` | applicable | Consumer disables mutations while preserving view controls |
| `disabled` | applicable | Native disabled semantics on individual controls |
| `forbidden` | applicable | Consumer hides or disables according to permission contract |
| `skeleton` | deferred | Requires a dedicated loading fixture before certification |

## Responsive and accessibility contract

- Desktop: three columns, single tokenized toolbar height by default.
- Tablet: preserve slot order and contain long controls in the left zone.
- Mobile: one-row mode remains horizontally safe; two-row mode is explicitly two rows, with center and right controls reachable.
- Semantic element: `div[role=toolbar]` with configurable accessible name, default `Module toolbar`.
- Keyboard order follows left, center, right DOM order.
- Clear selection uses an explicit accessible name and consumer-owned focus recovery.
- Semantic tokens provide contrast in light/dark and tenant themes.

## Usage recipes

### Recommended

```tsx
<ModuleToolbar
  leftSlot={<ModuleSearch placeholder="Search contacts" />}
  centerSlot={<ViewSwitcher />}
  rightSlot={<Button variant="primary">Create contact</Button>}
/>
```

The module owns data and actions; the runtime owns placement and shell geometry.

### Avoid

Do not render a second toolbar manager in the page, put global navigation in
`contextSlot`, or apply page-level overflow classes to compensate for a
long toolbar. Use two-row mode and contained controls instead.

## Suite portability

| Consumer | Allowed configuration | Consumer-owned behavior |
| --- | --- | --- |
| CRM | search, filters, views, selection and actions | queries, permissions and mutations |
| Marketing Studio | asset/search/filter controls and workflow actions | brand/domain semantics |
| Operations | dense filters, sort and recovery actions | operational state and authorization |

## Technical and visual evidence

- Contract: `verified` by `ModuleToolbar.test.tsx`.
- Accessibility: `in-progress`; role/name and clear action are covered, Axe/browser evidence pending.
- Responsive: `in-progress`; two-row class contract covered, viewport review pending.
- Visual review: `pending`.
- Reopen triggers: new row model, popup ownership, selection behavior, new consumer, responsive transformation or theme behavior.

## Decisions

| Decision | Current behavior | Required change | Evidence |
| --- | --- | --- | --- |
| `adapt` | Desktop-oriented flex layout and implicit mobile hiding | Stable grid, explicit two-row mobile layout and contained overflow | Focused tests |
| `keep` | Consumer-owned controls and selection callback | Preserve state ownership and public slots | Existing consumers |
| `defer` | Popup-specific filter persistence | Define in the owning filter component, not this toolbar | Track risk |

## Spec history

| Date | Version | Change | Impact |
| --- | --- | --- | --- |
| 2026-08-17 | 1.0 | Defined stable slots, rows, selection recovery and responsive contract | Reopens responsive, interaction and visual gates |
