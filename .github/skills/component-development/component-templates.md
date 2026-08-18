# Component templates

Use the smallest template that matches the ownership layer. Templates are
structural starting points, not permission to create a new component without
inventory, reference discovery, and duplicate review.

## Shared atom

```text
ds/packages/ui/src/components/atoms/<category>/<ComponentName>/
├── index.tsx
├── types.ts
└── <ComponentName>.test.tsx
```

Add `use<ComponentName>.ts` only when the atom has reusable interaction state.
The component must expose a small, semantic public contract and use approved
tokens and primitives.

## Shared composite

```text
ds/packages/ui/src/components/composites/<category>/<ComponentName>/
├── index.tsx
├── types.ts
├── <ComponentName>.test.tsx
├── certification/
│   └── source-contract.md
└── README.md
```

Add `fixtures.ts` only when stable representative data is needed. Add a
Playwright spec only when the component has a registered visual, responsive,
or interaction contract.

## Shell or workspace component

```text
ds/packages/ui/src/components/composites/<shell-or-workspace>/<ComponentName>/
├── index.tsx
├── types.ts
├── <ComponentName>.test.tsx
├── interaction-contract.ts
└── README.md
```

Read and follow `platform-shell` before changing this layer. Shell components
must not contain suite business rules.

## Suite entity, feature, or widget

```text
<suite-root>/
├── entities/<EntityName>/
│   ├── index.tsx
│   ├── types.ts
│   └── <EntityName>.test.tsx
├── features/<FeatureName>/
│   ├── index.tsx
│   ├── types.ts
│   └── <FeatureName>.test.tsx
└── widgets/<WidgetName>/
    ├── index.tsx
    ├── types.ts
    └── <WidgetName>.test.tsx
```

Use only the layer being implemented; do not create all three folders by
default. Suite components may use domain contracts, but may not be promoted
to `@loopdev/ui` without a second real consumer and promotion evidence.

## File responsibilities

- `index.tsx`: public component and public type exports.
- `types.ts`: explicit props, state, and slot contracts.
- `use<ComponentName>.ts`: reusable interaction or state logic only.
- `*.test.tsx`: behavior, states, keyboard, and accessibility coverage.
- `interaction-contract.ts`: shell/workspace interaction guarantees only.
- `README.md`: non-obvious composition, ownership, and usage constraints.
- `fixtures.ts`: deterministic examples for tests or registered visual checks.
- `certification/source-contract.md`: required manifest ownership and zero-hardcode
    contract before technical or UI/UX certification.

## Source-contract certification

Every component that can become certified must be registered in
`scripts/certification/source-contract-manifest.json`. The shared gate checks
the actual implementation and public types for product copy, fixture data,
raw palette values, literal z-indexes and inline visual styles. Test and
showcase fixtures may contain representative data, but production component
source may not. A missing manifest entry or missing fixture path blocks
certification.

Do not add `stories`, `Example.tsx`, or speculative files unless an active
repository contract explicitly requires them.
