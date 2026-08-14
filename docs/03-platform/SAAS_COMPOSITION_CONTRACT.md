---
title: SaaS configurable composition contract
status: phase-1-proposed-contract
owner: platform
reviewed_at: 2026-08-14
---

# SaaS configurable composition contract

This contract lets suites compose variable views inside platform-owned
recipes. It describes intent and constraints; it does not expose arbitrary
pixel positioning.

## Declarative shape

```ts
type ViewComposition = {
  recipe: 'SuiteOverview' | 'DataWorkspace' | 'SplitWorkspace' |
    'RecordWorkspace' | 'BoardWorkspace' | 'ImmersiveWorkflow' | 'CreativeEditor';
  grid: {
    columns: 12 | 8 | 4;
    gap: 'sm' | 'md' | 'lg';
  };
  regions: Array<{
    id: string;
    slot: string;
    component: string;
    colSpan: number;
    rowSpan?: number;
    order?: number;
    responsive?: {
      tablet?: 'stack' | 'full' | 'preserve';
      mobile?: 'stack' | 'full' | 'hidden';
    };
  }>;
};
```

## Example

```ts
const overview: ViewComposition = {
  recipe: 'SuiteOverview',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'summary', slot: 'summary', component: 'StatusCardGroup', colSpan: 7 },
    {
      id: 'database-map',
      slot: 'visual-canvas',
      component: 'TechnicalCanvas',
      colSpan: 5,
      rowSpan: 2,
      responsive: { mobile: 'full' },
    },
    { id: 'metrics', slot: 'metrics', component: 'MetricCardGrid', colSpan: 12 },
  ],
};
```

## Platform constraints

- `recipe` must be registered by Platform.
- `slot` must be allowed by the recipe.
- `component` must be registered and compatible with the slot.
- `colSpan` cannot exceed the recipe grid columns.
- `rowSpan` has a recipe-defined maximum.
- `id` values must be unique.
- Ordering is declarative; pixel coordinates are forbidden.
- Responsive behavior must be explicit for regions that do not naturally
  stack.
- Surface nesting and depth order must be explicit; a child region cannot rely
  on the same effective background and border as its parent.
- A recipe may reject an otherwise valid region when density, accessibility or
  interaction constraints are violated.
- Hidden or forbidden components must be removed before composition.
- The composition must provide required states and an accessible keyboard path.

## Recipe capability matrix

| Recipe | Default columns | Variable regions | Free positioning |
| --- | ---: | --- | --- |
| `SuiteOverview` | 12 | yes | no |
| `DataWorkspace` | 12 | limited | no |
| `SplitWorkspace` | 12 | bounded list/detail spans | no |
| `RecordWorkspace` | 12 | bounded tabs/inspector | no |
| `BoardWorkspace` | 12 | registered board items | bounded canvas only |
| `ImmersiveWorkflow` | 12 | registered workflow regions | bounded canvas only |
| `CreativeEditor` | 12 | assets, stage, transport, timeline, inspector | bounded editor canvas |

## Ownership

- Platform owns the schema, recipe registry, slot registry and validation.
- `@loopdev/ui` owns the rendering primitives and layout engine.
- Suites provide composition declarations and domain components.
- Product tracks own view-level evidence and exceptions.

## Validation gates

1. Schema validation rejects unsupported recipes, slots, components and spans.
2. Render validation confirms stable layout and required states.
3. Responsive validation confirms stacking or approved transformation.
4. Accessibility validation confirms focus order and non-visual alternatives.
5. Performance validation limits region count and expensive visual effects.
