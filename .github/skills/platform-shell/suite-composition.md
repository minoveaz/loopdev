# Suite Composition

## Adding a Suite

1. Define the suite identity and route in the existing suite configuration or fixture pattern.
2. Define a `NavigationSchema` with suite metadata, groups, items, priorities, and routes.
3. Use `SuiteShell` and `SuiteSidebar` rather than creating suite-specific shell primitives.
4. Pass organization access through `AccessMap`; hidden modules must be filtered before rendering.
5. Use `activeModuleId` and `onNavigate` for active state and routing.
6. Put suite-specific content in the suite center/right slots or the suite's page composition.
7. Add focused tests for the schema, active route, permissions, and shell modes.

## Navigation Schema Guidelines

- Keep group and item IDs stable.
- Use explicit priorities for deterministic ordering.
- Give every navigable item a `NavRouteRef`.
- Keep `overview` filtering and access filtering in the shared navigation path.
- Do not encode organization-specific business rules in the shared sidebar component.
- Do not put arbitrary JSX in the schema when an existing navigation contract is sufficient.

## Styling and Theming

- Use semantic design tokens and existing shell atoms.
- Use the suite accent for suite-specific active indicators where the contract supports it.
- Do not hardcode tenant colors in shared components.
- Do not recolor the LoopDev platform logo from the organization theme.
- Preserve the shell's technical boundaries, density, and interaction states.

## Desktop Layout Expectations

- `expanded` occupies the normal sidebar column.
- `rail` occupies the compact rail column.
- `hover` keeps a stable rail host and overlays the expanded sidebar over center content.
- The center content must not move when hover expansion occurs.
- The footer must not obscure the last navigation item.

Responsive behavior is intentionally a separate shell mode and should not be introduced into a desktop suite composition change.
