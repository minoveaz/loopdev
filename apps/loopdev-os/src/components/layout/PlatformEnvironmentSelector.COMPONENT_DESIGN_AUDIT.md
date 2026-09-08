# Component Design Audit: PlatformEnvironmentSelector

## Inventory

- Existing binary control: `PlatformHeaderControls.tsx` simulation toggle.
- Existing shared dropdown: `ds/packages/ui/src/components/atoms/surfaces/TechnicalDropdown`.
- Existing shared single select: `ds/packages/ui/src/components/atoms/inputs/Select`.
- Closest shell composition: `SuiteSwitcher` and `OrganizationSwitcher`.
- Owner: platform shell consumer in `apps/loopdev-os`.

## Decision

**Compose** `TechnicalDropdown` rather than create a new shared primitive.
`Select` is optimized for form fields; this control is a global shell action with
mode descriptions and no form submission.

## Scope

Keep the current header control footprint and semantic token treatment. Replace
the binary simulation affordance only when the runtime consumer is ready; this
slice introduces the explicit environment selector and leaves CRM data routing
for the following slice.

## Acceptance evidence

- The selector has one trigger and three mutually exclusive options.
- The active mode is visible without opening the menu.
- Keyboard and menu semantics come from `TechnicalDropdown`.
- No suite navigation or `@loopdev/ui` primitive is duplicated.
- Mobile composition does not force header overflow.
