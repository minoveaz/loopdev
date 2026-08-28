# Component Design Audit: Form system

- Status: `approved-for-implementation`
- Date: `2026-08-21`
- Owner: `frontend-platform`
- Implementation: `ds/packages/ui/src/components/composites/forms`
- First consumer: `apps/loopdev-os/src/app/sales-crm/contacts/ContactFormDialog.tsx`
- Related track: `tracks/active/crm/2026-08-13-crm-pilot-execution.md`

## 1. Component and outcome

The existing `Form`, `FormField`, `FormActions`, and `SubmitButton` composite is
the canonical base. This change extends that base with typed field definitions,
`FormSection` presentation, semantic leading icons, and a `CompactCreate`
layout recipe. A user should be able to scan and complete a short create form
in a predictable order while suites retain all domain schema, permissions,
copy, state, and mutations.

Aliases searched: form layout, field group, sectioned form, compact create,
entity create form, contact form. Ownership remains a shared composite; the
CRM feature remains the owner of `ContactFormDialog`.

## 2. Inventory and duplicate review

| Candidate | Finding | Decision |
| --- | --- | --- |
| Existing `forms/Form.tsx` | Owns React Hook Form context, field association, errors, actions, and submit state | Extend; do not create a second form primitive |
| `Input` and `PhoneInput` | Own field controls, but explicit dark surface/foreground overrides could split tenant theme tokens; PhoneInput used a transparent native country select | Correct token pairing and adapt the existing PhoneInput; do not create a CRM control |
| `SectionHeader` | Closest shared section hierarchy reference, but its operational heading and divider are not field-group semantics | Reuse its token/heading conventions, not its public responsibility |
| `TechnicalDialog` | Owns accessible overlay behavior and internal scrolling | Compose; do not couple forms to dialogs |
| CRM `ContactFormDialog` | Currently owns schema/API correctly but duplicates grid and grouping markup | Move only layout declarations to typed shared definitions |
| Bottom sheet, drawer, or local modal | No separate registered form primitive exists | Do not create a parallel overlay or shell |

Searches covered `ds/packages/ui/src/components`, suite components, exports,
the frontend registry, source-contract manifest, CRM docs, and active tracks.
No equivalent `FormSection` or declarative short-form recipe exists.

## 3. Cross-platform contract

- Web client component using React Hook Form context.
- Native form semantics, label association, `aria-describedby`,
  `aria-invalid`, and alert semantics remain stable.
- Pointer and touch behavior belong to field controls; keyboard order follows
  the declaration and DOM order.
- Required, disabled, read-only, submitting, and validation error behavior are
  composable. Loading, forbidden, offline, and mutation recovery remain with
  the consumer.
- Semantic tokens only; no suite colors, inline visual styles, raw z-indexes,
  domain records, or default visible copy.
- Every field surface and typed value must resolve from a paired semantic
  background/foreground set. Global dark mode must not force a near-black field
  when an active tenant theme supplies a light background and dark text.
- Desktop/tablet use a two-column compact grid where fields allow it. Narrow
  viewports stack fields and preserve reading order without horizontal
  overflow.
- The form system does not own overlay transformation. Contacts may configure
  the existing `TechnicalDialog` as the approved mobile bottom-aligned
  presentation without creating a new drawer, rail, header, or shell.
- Expo/NativeWind is deferred to frontend-platform until a native consumer and
  semantic form-control mapping exist.

## 4. Suite contract

| Consumer | Shared capability | Consumer-owned behavior | Prohibited leakage |
| --- | --- | --- | --- |
| CRM Contacts | Sections, typed fields, compact grid, accessible presentation | Contact schema, English copy, permissions, organization id, API request, errors, success | Contact names, CRM validation, PII policy, endpoints |
| Marketing Studio | Same field and section declarations | Campaign/asset schema, actions, permissions, copy | Marketing defaults in shared code |
| Operations | Same compact create recipe | Operational schema, formatter, mutation, recovery | Operational status or record data |

## 5. Composition standard

```text
TechnicalDialog, page, or SuiteCanvas (consumer-owned surface)
└── Form (shared state bridge)
    └── CompactCreate recipe (shared transparent layout)
        ├── FormSection (shared hierarchy)
        │   └── FormField definitions (consumer copy and controls)
        └── FormActions (shared action alignment)
```

Reading order is section title and optional description, then each field label,
control, help, and error, followed by actions. The recipe owns spacing and
responsive columns but not another card or surface. Registered `Icon` glyphs
provide decorative semantic anchors and remain hidden from assistive
technology through the icon primitive's presentation.

## 6. Functional UX model

| Capability | User intent | Affordance | Interaction | States | Accessibility |
| --- | --- | --- | --- | --- | --- |
| Scan section | Understand a related field group | Heading, icon, optional description | Read in DOM order | ready | Semantic heading and labelled group |
| Enter field | Provide a typed value | Label, control, help | Native control behavior | ready, disabled, read-only | Label/control and description/error association |
| Find phone country | Select the correct calling code quickly | Flag/code trigger and searchable popover | Type country or code; click an option | ready, filtered-empty, disabled/read-only | Labelled dialog, combobox/listbox, active descendant |
| Select phone country | Apply one calling code | Country option with flag, label and code | Click or Enter; Escape/outside cancels | open, active, selected | Focus returns to trigger after close |
| Recover from validation | Correct invalid input | Inline error replacing or following help | Focus remains in form | invalid | `aria-invalid`, `role=alert`, described error |
| Submit | Create or update a record | Consumer-labelled primary action | Native form submit | idle, submitting | Button disabled/loading state |
| Cancel | Leave without submitting | Consumer-labelled secondary action | Consumer closes containing surface | ready | Overlay owns focus return and Escape |

## 7. Decisions and concrete action inventory

| Action | Component / current behavior | Required change | Owner / impact | Acceptance evidence |
| --- | --- | --- | --- | --- |
| `keep` | `Form` owns `FormProvider` and submit | Preserve API and behavior | frontend-platform / all consumers | Existing focused test |
| `adapt` | `FormField` renders label/help/error but has no semantic leading icon | Add a registered icon option without domain defaults | frontend-platform / additive API | Unit and Axe assertions |
| `extract` | CRM repeats section and grid markup | Add `FormSection` and typed definitions in the existing forms route | frontend-platform / reusable | Public types and tests |
| `compose` | Short create layout is local CSS | Add `CompactCreate` recipe that maps typed section/field definitions to existing primitives | frontend-platform / CRM first consumer | Declarative consumer test |
| `correct` | Contact form copy is Spanish and fields are unsectioned | Configure Identity, Contact channels, and Organization with English copy | CRM / visible form behavior | CRM focused test |
| `keep` | CRM owns Zod schema, permission-gated mounting, API, and mutation state | Preserve ownership | CRM / security and data integrity | Diff review and behavior test |
| `adapt` | `PhoneInput` did not expose consumer locale copy or a native focus ref | Require consumer country copy, preserve external ARIA, and forward focus to the native input | frontend-platform / Contacts | Direct unit/Axe and focus-on-error tests |
| `correct` | `Input` and `PhoneInput` mixed explicit dark surfaces/white text with tenant semantic foregrounds; app autofill forced a near-black field | Pair `bg-lpd-bg-base`, `text-lpd-text-base`, muted placeholder/help and primary caret/focus; make autofill use the same semantic tokens | frontend-platform / every shared form consumer | Source assertions, focused token tests, source-contract, visual review pending |
| `adapt` | `PhoneInput` country selection depended on a transparent native `<select>` | Compose Radix Popover, search combobox and listbox from existing dependencies; normalize accents, plus, spaces and punctuation; keep copy consumer-owned | frontend-platform / Contacts and future suites | Spain name/+34/34 tests, click/Enter, Escape/outside focus return, open/closed Axe |
| `adapt` | Dialog is centered at all widths | Use its existing composition hook for bottom alignment below `md`; remain centered at `md+` | CRM consumer / responsive only | Unit class contract; visual review pending |
| `adapt` | `SubmitButton` previously supplied default action copy | Require explicit consumer copy in the versioned `form-system-v1` contract; all current callers already comply | frontend-platform / localization ownership | Typecheck and caller inventory |
| `defer` | No registered global `BottomSheet` or native form system | Do not create either until a second consumer and separate platform audit exist | frontend-platform / no invented shell | Track and registry evidence gap |

Rejected alternatives: a CRM-only form layout duplicates accessibility and
spacing; a new modal or drawer duplicates Radix dialog behavior; schema-driven
controls inside `@loopdev/ui` leak domain data and validation; extending
`SectionHeader` conflates operational content headings with form groups.

## 8. Implementation handoff

1. Add public typed definitions and the `CompactCreate` recipe beside the
   existing form primitives.
2. Add `FormSection` and optional `FormField` leading icon presentation using
   the registered `Icon` approach.
3. Extend focused shared tests for semantics, responsive recipe classes,
   validation associations, semantic text/surface tokens, searchable country
   interaction, keyboard dismissal/focus return, and Axe.
4. Convert Contacts to declarative definitions while preserving its CRM schema
   and API adapter.
5. Add focused Contacts behavior coverage for English copy, payload, validation,
   permission failure, and responsive dialog composition.
6. Register the shared form system and source-contract paths as experimental,
   with visual/mobile evidence gaps explicit.
7. Run focused Vitest, package typecheck/lint when available, registry,
   source-contract, track, and diff checks.
8. Do not run Playwright before visual approval. UI/UX remains `in-progress`.

## 9. Showcase and post-implementation gate

No showcase fixture is added in this slice. Visual approval must review the
actual Contacts consumer after automated checks and must cover desktop, tablet,
mobile, light/dark theme, long help/error copy, focus, and overflow.

Post-implementation re-audit will update every action above to `verified`,
`partial`, `failed`, or `still-deferred`. Passing tests alone does not certify
or promote this form system.

## 10. Post-implementation re-audit

| Action | Status | Resulting evidence |
| --- | --- | --- |
| Keep `Form` state/submit ownership | `verified` | Existing submit test remains green |
| Adapt `FormField` leading icon and associations | `verified` | Typed API plus focused DOM/Axe tests |
| Extract `FormSection` and typed definitions | `verified` | Shared implementation and public types |
| Compose `CompactCreate` from existing primitives | `verified` | Declarative CRM consumer and recipe test |
| Correct Contacts hierarchy and English copy | `verified` | Contact validation and submit tests |
| Keep CRM schema, permission, and API ownership | `verified` | Schema and fetch adapter remain in `ContactFormDialog` |
| Adapt `PhoneInput` copy, ARIA, and native focus | `verified` | Adjacent spec, registry/source-contract entry, direct unit/Axe, and CRM focus test |
| Correct shared field semantic token pairing | `verified` at source/unit; visual pending | Input/PhoneInput token assertions and semantic autofill CSS remove the mismatched near-black override |
| Adapt PhoneInput searchable country picker | `verified` at unit/accessibility; visual pending | Radix Popover with normalized Spain searches, click/Enter, Escape/outside focus return, and open/closed Axe |
| Adapt approved mobile dialog alignment | `partial` | Unit class contract passes; browser geometry and visual review remain pending |
| Adapt `SubmitButton` to explicit consumer copy | `verified` | Public type requires children; repository inventory found no unlabeled caller |
| Defer a global BottomSheet/native form system | `still-deferred` | No parallel overlay or shell was introduced |

The implementation introduces no shared domain schema, permission, mutation,
record data, default copy, raw palette, raw z-index, or inline visual style.
CRM remains the owner of English picker copy; `@loopdev/ui` owns only generic
country search and selection behavior.
The public exports remain on the existing forms route. UI/UX certification and
promotion remain blocked by Playwright responsive/interaction evidence and
final visual review, which were intentionally not run before visual approval.
