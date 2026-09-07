# Platform Sandbox Runtime

**Status:** Proposed
**Owner:** Platform
**Issue:** [minoveaz/loopdev#218](https://github.com/minoveaz/loopdev/issues/218)

## Purpose

Provide one platform-owned runtime for `real`, `sandbox`, and `preview` environments.
Suites consume the same domain contracts regardless of the data origin. Sandbox is
interactive and local-only; Preview is deterministic and read-only.

## Boundaries

- `/packages/contracts`: public runtime and adapter contracts.
- `/apps/loopdev-os`: runtime provider, environment selector, local store, and suite
  registration.
- Suite folders: seed packs and adapters that implement the shared contracts.
- `/ds`: visual components only; no runtime state or domain persistence.

The runtime must not weaken authorization, RLS, API schemas, or production adapters.
It must not create suite-specific providers or a second navigation/shell.

## Proposed contract

The following shape is the design target for the implementation phase. Names and
serialization details remain subject to contract tests before promotion.

```ts
type PlatformEnvironmentMode = 'real' | 'sandbox' | 'preview';

type PlatformRuntimeContext = {
  mode: PlatformEnvironmentMode;
  session: RuntimeSession;
  organization: RuntimeOrganization;
  workspace: RuntimeWorkspace | null;
  permissions: RuntimePermissions;
  network: {
    reads: 'remote' | 'local';
    writes: 'remote' | 'local' | 'blocked';
  };
  persistence: 'remote' | 'local' | 'none';
  reset: () => Promise<void>;
};

type PlatformDataAdapter<TEntity, TQuery> = {
  list: (query: TQuery) => Promise<TEntity[]>;
  get: (id: string) => Promise<TEntity | null>;
};

type PlatformCommandAdapter<TCommand, TResult> = {
  execute: (command: TCommand) => Promise<TResult>;
};

type PlatformSeedPack = {
  suiteKey: SuiteKey;
  version: string;
  organizationId: string;
  workspaceIds: string[];
  entities: unknown;
  scenarios: string[];
  create: () => LocalRuntimeState;
};
```

### Invariants

1. `real` uses existing authenticated APIs and Supabase authorization.
2. `sandbox` never sends mutation requests to remote services.
3. `preview` is deterministic and read-only.
4. Seed identifiers satisfy production schemas, including UUID constraints.
5. State is namespaced by environment, organization, workspace, and schema version.
6. Reset restores the selected seed without affecting another browser/session.
7. A suite never branches on mock data inside a component; it receives adapter output.

## Existing implementation inventory

| Surface | Current location | Finding | Migration implication |
| --- | --- | --- | --- |
| Global simulation state | `apps/loopdev-os/src/providers/SimulationProvider.tsx` | Boolean `localStorage` flag with silent storage fallback | Replace with explicit runtime mode and namespaced persistence policy |
| Header control | `apps/loopdev-os/src/components/layout/PlatformHeaderControls.tsx` | Simulation toggle is visible only on large screens and has no permission contract | Reuse the platform header zone with an accessible environment selector |
| Provider composition | `apps/loopdev-os/src/app/layout.tsx` | Simulation provider is global, before query/auth providers | Introduce runtime at the platform boundary without moving shell ownership |
| Organization context | `apps/loopdev-os/src/providers/OrganizationProvider.tsx` | Remote organization loading plus E2E bypass fixture | Runtime must supply compatible context without changing Real behavior |
| Permission context | `apps/loopdev-os/src/providers/PermissionProvider.tsx` | Remote catalog/RPC permission resolution | Sandbox permissions must be explicit and testable |
| Workspace context | `apps/loopdev-os/src/providers/WorkspaceProvider.tsx` | Remote workspaces with organization-scoped local selection | Runtime namespace must include organization and workspace |
| CRM contacts | `apps/loopdev-os/src/suites/sales-crm/contacts/hooks/useContactsData.ts` | Environment decision is an app-level fixture flag | Move selection to the shared adapter boundary |
| CRM Customer 360 | `apps/loopdev-os/src/app/sales-crm/contacts/[contactId]/hooks/useCustomer360Data.ts` | Per-section hybrid mock/API fallback | Replace with one coherent CRM sandbox adapter |
| CRM seed data | `apps/loopdev-os/src/suites/sales-crm/contacts/contacts-design.fixture.ts` and `apps/loopdev-os/src/app/sales-crm/contacts/[contactId]/mocks/customer360Mocks.ts` | Fixtures are split and some IDs are not production UUIDs | Consolidate into a validated CRM seed pack |
| Communications fixture | `apps/loopdev-os/src/suites/sales-crm/communications/inbox-data-source.ts` | Existing fixture data-source seam | Register as a future seed-pack consumer |
| Document Intelligence | `apps/loopdev-os/src/suites/document-intelligence/workbench/workbench-context.tsx` | Local fixture/history persistence is suite-owned | Adapt behind the runtime persistence policy |
| Mobile environment | `apps/loopdev-mobile/src/data/environment.ts` and `src/data/data-source.ts` | Separate fixtures/Supabase/render-api resolver | Reconcile naming and contract semantics with the platform runtime |
| Existing platform contracts | `packages/contracts/src/platform/*.ts` | Shell, tenancy, navigation, and composition contracts exist | Add runtime contracts beside these; preserve SuiteRuntime/SuiteCanvas boundaries |

## Test-first design

- Contract tests run against every remote and sandbox adapter.
- Store tests cover seed creation, command application, reset, refresh, and
  organization/workspace isolation.
- Network policy tests fail on any sandbox write attempt.
- Selector and banner tests cover permission, keyboard, accessible name, mode
  persistence, and responsive behavior.
- Preview fixtures remain read-only and deterministic for visual tests.
- CRM acceptance scenarios cover Contact -> Lead -> Pipeline -> Customer 360.

## Current implementation slice

The first implementation slice intentionally contains only the public runtime
contracts, a framework-independent local store, and a provider mounted at the
platform boundary. The provider starts in `real` mode and does not replace the
legacy simulation toggle yet. This keeps the change reversible while CRM
adapters and the visible selector are developed separately.

Implemented files:

- `packages/contracts/src/platform/runtime.ts`
- `apps/loopdev-os/src/core/platform/runtimeStore.ts`
- `apps/loopdev-os/src/providers/PlatformRuntimeProvider.tsx`

## Sequencing

1. Approve this contract and inventory in the Platform Sandbox Runtime track.
2. Add contracts and test harnesses without changing CRM behavior.
3. Implement the generic local store and runtime provider.
4. Register CRM as the first seed pack and remove its hybrid fallbacks.
5. Register additional suites incrementally.
