# UI/UX Specification: TechnicalSurface

- Implementation: `ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM foundation, CertificationLab, workspace compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `technical-surface-v1`
- Compatible since: `2026-08-16`
- Platform target: `web-only`

## Purpose

Define the approved visual boundary for a technical content plane while
preserving the surrounding `SuiteCanvas` context.

## Responsibility

### Owns

- Surface variant, depth, radius, border, overflow and density boundary.
- Tokenized theme and state treatment for the surface itself.
- Theme token mapping: semantic surface, border and elevation tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported through semantic tokens; verified in foundation review.

### Does not own

- Shell geometry, spacing between unrelated planes, domain state or page actions.

## Anatomy and composition

```text
SuiteCanvas
└── transparent composition wrapper
    └── TechnicalSurface
        └── consumer content
```

A surface may frame one meaningful plane. It must not become an outer card around
an entire workflow or table composition.

## Public UI contract

| Prop/state | Meaning              | Visual behavior             | Interaction                           | Accessibility                       |
| ---------- | -------------------- | --------------------------- | ------------------------------------- | ----------------------------------- |
| `variant`  | Surface/canvas/glass | Tokenized background        | None unless consumer adds interaction | Container remains semantic-neutral  |
| `depth`    | Flat/raised/overlay  | Approved elevation          | None                                  | No meaning conveyed by shadow alone |
| `border`   | Border role          | Technical/strong/none token | None                                  | Contrast is tokenized               |
| `radius`   | Geometry             | Approved radius             | None                                  | Stable dimensions                   |

## Responsive contract

| Viewport | Layout           | Transformation         | Overflow rule                                 | Acceptance evidence |
| -------- | ---------------- | ---------------------- | --------------------------------------------- | ------------------- |
| Desktop  | Stable plane     | None                   | Explicit parent ownership                     | Visual review       |
| Tablet   | Stable plane     | Preserve hierarchy     | No accidental page overflow                   | Responsive review   |
| Mobile   | Full-width plane | Stack consumer content | Surface may scroll only when explicitly owned | Mobile review       |

## Usage recipes and compatibility

### Recommended usage

```tsx
<TechnicalSurface variant="raised" border="technical">
  <SectionHeader title="Recent accounts" />
</TechnicalSurface>
```

Use one surface for one meaningful content plane; the parent owns placement and
the child owns content, actions and domain state.

### Avoid

```tsx
<TechnicalSurface>
  <TechnicalSurface>
    <ResponsiveTable />
  </TechnicalSurface>
</TechnicalSurface>
```

Do not nest surfaces for decoration, wrap an entire workflow in one surface, or
make the surface responsible for Shell geometry or data behavior.

### Works with / does not work with

| Component/view                                                      | Relationship              | Boundary                       |
| ------------------------------------------------------------------- | ------------------------- | ------------------------------ |
| `TechnicalCanvas`, `PageHeader`, `TechnicalCard`, `ResponsiveTable` | Content-plane composition | Consumer owns layout and state |
| `SuiteHeader`, global navigation, repository/service                | Not compatible            | Different ownership layer      |

### Designed capabilities and future suites

- Designed for: bounded workspace planes in CRM, Marketing Studio and Operations.
- Not designed for: navigation, fetching, authorization or page-level layout.
- Future suites: configure density, approved variant, depth and border tokens.
- Extension boundary: new surface semantics require a new variant and renewed
  responsive/accessibility evidence.

## Platform portability

| Platform        | Implementation | Shared contract       | Allowed divergence              | Evidence          |
| --------------- | -------------- | --------------------- | ------------------------------- | ----------------- |
| Web/RSC         | `@loopdev/ui`  | tokens/types/behavior | none                            | foundation review |
| Web/client      | not required   | not-applicable        | not-applicable                  | not-applicable    |
| Expo/NativeWind | not-applicable | surface intent only   | native container implementation | not-applicable    |

- Native equivalent: `not-applicable`
- NativeWind compatibility: `not-supported`
- RSC constraints: no hooks, browser APIs or event handlers.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Semantic tokens cover tenant, dark mode and high contrast themes.
- [x] Surface does not own Shell, data or domain actions.
- [x] Stable surface geometry prevents layout shift.
- [x] Automated A11y: `verified` - semantic-neutral surface contract.
- Reproducibility: `verified` - focused tests and CertificationLab viewport review.
- A11y automation: `verified` - foundation Axe review.

## Certification evidence

- Contract: `verified` - public types and focused tests
- Accessibility: `verified` - surface has no misleading interactive semantics
- Interaction: `verified` - consumer-owned interaction
- Responsive: `verified` - foundation responsive review
- States: `verified` - variant/depth/border contract
- Consumer ownership: `verified` - no Shell geometry ownership
- Visual review: `verified` - CertificationLab visual evidence
- Registry: `verified` - frontend registry

## Reopen triggers

- New surface variant, shell responsibility, inline layout behavior or token role.
