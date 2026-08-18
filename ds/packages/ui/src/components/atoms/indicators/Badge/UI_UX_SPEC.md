# UI/UX Specification: Badge / TechnicalStatusBadge

- Implementation: `ds/packages/ui/src/components/atoms/indicators/Badge`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, Marketing Studio and Operations compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `badge-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: concise status, category or technical metadata must be scanned inline.
- Do not use when: the content is an action, navigation target or long explanation.
- Main composition: list, table, card or section metadata plane.
- Compatible with: `TechnicalCard`, `ResponsiveTable`, `SectionHeader` and CRM records.
- Not compatible with: interactive controls unless wrapped by a consumer-owned control with an accessible name.
- Certification: `certified`; technical, visual and responsive evidence complete.

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --- | --- | --- |
| Short status label | A compact non-interactive indicator is enough | A sentence or recovery action is required |
| Live technical state | A semantic status dot and label clarify state | Color or animation would be the only meaning |

## Purpose

Expose concise status or categorical metadata without becoming an interactive control or owning domain state.

## Responsibility

### Owns

- Compact label presentation, semantic status tone, optional icon and optional live indicator.

### Does not own

- Navigation, mutation, permissions, filtering, queries, persistence or domain status decisions.

## Anatomy and composition

```text
Consumer content plane
└── Badge
    ├── optional semantic status dot
    ├── optional icon
    └── consumer-owned label
```

- Reading order: status indicator, optional icon, label.
- Surface/plane owner: consumer owns placement and surrounding density.
- Approved primitives: `StatusDot`, `Icon`.
- Density: compact inline metadata.
- Typography: short readable label; no body copy.
- Semantic color roles: neutral, primary, energy, innovation, success and error tokens.
- Theme token mapping: semantic tokens only.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: semantic status tokens; CRM desktop, mobile and compact-mobile evidence passed.
- Prohibited composition: using color, pulse or icon alone to communicate meaning.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `children` | User-facing label | Compact text content | Non-interactive | Text remains exposed |
| `status` | Semantic status tone | Tokenized dot/text treatment | No action | Meaning is not color-only |
| `variant` | Surface treatment | Ghost, solid, outline or glass | No action | Contrast remains required |
| `showDot` | Status marker visibility | Dot shown by default | No action | Decorative dot does not replace label |
| `icon` | Supporting visual cue | Icon precedes label | No action | Icon is supplementary |
| `isLive` | Live status context | Optional restrained pulse | No action | Animation is decorative and reduced-motion aware |
| `isTechnical` | Technical density hint | Technical styling | No action | Label remains accessible |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Read label | Understand metadata | No activation | Not focusable by default | Not applicable | Text and semantic tone |
| Live indicator | Notice active state | No activation | No focus change | Not applicable | Optional decorative pulse |
| Consumer wrapper | Act on badge if needed | Consumer control handles action | Consumer owns focus/order | Consumer owns close behavior | Wrapper supplies accessible name |

No popup, menu, selection, clear or destructive action is owned by `Badge`.

## State model

| State | Applicability | Entry condition | Required UI | Allowed actions | Accessibility |
| --- | --- | --- | --- | --- | --- |
| `ready` | required | Label available | Label and configured treatment | None | Text exposed |
| `loading` | not-applicable | Loading belongs to `LoadingState` | None | None | Use loading primitive |
| `empty` | not-applicable | Empty content is not a badge | None | None | Use empty-state primitive |
| `error` | applicable | Error status selected | Error label/tone | None | Label carries meaning |
| `read-only` | not-applicable | Non-interactive by design | Same indicator | None | Not presented as actionable |
| `disabled` | not-applicable | No disabled API | Consumer controls visibility | None | Do not fake disabled action |
| `forbidden` | not-applicable | Permission state is consumer-owned | Consumer copy/action | Consumer-owned | Badge may label, not decide |
| `skeleton` | not-applicable | Loading transition | Use `LoadingState` | None | Consumer announcement |

## Content and localization contract

- Title/label guidance: short, specific status or category label.
- Description/help guidance: consumer-owned outside the badge.
- Action naming and tone: no primitive-owned actions.
- Maximum expected content: one short label; long content may wrap in consumer layout.
- Wrapping/truncation: consumer owns available width; never remove semantic status text silently.
- Translation requirements: consumer supplies localized labels and pluralization.
- Date/number/currency ownership: consumer formatter.
- User-generated content: React escaping and consumer validation apply.

## Density and viewport matrix

| Context | Density | Content scale | Behavior |
| --- | --- | --- | --- |
| Workspace | compact | technical | Inline with stable intrinsic height |
| Panel/modal | compact | small | Wrap as a group when needed |
| Mobile | compact | small | Remains readable without page overflow |

## Responsive contract

| Viewport | Layout | Transformation | Overflow rule | Acceptance evidence |
| --- | --- | --- | --- | --- |
| Desktop | Inline content-sized badge | None | Consumer controls wrapping | Visual review pending |
| Tablet | Inline or wrapped group | Group may wrap | No page overflow | Visual review pending |
| Mobile | Content-sized indicator | Group stacks/wraps | No horizontal page overflow | Visual review pending |

## Accessibility contract

- Semantic element/role: non-interactive inline element by default.
- Accessible name/description: `children` is the accessible text.
- Label and help/error association: consumer-owned when required.
- Focus-visible and focus return: not focusable by default; wrapper owns focus.
- Keyboard order and activation: none in the atom.
- Reduced motion: live pulse must not be required for meaning.
- Contrast and non-color state communication: label always communicates status.
- Overlay persistence: not-applicable; no overlay.
- Clear-all action: not-applicable.
- Automated A11y evidence: focused unit/Axe test; CRM Playwright matrix passed across desktop, mobile and compact-mobile.

## Platform portability

| Platform | Implementation | Shared contract | Allowed divergence | Evidence |
| --- | --- | --- | --- | --- |
| Web/RSC | `Badge` | label/status/tokens | none | focused test |
| Web/client | `Badge` | same | none | focused test |
| Expo/NativeWind | native equivalent per suite | status-label intent | platform badge primitives | not-applicable |

- Native equivalent: suite-owned status indicator.
- NativeWind compatibility: `partial` at contract level.
- RSC constraints: no browser API required.

## Usage recipes and compatibility

### Recommended usage

```tsx
<Badge status="success" showDot>Active</Badge>
```

The consumer supplies the domain label and owns placement; the badge only presents it.

### Avoid

```tsx
<Badge onClick={saveStatus}>Active</Badge>
```

Do not make the atom an implicit action, permission gate or query control.

### Works with

| Component/view | Supported relationship | Required conditions | Result |
| --- | --- | --- | --- |
| `ResponsiveTable` | status cell | concise label | scannable record status |
| `TechnicalCard` | metadata row | consumer owns card layout | compact status context |

### Does not work with

| Component/view | Incompatibility | Reason | Alternative |
| --- | --- | --- | --- |
| `LoadingState` | simultaneous loading representation | conflicting state semantics | use loading primitive |
| Shell navigation | global action ownership | wrong responsibility | use navigation control |

### Designed capabilities and future suites

- Designed for: CRM statuses, campaign labels and operational queue states.
- Not designed for: actions, filters, persistence or long-form explanation.
- Future CRM use: lifecycle, owner, activity and health labels.
- Future Marketing Studio use: campaign/channel status.
- Future Operations use: queue severity and processing state.
- Extension boundary: status tokens, label, icon and variant without forking.
- New capability requires: interactive behavior or semantic role documented and gates reopened.

## Approved and experimental compositions

### Approved

- CRM primitive catalog: non-interactive `New` and `ACTIVE` indicators.

### Experimental

- Clickable status badge: blocked until a separate action contract exists.

## Composition checklist

- [ ] Parent surface and ownership are correct
- [x] Status meaning remains in visible text
- [ ] Mobile wrapping and overflow are visually reviewed
- [x] Non-interactive semantics and Axe test are verified
- [x] Showcase consumes public APIs without corrective logic
- [ ] Theme tokens are visually reviewed
- [x] No domain state is duplicated in the badge

## Performance and observability

- Rendering scale: safe for dense lists; avoid unnecessary animation on many instances.
- Layout stability: fixed intrinsic compact geometry; no loading transition owned here.
- Animation/assets: pulse is optional and should respect reduced motion.
- Consumer telemetry hooks: consumer may record domain state changes.
- Data/privacy rule: do not emit user data from the atom.

## Certification evidence

- Contract: `verified` - public API and focused tests
- Accessibility: `verified` - focused `vitest-axe` test
- Interaction: `not-applicable` - non-interactive indicator
- Responsive: `verified` - Playwright desktop, mobile and mobile-compact review
- States: `verified` - applicability documented
- Consumer ownership: `verified` - label/status meaning supplied by consumer
- Visual review: `verified` - user-approved light/dark desktop and mobile review
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- Interactive wrapper, new status semantics, pulse meaning, action API or responsive transformation.
