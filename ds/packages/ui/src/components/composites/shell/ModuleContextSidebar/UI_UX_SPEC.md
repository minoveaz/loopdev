# UI/UX Specification: ModuleContextSidebar

- Implementation: `ds/packages/ui/src/components/composites/shell/ModuleContextSidebar`
- Public export: `@loopdev/ui` / `ModuleContextSidebar`, `ContextPanel`
- Owner: `platform shell composite`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-08-17`
- Consumers: `SuiteRuntime`, `shell-showcase`, split workspace recipes
- Related track: `tracks/active/platform/2026-08-14-saas-visual-standardization.md`
- Spec version: `1.0`
- Platform target: `mobile-adapted`

## Purpose and ownership

Provides contextual navigation or selection belonging to the active module. It
owns the stable rail/column, header, collapse control, content scroll zone and
optional fixed footer. It does not own suite navigation, global context, domain
queries or a competing overlay manager.

## Anatomy

```text
SuiteCanvas
└── ModuleContextSidebar
    ├── header + collapse control
    ├── content (only permitted scroll zone)
    └── footer (fixed outside content scroll)
```

Desktop uses a semantic width token. Mobile transforms to a full-canvas drawer
when the parent composition opens it. `collapsedPresentation="trigger"`
delegates reopening to `SuiteSidebar`.

## Public contract

| Prop | Contract |
| --- | --- |
| `label` | Accessible module-context name and visible header identity |
| `width` | `narrow`, `standard`, `wide` or `extra-wide`; no arbitrary widths |
| `contentScrollable` | Controls only content `overflow-y`; header/footer never scroll |
| `collapsed` / `onCollapsedChange` | Controlled collapse state owned by runtime/consumer |
| `collapsedPresentation` | `rail`, `trigger` or `drawer`; visual mode, not a second manager |
| `headerSlot` / `footerSlot` | Module-owned additions with accessible controls |
| `showFooter` / `footerRows` | Explicit footer presence and bounded wrapping |

## Interaction and accessibility

- Collapse/expand is a native button with an accessible label and `aria-expanded`.
- Keyboard activation is Enter/Space; focus remains on the toggle.
- Escape, backdrop dismissal and mobile focus restoration belong to `AppShell`/runtime.
- Header labels truncate rather than create horizontal overflow.
- Content scrolling is optional and isolated; shell horizontal overflow is forbidden.
- Loading, empty, error, forbidden and read-only content states are consumer-owned.

## Responsive contract

| Viewport | Behavior | Overflow |
| --- | --- | --- |
| Desktop | Stable tokenized width; inline rail or column | Only content may scroll vertically |
| Tablet | Same semantic owner; constrained width | No page-level horizontal overflow |
| Mobile | Full-canvas drawer coordinated by shell | Drawer/content owns internal scroll |

## Usage and anti-patterns

```tsx
<ModuleContextSidebar
  label="Contact navigation"
  width="standard"
  contentScrollable
  collapsed={isCollapsed}
  onCollapsedChange={setCollapsed}
  footer={<ContextActions />}
>
  <ContactTree />
</ModuleContextSidebar>
```

Do not use it as a second `SuiteSidebar`, add arbitrary width classes, or place
global notifications/help inside it. Use `SuiteRuntime` and its contextual
action contract instead.

## Evidence and reopen triggers

- Technical contract: focused tests in `ModuleContextSidebar.test.tsx`.
- Responsive/visual/Axe: pending browser review.
- Reopen for new collapse modes, drawer ownership, states, widths or consumers.

## Decisions

| Decision | Current behavior | Required contract |
| --- | --- | --- |
| `adapt` | Header could create horizontal scrolling | Contain header overflow and truncate identity |
| `keep` | Content scroll is configurable | Preserve isolated vertical scrolling only in content |
| `keep` | Footer is outside content | Preserve fixed footer geometry |
