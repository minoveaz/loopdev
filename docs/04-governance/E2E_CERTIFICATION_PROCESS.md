# E2E Certification Process

This is the standard browser-certification process for shared UI primitives.
It is intentionally progressive: each stage must pass before the next one is
started.

## Seven steps

1. **Server**: Playwright starts or reuses the configured application server.
2. **Preflight**: `e2e/preflight.mjs` checks the base URL, HTTP status and CRM
   catalog marker before browsers launch.
3. **Smoke**: one desktop test verifies the route, root fixture and primary
   accessible selector.
4. **Selectors**: tests use scoped roles and fixture `data-testid` values;
   ambiguous global text selectors are not accepted.
5. **Desktop**: the complete component suite runs at desktop dimensions.
6. **Responsive matrix**: the same suite runs in desktop, mobile and
   mobile-compact projects, including light and dark themes where applicable.
7. **Evidence and cleanup**: static checks, test output and changed-file review
   are completed; generated `test-results/` artifacts stay untracked.

## Official commands

Run these from the repository root with the dev server available at
`PLAYWRIGHT_BASE_URL` (default `http://127.0.0.1:3001`):

```bash
pnpm e2e:preflight
pnpm e2e:smoke
pnpm e2e:desktop
pnpm e2e:matrix
```

The progressive shortcut runs the same sequence:

```bash
pnpm e2e:certify:filter-dropdown
```

The shortcut is component-specific by design. Future certifications should
add a component spec and matching `e2e:smoke:<component>`,
`e2e:desktop:<component>` and `e2e:matrix:<component>` scripts while keeping
the same order and preflight contract.

## Failure routing

- Preflight failure: fix server, route, build or authentication before running
  Playwright tests.
- Smoke failure: fix JSX, fixture structure, accessible naming or selectors.
- Desktop failure: fix the component contract or interaction before expanding
  to responsive projects.
- Responsive failure: inspect geometry, theme tokens and overflow at the
  failing viewport only.
- Evidence failure: do not stage screenshots, traces or `test-results/`.