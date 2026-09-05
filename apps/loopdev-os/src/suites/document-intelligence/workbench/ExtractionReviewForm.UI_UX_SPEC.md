# UI/UX Specification: ExtractionReviewForm

- Implementation: `apps/loopdev-os/src/suites/document-intelligence/workbench/ExtractionReviewForm.tsx`
- Public export: `ExtractionReviewForm` (suite-local workbench feature)
- Owner: feature / ai-platform
- Runtime: client
- Directive: `use client`
- Status: in-progress
- Last reviewed: 2026-09-05
- Consumers: `/document-intelligence/new`, `/document-intelligence/:documentId`
- Related track: `tracks/active/ai-platform/2026-09-05-document-intelligence-poc-migration.md`
- Spec version: 1.1
- Contract version: export-profile view contract v1
- Platform target: mobile-adapted web

## Quick reference

- Use when: an operator reviews extracted identity fields and copies them into
  an insurer or international system.
- Do not use when: showing global business validation, provider telemetry, or
  configuring organization-level profiles.
- Main composition: `RecordWorkspace` record surface with `Form`, `FormField`,
  `Input`, `Textarea`, `Select`, `Badge`, and `Button`.
- Certification: in-progress; visual review and browser responsive evidence
  remain open.

## Purpose and ownership

The form lets an operator correct nullable extracted values and present the
same canonical extraction in the format required by the destination system.
The active profile changes visible field grouping and copy output only; it
does not create a second data model or mutate extraction semantics.

The form owns field editing, profile selection, profile-specific field labels,
copy formatting, and synchronization between `surnames` and
`firstSurname`/`secondSurname`. The context provider owns extraction state and
review decisions. `Extraction context` owns global validation and usage
diagnostics.

## Anatomy and profile contract

```text
RecordWorkspace record
└── Datos extraídos
    ├── Formato de datos selector + copy actions
    ├── profile-specific editable field grid with per-field copy actions
    └── review decision actions
```

The default profile is `aseguradora-1`:

| Profile | Visible identity shape | Copy output |
| --- | --- | --- |
| `aseguradora-1` | Nombre(s), primer apellido, segundo apellido | Insurer fields separated |
| `aseguradora-2` | Nombre(s), apellidos | Insurer/CRM grouped surnames |
| `icao-internacional` | Surnames, Given Names, issuing country, MRZ | ICAO labels and fields |

Profile definitions are typed in `export-profiles.ts`. They contain labels,
field order, descriptions, and output selection; fixture data and provider
logic remain consumer-owned.

## Interaction and accessibility

| Capability | User intent | Pointer/touch | Keyboard/focus | State feedback |
| --- | --- | --- | --- | --- |
| Select profile | Change destination format | Opens the single-select menu and selects one profile | Trigger is focusable; selection uses the DS `Select` contract | Field anatomy and description update |
| Edit field | Correct extracted value | Input or textarea editing | Native field order and labels | Existing confidence badge remains visible |
| Copy field | Copy one value for a destination form | Copy icon at the end of each field, including MRZ | Icon button is keyboard activatable and has a field-specific name | Status text confirms the field copied |
| Sync surnames | Keep grouped and separated values coherent | Editing either representation updates the other | Same field focus is retained | Canonical values stay in the form state |
| Copy fields | Paste into destination system | Button action | Button is keyboard activatable | Status text confirms copy |
| Copy JSON | Copy selected profile fields for technical use | Button action | Button is keyboard activatable | Status text confirms copy |

The selector is single-select: choosing an option closes the menu and keeps
focus on the trigger. There is no clear action because one profile is always
required. Each field exposes a copy action that copies only its current value;
the general `Copiar campos` and `Copiar JSON` actions remain available for
whole-profile export. Copy feedback uses a status announcement. Empty values
are copied as an empty string and remain visually empty.

## Responsive and state contract

| Viewport | Behavior |
| --- | --- |
| Desktop | Selector and copy actions share the form header; fields use two columns. |
| Tablet | Header actions wrap without horizontal overflow; fields remain readable. |
| Mobile | Header actions wrap to full-width-friendly controls; fields collapse to one column. |

Applicable states are `ready`, `read-only` (future consumer), `disabled`
(provider or permission boundary), and `error` (copy failure must surface to
the consumer). Loading and skeleton are owned by the workbench processing
state and are not rendered by this form.

## Approved composition and anti-patterns

Approved: render inside the workbench record surface and pass extraction data
through `WorkbenchPrototypeProvider`; use the profile catalog and DS
components.

Avoid: putting business validation cards inside the field grid, adding a
second profile-specific data model, placing profile selection in the shell
inspector, or implementing insurer-specific CSS/controls in `@loopdev/ui`.

Future CRM, Marketing Studio, and Operations consumers may reuse the canonical
profile catalog only when their destination contract is explicit. Configurable
organization profiles, persistence, and profile permissions reopen this spec.

## Evidence and change impact

- Contract: `export-profiles.ts` and `IdentityDocumentFields`
- Tests: `export-profiles.test.ts`, `ExtractionReviewForm.test.tsx`
- Static/type evidence: focused ESLint and `loopdev-os` TypeScript check
- Visual/responsive evidence: pending explicit visual review
- Reopen triggers: new profile, profile persistence, new field state, new
  consumer, or changed mobile transformation

## History

| Date | Version | Change |
| --- | --- | --- |
| 2026-09-05 | 1.1 | Added typed insurer and ICAO profile views with copy formatting and surname synchronization. |
| 2026-09-06 | 1.2 | Added accessible per-field copy actions while retaining whole-profile copy actions. |
