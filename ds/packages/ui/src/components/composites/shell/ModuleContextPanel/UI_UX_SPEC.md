# UI/UX Specification: ModuleContextPanel

- Implementation: `ds/packages/ui/src/components/composites/shell/ModuleContextPanel`
- Public export: `@loopdev/ui` / `ModuleContextPanel`
- Owner: `platform shell composite`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-08-17`
- Consumers: `SuiteRuntime`, split workspace recipes, future CRM record inspectors
- Related track: `tracks/active/platform/2026-08-14-saas-visual-standardization.md`
- Spec version: `1.0`
- Platform target: `mobile-adapted`

## Purpose and ownership

Provides module-owned detail, inspector and secondary actions. It owns stable
width, header/close affordance, isolated content scrolling and fixed footer.
It does not own global context, module navigation, data fetching or page-level
overlay state.

## Anatomy

```text
SuiteCanvas
└── ModuleContextPanel
    ├── header + optional close action
    ├── content (only permitted scroll zone)
    └── footer (fixed outside content scroll)
```

`inline` is the desktop default. `overlay` adds the panel surface treatment;
mobile full-canvas drawer positioning remains coordinated by the shell.

## Public contract

| Prop | Contract |
| --- | --- |
| `label` | Accessible panel name and visible header identity |
| `width` | Shared semantic width token; no page-local pixel widths |
| `presentation` | `inline` or `overlay`, without creating a new overlay manager |
| `contentScrollable` | Controls only content `overflow-y` |
| `onClose` | Optional native close action; parent owns panel visibility |
| `headerSlot` / `footerSlot` | Consumer-owned controls with native semantics |
| `showFooter` / `footerRows` | Explicit footer presence and bounded wrapping |

## Interaction and accessibility

- Close is a native button labelled `Close <label>` when supplied.
- Header labels truncate and never introduce horizontal scrollbar.
- Content scrolling is isolated from header/footer and is optional.
- Escape, outside click and focus restoration belong to the runtime/AppShell.
- Consumer controls own loading, error, forbidden, read-only and recovery semantics.

## Responsive contract

| Viewport | Behavior | Overflow |
| --- | --- | --- |
| Desktop | Stable semantic width, inline or overlay presentation | Only content may scroll vertically |
| Tablet | Preserve panel ownership and close action | No shell horizontal overflow |
| Mobile | Full-canvas drawer through the shell composition | Drawer/content owns internal scroll |

## Usage and anti-patterns

```tsx
<ModuleContextPanel
  label="Contact details"
  width="standard"
  presentation="inline"
  onClose={closeInspector}
  footer={<InspectorActions />}
>
  <ContactDetails />
</ModuleContextPanel>
```

Do not render it directly beside a second overlay manager, put suite navigation
inside it, or replace semantic widths with arbitrary classes. Compose it through
`SuiteRuntime`.

## Evidence and reopen triggers

- Technical contract: focused tests in `ModuleContextPanel.test.tsx`.
- Responsive/visual/Axe: pending browser review.
- Reopen for new presentation modes, drawer ownership, widths, states or consumers.

## Decisions

| Decision | Current behavior | Required contract |
| --- | --- | --- |
| `adapt` | Header could create horizontal scrolling | Contain header overflow and truncate identity |
| `keep` | Content scroll is configurable | Preserve isolated vertical scrolling only in content |
| `keep` | Footer is outside content | Preserve fixed footer geometry |
