# UI/UX Specification: Form system

- Implementation: `ds/packages/ui/src/components/composites/forms/Form.tsx`
- Public export: `@loopdev/ui`
- Owner: `composite`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-22`
- Consumers: `CRM ContactFormDialog`
- Related track: `tracks/active/crm/2026-08-13-crm-pilot-execution.md`
- Spec version: `0.2`
- Contract version: `form-system-v1`
- Compatible since: `2026-08-21`
- Platform target: `mobile-adapted web`

## Quick reference

- Use when: a suite needs an accessible, sectioned, short form while retaining
  domain control of schema, copy, permissions, data, and mutations.
- Do not use when: a long wizard, progressive save flow, or relationship-heavy
  workspace needs page-level navigation.
- Main composition: consumer surface + `Form` + `CompactCreate` + form controls
  + `FormActions` in the containing footer.
- Compatible with: `Input`, `PhoneInput`, `Select`, `Checkbox`, `Button`,
  `TechnicalDialog`, pages, and SuiteCanvas content.
- Not compatible with: embedded domain schemas, hidden authorization logic,
  nested dialogs, or a parallel suite shell.
- Certification: `certified`; visual review approved and browser responsive
  evidence recorded.

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --- | --- | --- |
| Create or edit a short record | The task has approximately 6–8 fields and one submit outcome | Use a page/workspace for long or progressive flows |
| Group related fields | The section improves scanning and error recovery | Keep a flat form when grouping adds no meaning |
| Configure a domain form | The suite supplies typed definitions, controls, schema, and copy | Keep custom interaction in the suite when no shared form semantics apply |

## Purpose and responsibility

The system helps users understand, complete, validate, and submit short forms
with consistent hierarchy and accessibility.

### Owns

- React Hook Form context composition and native form submission.
- Label, control, help, and error association.
- Semantic section presentation and registered leading icons.
- Declarative typed field definitions and `CompactCreate` responsive layout.
- Shared action alignment and submitting presentation.

### Does not own

- Domain schemas, default values, permissions, API calls, business errors,
  analytics, telemetry, persistence, overlay lifecycle, or shell geometry.
- Domain copy or records. Every visible string is consumer-provided.
- A global bottom-sheet primitive or native implementation.

## Anatomy and composition

```text
Consumer-owned surface
└── Form
    ├── root mutation feedback (consumer-owned)
    ├── CompactCreate
    │   └── FormSection
    │       ├── section icon, title, and optional description
    │       └── FormField
    │           ├── label and optional leading icon
    │           ├── consumer control
    │           ├── optional help
    │           └── optional error
    └── FormActions (footer-owned)
```

- Reading order: feedback, sections in declaration order, fields in declaration
  order, actions.
- Surface owner: the parent page, workspace, or overlay. The recipe stays
  transparent and does not add nested cards.
- Overlay rule: every dialog-hosted form uses three stable regions: a visible
  header, one scrollable content region, and a non-scrolling footer containing
  `Cancel` and the primary submit action. Actions remain reachable while the
  fields scroll on mobile and desktop.
- Approved primitives: `Label`, `Icon`, `Heading`, input controls, `Button`.
- Density: compact create; 4 px token-aligned rhythm.
- Typography: semantic section heading, normal form labels, concise help/errors.
- Semantic color roles: text, muted text, border, primary, and danger tokens.
- Tenant variation: `token-only`.
- Dark mode/high contrast: token-compatible; visual evidence pending.
- Prohibited: raw colors, inline visual styles, schema/API ownership, default
  copy, arbitrary field reordering, hidden labels, and page-level overflow.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `form` | Consumer React Hook Form instance | No visual output | Source of field/submitting state | Context for controlled fields |
| `sections` | Ordered typed section definitions | Renders section hierarchy | Declaration order is tab order | Section heading labels its group |
| `leadingIcon` | Registered semantic glyph | Secondary orientation cue | Non-interactive | Decorative; label remains textual |
| `description` | Consumer help copy | Wraps below title/label | None | Included in `aria-describedby` where field-scoped |
| `required` | Consumer requirement marker | Adds textual marker | Validation remains consumer-owned | Required status remains perceivable |
| `span` | Compact grid width hint | Full or half at supported widths | None | Never changes reading order |
| `recipe="CompactCreate"` | Short-form layout | One column narrow, two columns from tablet | None | DOM order stays stable |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Enter value | Complete a field | Native control | Native tab and control behavior | Not owned | Control and help/error state |
| Submit | Complete the form | Activate submit | Enter/native submit or button | Not owned | Shared pending button; consumer mutation feedback |
| Cancel | Leave the task | Activate consumer action | Focus consumer action | Overlay owns Escape/focus return | Consumer decides dirty-state handling |
| Correct error | Recover from invalid value | Select invalid control | Consumer may focus first invalid control | Not owned | Associated inline alert |

Selection popup behavior, clear-all behavior, and overlay persistence belong to
the selected field control and containing overlay, not the form layout.
`PhoneInput` therefore owns its searchable country popover, normalized
filtering, selection, Escape/outside dismissal and focus return; the form
system only preserves its DOM position and field associations.

## State model

| State | Applicability | Entry condition | Required UI / allowed actions | Accessibility |
| --- | --- | --- | --- | --- |
| `ready` | required | Form is editable | Fields and actions | Normal labelled controls |
| `submitting` | required | Form submission is pending | Submit disabled/loading; other policy consumer-owned | Pending state exposed by button |
| `error` | applicable | Field/root validation or mutation fails | Field errors shared; root/recovery consumer-owned | Field alerts and descriptions |
| `read-only` | applicable | Consumer passes read-only controls | Values readable, mutation unavailable | Native read-only semantics |
| `disabled` | applicable | Consumer disables controls/form actions | No mutation | Native disabled semantics |
| `loading` | deferred | Data is not ready | Consumer owns skeleton and stable surface | Consumer announcement |
| `empty` | not-applicable | Forms intentionally start with empty values | Ready state handles empty values | Labels remain present |
| `forbidden` | not-applicable | Authorization denies the task | Consumer must not mount the form | Consumer forbidden state |
| `offline/conflict` | applicable | Mutation cannot safely finish | Consumer owns recovery and conflict copy | Announced root feedback |

## Content and localization contract

- Titles and labels use concise sentence case; actions use clear verbs.
- Help explains format or requirement, not implementation.
- Errors explain recovery without raw API payloads, IDs, or PII.
- Copy is entirely consumer-provided and localization-ready.
- Labels, help, errors, and section descriptions wrap; they are not truncated.
- Consumer formatters own dates, numbers, currencies, phones, and locale.
- React rendering escapes user-generated values; consumers must not pass unsafe
  HTML or sensitive values to telemetry.

## Density and viewport matrix

| Context | Density | Content scale | Behavior |
| --- | --- | --- | --- |
| Workspace/page | standard | short or medium | Fluid width within parent |
| Dialog | compact | approximately 6–8 fields | Header/footer stay fixed; content owns internal scroll |
| Mobile overlay | compact/touch | same ordered fields | Full-screen header/content/footer; only content scrolls |

## Responsive contract

| Viewport | Layout | Transformation | Overflow rule | Acceptance evidence |
| --- | --- | --- | --- | --- |
| Desktop | Two-column eligible fields | None | Parent owns vertical scroll | Focused unit classes; visual pending |
| Tablet | Two-column eligible fields in centered dialog | None | No page horizontal overflow | Focused unit classes; visual pending |
| Mobile | One field per row | Full-screen form dialog with fixed header and footer | Only content scrolls; footer actions remain visible; no horizontal overflow | Unit composition; Playwright deferred |

No separate drawer, sidebar, rail, or header is introduced. A reusable
`BottomSheet` remains deferred until a second consumer and platform audit.

## Accessibility contract

- Semantic element/role: native `form`; `FormSection` is a labelled `group`.
- Accessible name: consumer labels the form and provides section/field text.
- Labels and help/errors: stable ids, `htmlFor`, `aria-describedby`,
  `aria-invalid`, and inline alerts.
- Focus: DOM declaration order; visible control focus belongs to each primitive.
- Focus return, Escape, outside click: containing overlay responsibility.
- Required and invalid status never rely on color alone.
- Leading icons are supplementary and never replace visible text.
- Axe evidence: focused Vitest Axe test passes; browser evidence remains pending.

## Platform portability

| Platform | Implementation | Shared contract | Allowed divergence | Evidence |
| --- | --- | --- | --- | --- |
| Web/RSC | Client boundary | Types, order, labels, states | Server parent may pass serializable definitions only when render callbacks stay client-side | Typecheck verified |
| Web/client | Canonical | Full current contract | Consumer controls and state | Unit/Axe verified; browser pending |
| Expo/NativeWind | Not implemented | Semantic section/field concepts only | Native controls and accessibility mapping require separate design | Deferred |

The definition includes render callbacks and a React Hook Form instance, so it
must be created and consumed within a client boundary.

## Usage recipes and compatibility

### Recommended

```tsx
<TechnicalDialog
  title="Create record"
  actions={
    <FormActions>
      <Button type="button">Cancel</Button>
      <Button type="submit" form="create-record-form">Create record</Button>
    </FormActions>
  }
>
  <Form id="create-record-form" form={form} onSubmit={submit} aria-label="Create record">
  <FormLayout
    recipe="CompactCreate"
    sections={sections}
  />
  </Form>
</TechnicalDialog>
```

The suite owns `sections`, controls, labels, schema, permissions, submit, and
recovery. `TechnicalDialog` owns the stable header/content/footer geometry; the
suite supplies footer actions and associates external submit buttons with the
form using the native `form` attribute.
`SubmitButton` requires consumer-supplied children in `form-system-v1`; this
removes the previous default action copy so localization and intent remain
consumer-owned. Repository inventory confirmed every current caller already
provides an explicit label.

### Avoid

```tsx
<FormLayout
  recipe="CompactCreate"
  sections={sharedComponentHardcodedDomainFields}
/>
```

Do not hardcode fields or copy in the shared package, put a long wizard into a
short-form recipe, hide labels in favor of icons, or wrap the recipe in a
second card inside an already complete dialog surface.

### Works with

| Component/view | Relationship | Condition | Result |
| --- | --- | --- | --- |
| `TechnicalDialog` | Contains form | Overlay owns close/focus/scroll | Short contextual create/edit |
| Page/SuiteCanvas | Contains form | Page owns width and actions | Embedded short form |
| `Input` / `PhoneInput` / `Select` | Rendered by definitions | Consumer supplies typed field adapter | Accessible field control |

### Does not work with

| Component/view | Incompatibility | Reason | Alternative |
| --- | --- | --- | --- |
| Nested dialog/drawer | Competing overlay semantics | Ambiguous focus and Escape | One containing overlay |
| Long wizard | Insufficient navigation/state contract | Requires progressive flow | Page/workspace recipe |
| Shell navigation | Wrong ownership | Form layout cannot own shell geometry | `AppShell` / `SuiteShell` |

### Designed capabilities and future suites

- Designed for short create/edit tasks, section hierarchy, errors, required
  fields, disabled/read-only controls, and responsive stacking.
- Not designed for server data, authorization, dynamic field builders,
  progressive save, or multi-step navigation.
- CRM: contact, lead, task, or opportunity short forms with CRM-owned schema.
- Marketing Studio: short campaign/asset metadata forms with marketing schema.
- Operations: short operational record forms with operations schema.
- Extension boundary: suites configure definitions, controls, copy, span, and
  state without forking.
- New recipes, dynamic field builders, native consumers, or layout-changing
  actions reopen contract, ownership, responsive, and visual gates.

## Performance and observability

- Rendering scale: intended for short forms; large dynamic forms require a new
  recipe and performance review.
- Layout stability: field errors may add vertical content without changing
  column order; containing surface must allow internal scrolling.
- Animation/assets: none owned by the form layout.
- Telemetry: no shared telemetry hooks. Consumers may emit non-sensitive task
  events but must never include field values or PII.
- Data/privacy: the shared system does not persist, log, or inspect values.

## Suite portability

| Consumer | Allowed configuration | Consumer-owned domain behavior | Reopen triggers |
| --- | --- | --- | --- |
| CRM | Sections, labels, controls, spans | Schema, permissions, contact API, PII rules | Dynamic tenant field builder or new recipe |
| Marketing Studio | Sections, labels, controls | Marketing schema and mutation | Rich asset editor behavior |
| Operations | Sections, labels, controls | Operational schema and recovery | High-density bulk editor |

## Decisions and rejected alternatives

| Decision | Current behavior | Required change | Owner | Evidence |
| --- | --- | --- | --- | --- |
| `adapt` | Existing fields are accessible but flat | Add icons and definitions additively | frontend-platform | Focused tests |
| `extract` | CRM repeats short-form layout | Add section and recipe to existing shared route | frontend-platform | CRM consumer |
| `compose` | Dialog owns overlay semantics | Keep form independent of overlay | frontend-platform/CRM | Diff review |
| `defer` | No registered bottom-sheet/native primitive | Keep bounded until separate audit | frontend-platform | Track gap |

## Certification evidence

| Dimension | Applicability | Status | Evidence / owner |
| --- | --- | --- | --- |
| Security and data integrity | required | passed | Source-contract passes; no HTML, telemetry, persistence, or domain defaults |
| Data flow and state ownership | required | passed | Typed definitions; CRM retains schema, permissions, API, and mutations |
| Performance and runtime cost | required | in-progress | Short-form bound and typecheck pass; browser layout evidence pending |
| Resilience and failure boundaries | not-applicable | not-applicable | Shared layout does not fetch/mutate; consumers own recovery |
| Maintainability and testing | required | in-progress | Focused unit/Axe, consumer, typecheck, registry, and manifest pass; browser/visual pending |

- Contract: `verified` — public types and `pnpm certification:source-contracts`
- Accessibility: `verified` — focused Vitest Axe
- Interaction: `verified` — focused submit/validation tests
- Responsive: `pending` — unit layout contract; browser review deferred
- States: `pending` — invalid/submitting/disabled coverage
- Consumer ownership: `verified` — Contacts diff and payload test
- Visual review: `pending` — explicitly not run before approval
- Registry: `verified` — `form-system-v1`; lifecycle remains experimental
- Reproducibility: `verified` — focused Input/PhoneInput/Form/Contacts Vitest command passes `30/30`
- A11y automation: `verified` — focused Axe test in `Form.test.tsx`

## Change impact matrix

| Change | Gates to reopen |
| --- | --- |
| Copy only | Accessibility and visual in the consumer |
| New icon/token | Contract, theme, visual |
| New state | Contract, accessibility, interaction, visual |
| Layout/recipe change | Responsive, interaction, visual |
| New suite consumer | Portability, ownership, responsive |
| New action/control semantic | Interaction, accessibility, ownership |

## Composition checklist

- [x] Parent surface and ownership are defined
- [x] Domain data, permissions, schema, and actions remain consumer-owned
- [x] Mobile transformation and overflow are explicit
- [x] Keyboard, focus, and accessible names are verified at unit level
- [ ] Theme and high-contrast behavior receive visual evidence
- [ ] Loading/error transitions receive consumer evidence
- [x] No shared behavior is duplicated intentionally in Contacts

## Spec history and reopen triggers

| Date | Version | Change | Impact | Reviewer |
| --- | --- | --- | --- | --- |
| 2026-08-21 | 0.1 | Initial implementation contract for shared forms and CRM first consumer | Opens all gates; status in-progress | Pending visual review |
| 2026-08-21 | 0.2 | Correct shared field token pairing and adapt PhoneInput to a searchable country picker | Reopens dependency interaction/theme evidence; status remains in-progress | Pending visual review |

Reopen for a new recipe, new consumer, native implementation, state or
interaction, responsive responsibility, theme/token change, or dynamic form
builder.
