# UI/UX Specification: PageHeader

- Implementation: `ds/packages/ui/src/components/composites/content/PageHeader`
- Public export: `@loopdev/ui`
- Owner: `composite`
- Runtime: `dual`
- Directive: `none` for content-only usage; `use client` for interactive actions
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, Marketing Studio and Operations recipes
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `page-header-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Purpose

Establish page context and expose caller-owned page-level actions without taking
ownership of Shell or global navigation.

## Responsibility

### Owns

- Eyebrow, title, description hierarchy and typed action slot placement.

### Does not own

- Platform header, SuiteHeader, navigation, data fetching, permissions or action behavior.

## Composition contract

```text
SuiteCanvas content plane
└── PageHeader
    ├── context: eyebrow/title/description
    └── caller-owned page actions
```

Long titles and descriptions wrap without clipping. Actions remain reachable and
move below context at narrow widths. The component never creates a page card or
duplicates Shell header behavior.

- Theme token mapping: semantic content, border and action tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported through semantic tokens; verified in review.

## Platform portability

| Platform        | Implementation              | Shared contract            | Allowed divergence                      | Evidence          |
| --------------- | --------------------------- | -------------------------- | --------------------------------------- | ----------------- |
| Web/RSC         | `@loopdev/ui`               | hierarchy/content contract | action handlers require client boundary | focused tests     |
| Web/client      | `@loopdev/ui`               | tokens/types/behavior      | none                                    | interaction tests |
| Expo/NativeWind | native equivalent per suite | hierarchy/content intent   | navigation and layout primitives        | not-applicable    |

- Native equivalent: suite-owned native page header.
- NativeWind compatibility: `partial`.
- RSC constraints: serializable content is server-compatible; action handlers are client-owned.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Page hierarchy is distinct from Shell and SectionHeader.
- [x] Long content and action appearance avoid layout shift.
- [x] Tenant/theme tokens remain semantic.
- [x] Automated A11y: `verified` - heading/action Axe coverage.
- Reproducibility: `verified` - focused tests and narrow viewport review.
- A11y automation: `verified` - Axe coverage.

## Usage recipes and compatibility

### Recommended usage

```tsx
<PageHeader
  eyebrow="CRM"
  title="Accounts"
  description="Manage customer accounts and their activity."
  actions={<Button onClick={createAccount}>New account</Button>}
/>
```

Use once at the start of a page content plane. The suite supplies copy and
actions; `PageHeader` supplies hierarchy and responsive placement.

### Avoid

```tsx
<SuiteHeader>
  <PageHeader title="Accounts" />
</SuiteHeader>
```

Do not use it as global navigation, nest it inside every section, or put data
fetching and permission decisions in its action slot.

### Works with / does not work with

| Component/view                                          | Relationship     | Boundary                                                                |
| ------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| `TechnicalCanvas`, `TechnicalSurface`, `FiltersActions` | Page composition | Suite owns copy, data and actions                                       |
| `SectionHeader`, `SuiteHeader` as nested header         | Not compatible   | Use one page header and local section headers; Shell owns global header |

### Designed capabilities and future suites

- Designed for: page context and page-level actions in CRM, Marketing Studio and Operations.
- Not designed for: global navigation, section labeling, queries or permissions.
- Future suites: configure eyebrow, copy and typed action slots without forking.
- Extension boundary: a new hierarchy or action model requires renewed
  accessibility and responsive evidence.

## Certification evidence

- Contract: `verified` - typed slots and content tests
- Accessibility: `verified` - heading hierarchy and action semantics
- Interaction: `verified` - caller-owned action slot
- Responsive: `verified` - long-copy and narrow review
- States: `verified` - content/action contract
- Consumer ownership: `verified` - no Shell ownership
- Visual review: `verified` - shared foundation evidence
- Registry: `verified` - frontend registry

## Reopen triggers

- Shell/header responsibility, action API, heading hierarchy or responsive layout changes.
