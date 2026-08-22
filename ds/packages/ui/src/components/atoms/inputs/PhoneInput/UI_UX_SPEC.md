# UI/UX Specification: PhoneInput

- Implementation: `ds/packages/ui/src/components/atoms/inputs/PhoneInput/index.tsx`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-21`
- Consumers: `CRM ContactFormDialog`
- Related track: `tracks/active/crm/2026-08-13-crm-pilot-execution.md`
- Spec version: `0.2`
- Contract version: `phone-input-v1`
- Platform target: `mobile-adapted web`

## Purpose and ownership

`PhoneInput` lets a user enter an international phone number and find a country
quickly by name or calling code. It owns the phone-control presentation, native
input focus forwarding, accessible searchable country picker, normalized
filtering, and local help/error association. The consumer owns
label/help/error/search/empty copy, default country, validation, domain schema,
permissions, data, telemetry, and mutations.

## Public contract

- `countryPlaceholder`, `countrySelectLabel`, `countrySearchLabel`,
  `countrySearchPlaceholder`, and `countryNoResultsLabel` are optional
  consumer-owned locale overrides. Keeping them optional preserves the
  pre-picker API; when omitted, the underlying phone library's consumer labels
  remain the accessible fallback rather than adding shared domain copy.
- `numberInputProps` may provide `aria-describedby` and `aria-invalid`; these
  external relationships take precedence over local help/error ids.
- The forwarded ref resolves to the native phone input so form engines can
  focus an invalid field.
- `error` and `helperText` are mutually presented local feedback. Technical
  error payloads and PII must never be logged or sent to shared telemetry.

## Anatomy and interaction

```text
Consumer form field
└── PhoneInput
    ├── optional visible label
    ├── country picker trigger with flag and calling code
    │   └── Radix Popover
    │       ├── searchable combobox
    │       └── country listbox: flag, country label, calling code
    ├── native phone input
    └── optional helper or error
```

Tab order reaches the country trigger and phone input. Opening the trigger
autofocuses search. Filtering normalizes accents, plus signs, spaces, and
punctuation, so `Spain`, `+34`, and `34` all find Spain. Arrow keys move the
active option and Enter selects it. Selection closes the picker. Escape and
outside interaction close it, and close autofocus returns to the trigger.
Disabled/read-only state prevents opening. Native phone typing, paste, focus,
and blur remain owned by `react-phone-number-input`; pasting an international
number may update the selected country through the controlled value.

## Responsive, theme, and accessibility

- Width is fluid and must not create page-level horizontal overflow.
- Country code and phone value stay in one control row; labels/help/errors wrap.
- Field, trigger, search, and options pair `bg-lpd-bg-base` with
  `text-lpd-text-base`; placeholders use `text-lpd-text-muted`, and focus/caret
  use the semantic primary token. No `dark:` foreground/background override may
  split a tenant theme's readable token pair.
- Visible labels or another consumer-provided accessible name are required.
- Error state uses `aria-invalid` plus described text, never color alone.
- The trigger is an accessible button, the popup is a labelled dialog, search is
  a combobox controlling a labelled listbox, and each option exposes country
  and calling code. Focus forwarding, external ARIA relationships, the three
  Spain query forms, click/keyboard selection, Escape/outside dismissal, focus
  return, token classes, and closed/open Axe are covered by
  `PhoneInput.test.tsx`.
- Browser responsive, real-device phone interaction, high-contrast, and final
  visual evidence remain pending; status is not certified.

## Usage

```tsx
<PhoneInput
  id={id}
  countryPlaceholder="Country"
  countrySelectLabel="Country code"
  countrySearchLabel="Search countries"
  countrySearchPlaceholder="Search by country or calling code"
  countryNoResultsLabel="No countries found."
  numberInputProps={{
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
  }}
/>
```

Do not hardcode suite/domain copy in the atom, hide the country selector from
keyboard users, use the icon or flag as the only accessible name, add a second
native select behind the picker, or place schema/API/permission behavior in
this component.

## Technical evidence

| Dimension | Applicability | Status | Evidence |
| --- | --- | --- | --- |
| Security/data integrity | required | passed | No storage, logging, HTML sink, or telemetry |
| Data/state ownership | required | passed | Controlled value/change API; domain remains consumer-owned |
| Performance | required | in-progress | Memoized local filtering over the library country set; browser geometry pending |
| Resilience | not-applicable | not-applicable | Atom does not fetch or mutate |
| Maintainability/testing | required | in-progress | Direct unit/Axe covers 11 cases including search and dismissal; browser evidence pending |

Reopen for a native implementation, country-selector interaction change,
masking/formatting ownership, new state, new locale mechanism, or new consumer.

## Decisions and history

| Date | Decision | Result | Status |
| --- | --- | --- | --- |
| 2026-08-21 | `correct` theme pairing | Replace explicit light/dark surface and white-text overrides with paired semantic background, foreground, placeholder and caret tokens | implemented; visual evidence pending |
| 2026-08-21 | `adapt` country selection | Replace the transparent native select with a Radix Popover searchable picker using the existing country options and flags | implemented; UI/UX remains in-progress |
| 2026-08-21 | `keep` suite ownership | CRM supplies English picker copy and retains schema, validation, permissions and mutation behavior | verified by source and focused consumer tests |
