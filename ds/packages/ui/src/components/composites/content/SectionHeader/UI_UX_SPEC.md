# UI/UX Specification: SectionHeader

- Implementation: `ds/packages/ui/src/components/composites/content/SectionHeader`
- Public export: `@loopdev/ui`
- Owner: `composite`
- Runtime: `dual`
- Directive: `none` for content-only usage; `use client` for interactive actions
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, Marketing Studio and Operations compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `section-header-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Purpose

Label a local content section and expose an optional local action without
competing with page or Shell hierarchy.

## Responsibility

### Owns

- Section heading hierarchy, local action slot and compact alignment.

### Does not own

- Page title, global actions, data state, table mechanics or domain behavior.

## Composition contract

```text
Page or surface plane
└── SectionHeader
    ├── local section title
    └── optional local action
```

The action remains optional and caller-owned. At narrow widths title and action
wrap or stack without clipping or losing the heading relationship.

- Theme token mapping: semantic content and action tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported through semantic tokens; verified in review.

## Platform portability

| Platform        | Implementation              | Shared contract            | Allowed divergence                      | Evidence          |
| --------------- | --------------------------- | -------------------------- | --------------------------------------- | ----------------- |
| Web/RSC         | `@loopdev/ui`               | hierarchy/content contract | action handlers require client boundary | focused tests     |
| Web/client      | `@loopdev/ui`               | tokens/types/behavior      | none                                    | interaction tests |
| Expo/NativeWind | native equivalent per suite | hierarchy/content intent   | action and layout primitives            | not-applicable    |

- Native equivalent: suite-owned native section header.
- NativeWind compatibility: `partial`.
- RSC constraints: serializable content is server-compatible; action handlers are client-owned.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Section hierarchy is distinct from PageHeader and SuiteHeader.
- [x] Long titles and action appearance avoid layout shift.
- [x] Tenant/theme tokens remain semantic.
- [x] Automated A11y: `verified` - heading/action Axe coverage.
- Reproducibility: `verified` - focused tests and narrow viewport review.
- A11y automation: `verified` - Axe coverage.

## Usage recipes and compatibility

### Recommended usage

```tsx
<SectionHeader title="Recent activity" action={<Button onClick={openActivity}>View all</Button>} />
```

Use immediately above one local content section. The consumer owns the section
data and action; `SectionHeader` owns only local hierarchy and alignment.

### Avoid

```tsx
<SectionHeader title="Accounts" action={<GlobalNavigation />} />
```

Do not use it for page titles, Shell navigation, table selection or global
commands. Do not repeat it for every row in a collection.

### Works with / does not work with

| Component/view                                         | Relationship              | Boundary                                    |
| ------------------------------------------------------ | ------------------------- | ------------------------------------------- |
| `TechnicalSurface`, `TechnicalCard`, `ResponsiveTable` | Local section composition | Consumer owns data and section action       |
| `PageHeader`, `SuiteHeader` as replacement             | Not interchangeable       | Page and Shell own different heading levels |

### Designed capabilities and future suites

- Designed for: local sections in CRM, Marketing Studio and Operations screens.
- Not designed for: page context, global actions, table mechanics or domain state.
- Future suites: configure title, supporting copy and a local action slot.
- Extension boundary: new heading levels or action behavior require updated
  hierarchy and responsive evidence.

## Certification evidence

- Contract: `verified` - typed content/action slots
- Accessibility: `verified` - heading and action semantics/Axe tests
- Interaction: `verified` - caller-owned local action
- Responsive: `verified` - long-copy review
- States: `verified` - content/action contract
- Consumer ownership: `verified` - no Shell or table ownership
- Visual review: `verified` - shared foundation evidence
- Registry: `verified` - frontend registry

## Reopen triggers

- Heading hierarchy, action ownership, local surface or responsive behavior changes.
