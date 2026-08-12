# Shell Showcase Contract

`/shell-showcase` is the executable reference for the LoopDev OS shell. It defines the approved
composition, navigation model, responsive geometry, tenant theme behavior, and selected states that
the product shell must preserve.

The contract has two enforcement layers:

- `e2e/shell-showcase.contract.spec.mjs` checks the accessible navigation flow and required states.
- `e2e/shell.visual.spec.mjs` checks approved screenshots for light and dark themes on desktop,
  mobile, and compact mobile viewports.

A shell change is not complete because the implementation compiles. It must also pass the contract.
If the intended experience changes, update the implementation and snapshots together, then review
the image diff as part of the change. Snapshot updates must be explicit:

```powershell
pnpm exec playwright test e2e/shell.visual.spec.mjs --update-snapshots
```

Do not use snapshot updates to hide accidental layout or interaction changes. A reviewer must approve
the new visual reference and the corresponding contract changes. The CI shell and frontend jobs run
these checks so unreviewed movement of the Showcase fails validation.
