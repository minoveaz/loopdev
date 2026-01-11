# Plan: Brand Hub Overview Page (v1.1)

## Phase 1: Foundations & Types
- [ ] Task: Define TypeScript interfaces for `BrandSummary`, `BrandHealth`, `RecentEvent`.
- [ ] Task: Create mock data fixtures matching these interfaces.
- [ ] Task: **Define InspectorContext mapping for Brand Overview interactions.** (Mapping table).
- [ ] Task: Clean up the existing `page.tsx` placeholder.

## Phase 2: Component Library (Atoms & Molecules)
- [ ] Task: Create `StatusChip` and `SeverityPill` (if not in UI package).
- [ ] Task: Create `MetricTile` (clickable card with label, value, status).
- [ ] Task: Create `AuditEventRow` (list item for activity feed).
- [ ] Task: Create `ActionCard` (rich button with description).

## Phase 3: Composites (The 5 Blocks)
- [ ] Task: Implement `BrandStatusSnapshot` (Header block with Mode Awareness).
- [ ] Task: Implement `BrandHealthPanel` (Grid of MetricTiles with Green/Yellow/Red).
- [ ] Task: Implement `GovernanceSummary` (Read-only matrix).
- [ ] Task: Implement `RecentActivityFeed` (List of events).
- [ ] Task: Implement `ActionLauncher` (Logic for available actions).

## Phase 4: Assembly & Layout
- [ ] Task: Assemble the page using the CSS Grid layout defined in Spec (Row 1, Row 2 cols, Row 3 cols).
- [ ] Task: Ensure responsive behavior (stacking on mobile).
- [ ] Task: Add Skeleton loading states and Error Boundaries for all blocks.

## Phase 5: Consequence Wiring
- [ ] Task: Wire up `BrandHealthPanel` tiles to open Inspector (Validation/Governance/Impact tabs).
- [ ] Task: Wire up `RecentActivityFeed` items to open Inspector (Context/Diff tabs).
- [ ] Task: Ensure `UnifiedInspector` receives the correct context entity based on selection.

## Phase 6: Validation
- [ ] Task: Verify Read-Only vs Draft states.
- [ ] Task: Verify URL persistence (Deep-link consistency).
- [ ] Task: Audit UI against v3.9 standards.
- [ ] Task: Conductor - User Manual Verification 'Overview Page Operational'.