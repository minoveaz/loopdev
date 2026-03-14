# Specification: ModuleWorkspace family (v1.0)

## 1. Overview
The `ModuleWorkspace` family is the primary operational surface for all modules in LoopDev OS. It implements a 4-pane layout: Sidebar (Ontology), Flyout (Meaning), Canvas (Definition), and Inspector (Consequence).

## 2. Components

### 2.1 ModuleWorkspace
- **Role:** Orchestrator of the 4 panes.
- **Contract:** Manages visibility and resizing of `Sidebar`, `Flyout`, and `Inspector`.
- **States:** Desktop (Docked), Mobile (Overlay).

### 2.2 ModuleHeader
- **Role:** Context & Status Anchor.
- **Contract:** Displays breadcrumbs, entity status, and global module actions.
- **Constraints:** Fixed height of 56px.

### 2.3 ModuleSidebar
- **Role:** Navigation & Structure.
- **Contract:** Supports two modes: Module (Directory) and Entity (Tree).
- **Interactive:** Includes a search/filter input for large lists.

### 2.4 ModuleToolbar
- **Role:** Intent & Operations.
- **Contract:** Provides 3 slots (Left, Center, Right) for contextual actions.
- **Constraints:** Height of 44px. Proposes actions but delegates execution risks to Inspector.

### 2.5 UnifiedInspector
- **Role:** Consequence & Governance.
- **Contract:** Standardized shell with tabs (Context, Impact, Diff, Governance).
- **Blocks:** Uses reusable UI blocks (`ContextBlock`, `ImpactBlock`, etc.) for consistency.

## 3. Engineering Standards
- **Testing:** Every component must have a `.test.tsx` file covering primary user histories.
- **Documentation:** Every component must have `userHistories.md` and be present in Storybook.
- **Style:** 100% compliance with Blueprints v3.9 (Technical borders, semantic colors).
