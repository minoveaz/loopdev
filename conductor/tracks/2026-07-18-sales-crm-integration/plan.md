# Plan: Sales & CRM Suite Integration

## Phase 1: UI Component Engineering (LoopDev Standard Compliance)
In this phase, we will develop all required frontend components one-by-one. Transversal tools like the Document Scanner and Kanban boards are built as reusable library composites under `@loopdev/ui`, whereas views tied strictly to commercial processes remain in the CRM module workspace.

### 1.1 Reusable Library Components (Target: `@loopdev/ui`)
These components are built as generic, multi-tenant UI elements reusable across CRM, Health OS, or Quant Ops:
- [ ] **1.1.1 `KanbanBoard` (Composite - Workspace)**
  - Reusable generic board with built-in HTML5 drag & drop state machine (`useKanbanBoard`).
  - Target: `ds/packages/ui/src/components/composites/workspace/KanbanBoard/`
- [ ] **1.1.2 `OnboardingStepper` (Atom - Navigation)**
  - Navigation stepper for tracking multi-step operations.
  - Target: `ds/packages/ui/src/components/atoms/navigation/OnboardingStepper/`
- [ ] **1.1.3 `DocumentUploader` (Atom - Inputs)**
  - Drag & drop zone supporting image files, status previews, and dual-side front/back states.
  - Target: `ds/packages/ui/src/components/atoms/inputs/DocumentUploader/`
- [ ] **1.1.4 `DocumentPreview` (Composite - Workspace)**
  - Interactive SVG coordinates overlay rendering bounding-box highlights on uploaded images.
  - Target: `ds/packages/ui/src/components/composites/workspace/DocumentPreview/`
- [ ] **1.1.5 `ScanQualityReport` (Composite - Workspace)**
  - Indicators rendering image quality telemetry (sharpness, lighting, cropping, face presence).
  - Target: `ds/packages/ui/src/components/composites/workspace/ScanQualityReport/`
- [ ] **1.1.6 `DocumentDataComparison` (Composite - Workspace)**
  - Side-by-side data grid comparing extracted OCR records against database details.
  - Target: `ds/packages/ui/src/components/composites/workspace/DocumentDataComparison/`
- [ ] **1.1.7 `ValidationResults` (Composite - Workspace)**
  - System rule validations dashboard (checks for expiration, formatting, security warnings).
  - Target: `ds/packages/ui/src/components/composites/workspace/ValidationResults/`

### 1.2 CRM Specific Components (Target: `sales-crm` workspace)
- [ ] **1.2.1 `PipelineCard`**
  - Commercial card display featuring lead data, AI scores, brand styling (Sanitas/Adeslas), and logs.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/PipelineCard/`
- [ ] **1.2.2 `PipelineFilters`**
  - Filter bar containing queries, target brands, status indicators, and date ranges.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/PipelineFilters/`
- [ ] **1.2.3 `LeadHistory`**
  - Timeline widget showing note edits, call records, and system logs.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/LeadHistory/`
- [ ] **1.2.4 `LeadInspector`**
  - Sidebar drawer in the 4-Pane layout providing status managers and notes additions.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/LeadInspector/`
- [ ] **1.2.5 `QuotationForm`**
  - Modal form for inputting new opportunities, customer details, and coverage pricing.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/QuotationForm/`
- [ ] **1.2.6 `OnboardingCard`**
  - Card for monitoring onboarding stages, featuring progress gauges and action shortcuts.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/OnboardingCard/`
- [ ] **1.2.7 `ConversationAnalyzer`**
  - Workspace component with a text area to paste chat records, parsing highlights in real time.
  - Target: `apps/loopdev-os/src/app/sales-crm/components/ConversationAnalyzer/`

## Phase 2: Contracts, Databases & Secure API Integration
Set up the contracts package, database persistence schema, and backend endpoints required for the AI OCR/chat parsers.
- [ ] **2.1 Contracts Definition:** Declare Zod schemas and TypeScript models for `Opportunity`, `Client`, `OnboardingProcess`, `DocumentData` in `@loopdev/contracts`.
- [ ] **2.2 Google Gen AI Node Integration:** Install `@google/genai` on `apps/loopdev-os/package.json`.
- [ ] **2.3 API Route Handlers:** Write server-side Next.js endpoints:
  - `POST /api/sales-crm/ai/parse-document` (multimodal OCR parsing)
  - `POST /api/sales-crm/ai/analyze-chat` (information extraction from logs)
- [ ] **2.4 Client API Services:** Create front-end fetch services referencing the endpoints.

## Phase 3: Route Setup & State Assembly
Assemble the modular views under the `/sales-crm` workspace path and hook up state providers.
- [ ] **3.1 Suite Layout Setup:** Set up `apps/loopdev-os/src/app/sales-crm/layout.tsx` using `ModuleWorkspace`.
- [ ] **3.2 Context State Setup:** Initialize the state provider `src/app/sales-crm/context/index.tsx` to handle in-memory / localStorage updates.
- [ ] **3.3 Page Assembly:** Link components to routes:
  - `/sales-crm` (CrmOverviewDashboard)
  - `/sales-crm/pipeline` (PipelineKanbanBoard)
  - `/sales-crm/onboarding` (OnboardingDashboard)
  - `/sales-crm/scanner/[onboardingId]` (IdentityDocumentProcess)
  - `/sales-crm/customers` (ClientsDashboard)

## Phase 4: Quality, Audits & Production Hardening
- [ ] **4.1 Comprehensive Test Execution:** Run Vitest coverage on all components.
- [ ] **4.2 Performance & Memory Optimization:** Implement memoization and virtualization for long client lists.
- [ ] **4.3 Production Build Certification:** Compile using `pnpm build` to verify clean output.
