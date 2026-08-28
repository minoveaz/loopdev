# UI/UX Specification: TechnicalCard

- Implementation: `ds/packages/ui/src/components/atoms/surfaces/TechnicalCard`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM and workspace recipes
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `technical-card-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Purpose

Provide a thin, bounded content card when a repeated item genuinely needs a
frame and a distinct interaction or state.

## Responsibility

### Owns

- Card surface composition, approved variants and interactive state boundary.

### Does not own

- Page layout, data fetching, domain actions, table planes or nested cards.

## UI contract

| Variant/state   | Required behavior                                             |
| --------------- | ------------------------------------------------------------- |
| `default`       | Readable bounded content                                      |
| `interactive`   | Keyboard and pointer focus/hover affordance owned by the card |
| `warning`       | Semantic warning treatment; not generic decoration            |
| `disabled`      | Non-interactive and visibly unavailable                       |
| `aria-readonly` | Readable while mutations remain consumer-controlled           |

- Theme token mapping: semantic card, content and state tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported by semantic state tokens; verified in review.

## Composition and responsive contract

Cards are individual repeated items only. Do not wrap an entire page or table in
`TechnicalCard`. Preserve stable dimensions and stack content at narrow widths;
long copy must wrap without changing the interaction target unexpectedly.

## Usage recipes and compatibility

### Recommended usage

```tsx
<TechnicalCard variant="interactive" onClick={openAccount}>
  <AccountSummary />
</TechnicalCard>
```

Use for one repeated item that needs a bounded frame or interaction. The
consumer supplies content and domain action; the card supplies state and focus.

### Avoid

```tsx
<TechnicalCard>
  <PageHeader />
  <ResponsiveTable />
</TechnicalCard>
```

Do not use cards as page sections, table shells or nested decorative wrappers.
Do not communicate warning or disabled meaning through color alone.

### Works with / does not work with

| Component/view                                          | Relationship   | Boundary                                          |
| ------------------------------------------------------- | -------------- | ------------------------------------------------- |
| `EmptyState`, `LoadingState`, repeated domain summary   | Item content   | Consumer owns data and recovery                   |
| `PageHeader`, `ResponsiveTable`, outer workflow surface | Not compatible | Use the component's own plane or item composition |

### Designed capabilities and future suites

- Designed for: repeated CRM records, campaign summaries and Operations queue items.
- Not designed for: full-page workflows, tables, navigation or data fetching.
- Future suites: configure content, state variant and a consumer-owned action.
- Extension boundary: new interaction or state requires keyboard, responsive and
  visual evidence before certification remains valid.

## Platform portability

| Platform        | Implementation                       | Shared contract        | Allowed divergence                           | Evidence          |
| --------------- | ------------------------------------ | ---------------------- | -------------------------------------------- | ----------------- |
| Web/RSC         | `@loopdev/ui`                        | content/state contract | interactive variant requires client boundary | focused tests     |
| Web/client      | `@loopdev/ui`                        | tokens/types/behavior  | none                                         | interaction tests |
| Expo/NativeWind | native equivalent required per suite | content/state intent   | press/focus semantics may differ             | not-applicable    |

- Native equivalent: suite-owned card implementation.
- NativeWind compatibility: `partial`.
- RSC constraints: interactive cards require `use client`; non-interactive content may remain server-rendered.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Tokenized variants work across tenant/theme modes.
- [x] Disabled/read-only semantics are explicit.
- [x] Card dimensions and long-copy wrapping avoid CLS.
- [x] Automated A11y: `verified` - focused semantic and Axe tests.
- Reproducibility: `verified` - focused tests and foundation viewport review.
- A11y automation: `verified` - Axe coverage.

## Certification evidence

- Contract: `verified` - types and focused tests
- Accessibility: `verified` - interactive/disabled/read-only semantics
- Interaction: `verified` - focus and state tests
- Responsive: `verified` - foundation responsive review
- States: `verified` - default/interactive/warning/disabled/read-only fixture
- Consumer ownership: `verified` - domain content remains consumer-owned
- Visual review: `verified` - CertificationLab evidence
- Registry: `verified` - frontend registry

## Reopen triggers

- New card responsibility, nested surface behavior or state not covered above.
