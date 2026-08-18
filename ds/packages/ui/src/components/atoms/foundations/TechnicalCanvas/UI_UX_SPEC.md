# UI/UX Specification: TechnicalCanvas

- Implementation: `ds/packages/ui/src/components/atoms/foundations/TechnicalCanvas`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: `CertificationLab`, workspace canvas compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `technical-canvas-v1`
- Compatible since: `2026-08-16`
- Platform target: `web-only`

## Purpose

Provide technical visual context behind an inspectable workspace surface without
competing with the content or implying interaction where none exists.

## Responsibility

### Owns

- Blueprint/neural/monochrome/clean background treatment and intensity.
- Stable canvas geometry, subgrid option and tokenized visual texture.

### Does not own

- Surface borders, cards, shell geometry, content layout, actions or domain state.

## Anatomy and composition

```text
TechnicalSurface or transparent canvas context
└── TechnicalCanvas background
    └── consumer content above the canvas
```

- Reading order: content first; canvas is atmospheric context.
- Approved composition: transparent or `TechnicalSurface` parent.
- Theme token mapping: semantic canvas/background tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: inherited semantic tokens; verified in foundation review.
- Prohibited: using the canvas as a card, placing controls inside its visual layer, arbitrary gradients or local colors.

## Public UI contract

| Prop/state    | Meaning           | Visual behavior                   | Interaction | Accessibility                                 |
| ------------- | ----------------- | --------------------------------- | ----------- | --------------------------------------------- |
| `variant`     | Canvas language   | Changes texture only              | None        | Decorative background must not become content |
| `intensity`   | Visual prominence | Low/medium/high tokenized opacity | None        | Content remains legible                       |
| `showSubgrid` | Blueprint guide   | Adds subgrid                      | None        | Decorative layer hidden from semantics        |

## Responsive contract

| Viewport | Layout             | Transformation                    | Overflow rule          | Acceptance evidence          |
| -------- | ------------------ | --------------------------------- | ---------------------- | ---------------------------- |
| Desktop  | Full parent bounds | None                              | Parent owns overflow   | Visual and responsive review |
| Tablet   | Full parent bounds | Reduce density if needed          | No page overflow       | Responsive screenshot        |
| Mobile   | Full parent bounds | Preserve context, lower intensity | No horizontal overflow | Mobile screenshot            |

## Usage recipes and compatibility

### Recommended usage

```tsx
<TechnicalCanvas variant="blueprint" intensity="low" showSubgrid>
  <PageHeader title="Accounts" />
</TechnicalCanvas>
```

Use it as a decorative context owned by the workspace composition. Content and
controls stay above the canvas and remain owned by their own components.

### Avoid

```tsx
<TechnicalCanvas>
  <TechnicalCard>Entire page workflow</TechnicalCard>
</TechnicalCanvas>
```

Do not use the canvas as a card, put interactive controls in its background
layer, or add suite-specific colors and gradients locally.

### Works with / does not work with

| Component/view                                           | Relationship         | Boundary                                                  |
| -------------------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `TechnicalSurface`, `PageHeader`, `SectionHeader`        | Approved composition | Consumer owns content and actions                         |
| `SuiteHeader`, global navigation, interactive background | Not compatible       | Canvas is decorative, not shell or control infrastructure |

### Designed capabilities and future suites

- Designed for: inspectable CRM, Marketing Studio and Operations workspaces.
- Not designed for: page layout, data state, actions or shell navigation.
- Future suites: reuse the same context with approved variants and intensity.
- Extension boundary: new visual variants require token and visual evidence; do
  not fork the canvas for suite-specific content.

## Platform portability

| Platform        | Implementation | Shared contract       | Allowed divergence               | Evidence          |
| --------------- | -------------- | --------------------- | -------------------------------- | ----------------- |
| Web/RSC         | `@loopdev/ui`  | tokens/types/behavior | none                             | foundation review |
| Web/client      | not required   | not-applicable        | not-applicable                   | not-applicable    |
| Expo/NativeWind | not-applicable | visual intent only    | native background implementation | not-applicable    |

- Native equivalent: `not-applicable`
- NativeWind compatibility: `not-supported`
- RSC constraints: no hooks, browser APIs or event handlers.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Semantic tokens preserve tenant/theme portability.
- [x] Decorative canvas has no interactive or data state ownership.
- [x] Canvas geometry remains stable across viewport sizes; no CLS transition.
- [x] Automated A11y: `not-applicable` for decorative layer; consumer content is tested.
- Reproducibility: `verified` - foundation contract tests and CertificationLab viewport review.
- A11y automation: `verified` - consumer Axe review.

## Certification evidence

- Contract: `verified` - `TechnicalCanvas` contract tests
- Accessibility: `verified` - decorative canvas with readable consumer content
- Interaction: `verified` - non-interactive primitive contract
- Responsive: `verified` - CertificationLab viewport review
- States: `verified` - intensity/variant contract
- Consumer ownership: `verified` - showcase uses declarative content
- Visual review: `verified` - foundation visual evidence
- Registry: `verified` - `docs/registries/frontend-components.json`

## Reopen triggers

- New interactive behavior, canvas ownership or token family.
- New shell geometry or mobile transformation responsibility.
