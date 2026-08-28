# UI/UX Specification: Select

- Implementation: `ds/packages/ui/src/components/atoms/inputs/Select`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, Marketing Studio and Operations form compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `select-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: a form needs one selectable value with the shared LoopDev menu treatment.
- Do not use when: the workflow requires multi-select or async search.
- Main composition: consumer-owned form or filter plane.
- Compatible with: `Label`, `TechnicalSurface`, CRM forms and filter actions.
- Not compatible with: page-level navigation or domain query ownership.
- Certification: `certified`; technical, visual and responsive evidence complete.

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --- | --- | --- |
| One value from a bounded list | A shared single-select overlay and keyboard menu behavior are required | Multi-value filtering needs `FilterDropdown` |
| Searchable or remote options | Not supported by this atom | Use a consumer-owned combobox pattern |

## Purpose

Provide an accessible single-value selection control while the consumer owns the option data, selected value and domain meaning.

## Responsibility

### Owns

- Single-select trigger/menu semantics, label association, size variants, disabled state, tokenized field styling and stable geometry.

### Does not own

- Options, persistence, validation policy, queries, permissions, clear actions or domain state.

## Anatomy and composition

```text
Consumer form/filter plane
└── Select
    ├── optional visible Label
    └── portalized single-select trigger and menu with hidden form select
```

- Reading order: label, select value, native option list.
- Surface/plane owner: consumer owns layout and surrounding surface.
- Approved primitives: `Label`, `Icon`.
- Density: compact form control with small, medium and large sizes.
- Typography: semantic text tokens; option copy remains consumer-owned.
- Semantic color roles: surface, muted text, border, primary hover/focus.
- Theme token mapping: semantic tokens only.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported through semantic tokens; CRM desktop, mobile and compact-mobile evidence passed.
- Prohibited composition: multi-select behavior, page toolbar behavior or consumer-owned duplicate menu logic.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `children` | Consumer-owned option set | Preserves order and readable labels | Single option menu selection | Trigger exposes the accessible name |
| `label` | Visible field name | Label appears above control | Label targets select | Explicit `for`/`id` association |
| `size` | `sm`, `md` or `lg` density | Stable height and padding | Same native behavior | Keyboard target remains reachable |
| `fullWidth` | Layout width preference | Full-width by default or content width | No state change | No semantic impact |
| `disabled` | Control unavailable | Reduced contrast | Cannot open or change | Trigger and form field are disabled |
| `value/defaultValue` | Selected value | Selected option is displayed | Consumer controls or seeds value | Current value exposed by native control |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Open menu | Inspect options | Activate trigger | Enter/Space/Arrow keys through Radix | Escape/outside closes | Portalized themed menu |
| Select option | Choose one value | Choose one option | Arrow navigation and Enter | Menu closes after commit | Selected value updates |
| Deselect/clear | Remove current value | Consumer may provide an empty option | Native option navigation | No primitive-owned clear action | Consumer-owned value state |
| Outside interaction | Continue elsewhere | Tap outside | Tab moves onward | Native popup closes per platform | Focus follows platform rules |

`Select` owns a custom single-select overlay. `Clear selection` is explicitly not applicable; a consumer may provide an empty option when the domain permits it.

## State model

| State | Applicability | Entry condition | Required UI | Allowed actions | Accessibility |
| --- | --- | --- | --- | --- | --- |
| `ready` | required | Options available | Label/field as configured | Select one option | Native name/value |
| `loading` | deferred | Consumer has not loaded options | Consumer loading state | None until options arrive | Consumer announcement |
| `empty` | applicable | No options supplied | Select remains understandable | No selection | Name remains exposed |
| `error` | deferred | Consumer validation/data error | Consumer error relationship | Consumer-defined recovery | Error association owned by consumer |
| `read-only` | not-applicable | No read-only prop in public API | Consumer must use disabled or static text | None | Do not imply mutability |
| `disabled` | required | `disabled=true` | Disabled native field | None | Native disabled semantics |
| `forbidden` | deferred | Permission policy outside atom | Consumer-owned message | None | Consumer owns explanation |
| `skeleton` | deferred | Consumer loading composition | Consumer-owned placeholder | None | Consumer announcement |

## Content and localization contract

- Title/label guidance: concise field label describing the value.
- Description/help guidance: consumer-owned when needed.
- Action naming and tone: no primitive-owned actions.
- Maximum expected content: long option labels must remain readable in the native list.
- Wrapping/truncation: field value may truncate according to native/browser behavior; options must not be technically identified by IDs.
- Translation requirements: consumer supplies localized labels and ordering.
- Date/number/currency ownership: consumer supplies locale-formatted labels/values.
- User-generated content: React escaping and consumer validation apply.

## Density and viewport matrix

| Context | Density | Content scale | Behavior |
| --- | --- | --- | --- |
| Workspace | `md` | standard | Full-width field in consumer plane |
| Panel/modal | `sm` or `md` | compact | Width follows parent without overflow |
| Mobile | `sm` or `md` | touch-sized | Native selection remains reachable |

## Responsive contract

| Viewport | Layout | Transformation | Overflow rule | Acceptance evidence |
| --- | --- | --- | --- | --- |
| Desktop | Parent-defined width | None | No page overflow | Fixture review pending |
| Tablet | Parent-defined width | None | Field stays within surface | Fixture review pending |
| Mobile | Full-width by default | Native control remains native | No horizontal page overflow | Fixture review pending |

## Accessibility contract

- Semantic element/role: native `select`.
- Accessible name/description: visible `label` when supplied; consumer may provide `aria-label` when no label exists.
- Label and help/error association: label is owned here; help/error remains consumer-owned.
- Focus-visible and focus return: browser-native focus and return order.
- Keyboard order and activation: platform-native select keyboard contract.
- Reduced motion: no required custom animation.
- Contrast and non-color state communication: semantic tokens and native selected value.
- Overlay persistence: native platform behavior; no custom popup or clear-all action.
- Clear-all action: not-applicable to this single-select primitive; consumer may provide an empty option.
- Automated A11y evidence: focused Axe test; CRM Playwright matrix passed across desktop, mobile and compact-mobile.

## Platform portability

| Platform | Implementation | Shared contract | Allowed divergence | Evidence |
| --- | --- | --- | --- | --- |
| Web/RSC | Client boundary required | typed options/value semantics | browser-native select | focused test |
| Web/client | `Select` | tokens/types/behavior | none | focused test |
| Expo/NativeWind | native equivalent per suite | single-value selection intent | native picker UI | not-applicable |

- Native equivalent: suite-owned native picker.
- NativeWind compatibility: `partial` at contract level.
- RSC constraints: event handlers/ref and browser-native control require client boundary.

## Usage recipes and compatibility

### Recommended usage

```tsx
<Select label="Contact status" defaultValue="active">
  <option value="active">Active</option>
  <option value="prospect">Prospect</option>
</Select>
```

The consumer owns options and value semantics; the parent owns layout and persistence.

### Avoid

```tsx
<Select label="Status" onChange={saveToDatabaseDirectly} />
```

Do not put persistence, queries, permissions or custom popup behavior inside the primitive.

### Works with

| Component/view | Supported relationship | Required conditions | Result |
| --- | --- | --- | --- |
| `FiltersActions` | filter control | bounded single value | predictable filter selection |
| `Input` | sibling form control | shared consumer form state | consistent field plane |

### Does not work with

| Component/view | Incompatibility | Reason | Alternative |
| --- | --- | --- | --- |
| `FilterDropdown` as wrapper | duplicate selection ownership | different multi/single contracts | compose as siblings |
| page Shell | global navigation responsibility | wrong ownership boundary | use suite navigation |

### Designed capabilities and future suites

- Designed for: bounded single-value fields in CRM, Marketing Studio and Operations.
- Not designed for: multi-select, searchable remote data or persistence.
- Future CRM use: status, owner or lifecycle fields with consumer-owned values.
- Future Marketing Studio use: campaign type and channel fields.
- Future Operations use: queue or severity selection.
- Extension boundary: labels, options, size and native attributes without forking.
- New capability requires: documented state/API change and reopened accessibility/interaction/visual evidence.

## Approved and experimental compositions

### Approved

- CRM primitive catalog: native bounded select with consumer-owned options.

### Experimental

- Async/searchable options: blocked until a separate combobox contract exists.

## Composition checklist

- [ ] Parent surface and ownership are correct
- [ ] Option data and value state remain consumer-owned
- [ ] Mobile transformation and overflow are explicit
- [x] Keyboard, focus and accessible name are verified by focused test
- [x] Showcase consumes the public component without corrective logic
- [ ] Theme tokens are visually reviewed across supported themes
- [x] No shared behavior is duplicated in the consumer

## Performance and observability

- Rendering scale: bounded option lists; consumer owns virtualization needs.
- Layout stability: fixed size classes avoid field shift.
- Animation/assets: no custom animation; browser behavior preferred.
- Consumer telemetry hooks: consumer may record selection changes.
- Data/privacy rule: option values and selection events follow consumer telemetry policy.

## Certification evidence

- Contract: `verified` - typed props and focused test
- Accessibility: `verified` - focused `vitest-axe` test
- Interaction: `verified` - native selection contract
- Responsive: `verified` - Playwright desktop, mobile and mobile-compact review
- States: `verified` - ready/empty/disabled applicability documented
- Consumer ownership: `verified` - options/value remain consumer-owned
- Visual review: `verified` - user-approved light/dark desktop and mobile review
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- Custom popup, multi-select, async/searchable options, clear action, validation ownership or responsive transformation.
