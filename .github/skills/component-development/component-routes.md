# Component routes

This file is the route reference for `component-development`.

## Shared design system

```text
ds/packages/ui/src/components/atoms/
ds/packages/ui/src/components/composites/
ds/packages/ui/src/components/composites/shell/
ds/packages/ui/src/components/composites/workspace/
```

Use `atoms` for broadly reusable primitives and `composites` for reusable
compositions. Shell and workspace components must follow the public contracts
documented by `platform-shell`.

## Suite application layers

```text
<suite>/shared/
<suite>/entities/
<suite>/features/
<suite>/widgets/
```

The exact application root is resolved from the implementation being changed.
Never infer a path from a document name alone; inspect neighboring code and
exports first.

## Placement rules

- `@loopdev/ui` must not depend on CRM, Marketing Studio, or another suite.
- `shared` may contain cross-feature utilities and UI with no business rule.
- `entities` owns entity presentation and entity-local state.
- `features` owns actions and business flows.
- `widgets` owns section-level composition.
- Shell and workspace ownership stays in the shared shell layer.
