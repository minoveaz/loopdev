---
id: sales-crm-integration
title: Sales & CRM Suite Integration
status: closed
created: 2026-07-18
updated: 2026-08-12
owner: sales-crm
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/2026-07-18-sales-crm-integration
---

# Sales & CRM Suite Integration

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

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

---

### spec.md

# Sales & CRM Suite — Integration Spec (v1.2)

> **Suite:** Sales & CRM (Commercial Suite)
> **Route:** `/sales-crm`
> **Goal:** Port the insurance CRM Mock into loopdev-os, aligning it with the `@loopdev/ui` design system and securing the AI services (OCR + Chat Analysis) via server-side Route Handlers.

---

## 1. Information Architecture (Target Views)

### A — Dashboard Overview (`/sales-crm`)
* **Component:** `CrmOverviewDashboard`
* **KPIs:** Active pipeline value (COP), monthly goal conversion rate, total won deals, active tasks.
* **Leads Queue:** Quick action list displaying AI-prioritized leads that require immediate call/contact.

### B — Commercial Pipeline (`/sales-crm/pipeline`)
* **Component:** `PipelineKanbanBoard` (using the reusable `KanbanBoard` composite).
* **Workflow:** Drag-and-drop opportunity cards across statuses: `NEW_LEAD`, `CONTACTED`, `QUOTE_SENT`, `ACCEPTED`, `ONBOARDING`, `REJECTED`, `DISCARDED`, `CONVERTED`.
* **Lead Editor:** Side drawer panel showing the timeline log, actions (log call, add note), and field editor.

### C — Onboarding & Stepper (`/sales-crm/onboarding`)
* **Component:** `OnboardingDashboard`
* **Steppers:** Status tracking for contracts in: `Recopilación de Datos`, `Enviado a Aseguradora`, `Póliza Emitida`, `Activación Completada`.
* **Activity Log:** Automated telemetry logging actions performed by both agents and AI.

### D — Document Scanning & Verification Desk (`/sales-crm/scanner/[onboardingId]`)
* **Component:** `IdentityDocumentProcess` (utilizing the reusable Document Scanner suite).
* **OCR Visualizer:** Dual-side card display with highlight boxes indicating where data was extracted from.
* **Scan Quality & Validation Report:** Section rendering safety checks (e.g. expiration date, OCR resolution, visual glare).

---

## 2. Reusable `KanbanBoard` Component Architecture

We will implement the Kanban Board as a generic, highly reusable component inside `@loopdev/ui` under the `workspace` composites category.

### 2.1 Props Contract (`types.ts`)
The component uses TypeScript Generics to render any model structure (Leads, Tasks, Orders):
```typescript
import React from 'react';

export interface KanbanColumn {
  id: string;
  title: string;
  countClass?: string;
  bgClass?: string;
}

export interface KanbanBoardProps<T> {
  columns: KanbanColumn[];
  items: T[];
  getColumnId: (item: T) => string;
  getItemId: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  onCardDrop?: (itemId: string, targetColumnId: string) => void | Promise<void>;
  getColumnMetrics?: (columnId: string, items: T[]) => { count: number; valueLabel?: string; };
  isLoading?: boolean;
  emptyStateSlot?: React.ReactNode;
}
```

---

## 3. Reusable Document Scanner Component Suite (`@loopdev/ui`)

Document scanning, visual OCR previewing, quality reporting, and data validations are general-purpose utilities needed across various SaaS modules (e.g. Patient intake, Invoices scanning, Brand Hub audits). We specify them as transversal components inside `@loopdev/ui`.

### 3.1 `DocumentUploader` (Atom - Inputs)
* **Goal:** A highly accessible area for single/multiple image uploads.
* **Properties:**
  - `onFilesSelected: (files: File[]) => void`
  - `allowedMimeTypes?: string[]`
  - `isDoubleSided?: boolean` (requires front and back assets)
  - `label?: string`

### 3.2 `DocumentPreview` (Composite - Workspace)
* **Goal:** A canvas component displaying document images with interactive highlights.
* **Properties:**
  - `imageUrl: string`
  - `highlights: Array<{ fieldId: string; value: string; boundingBox: Array<{ x: number; y: number }> }>`
  - `activeFieldId?: string | null`
  - `onHighlightClick?: (fieldId: string) => void`
* **Implementation:** The bounding-box array represents polygon vertices normalized between 0-100% or absolute pixels. An SVG overlay maps these points onto the image canvas dynamically.

### 3.3 `ScanQualityReport` (Composite - Workspace)
* **Goal:** Gauge card visualizing image processing parameters from the AI node.
* **Metrics:** Sharpness, lighting contrast, crop margins, human face presence. Each metric renders as a mini-gauge using `<MetricGauge>` or custom semantic indicators.

### 3.4 `DocumentDataComparison` (Composite - Workspace)
* **Goal:** Side-by-side verification table comparing extracted values against baseline system data (e.g. comparing OCR names to database records) to highlight discrepancies.

### 3.5 `ValidationResults` (Composite - Workspace)
* **Goal:** Strict status indicators checking business rules (expired alerts, fraud flags, or country code verification).

---

## 4. Secure AI Architecture (Gemini Integration)

All interactions with the `@google/genai` SDK must be moved to server-side Route Handlers to protect API keys:

### 4.1 OCR Parsing Route (`/api/sales-crm/ai/parse-document`)
* **Method:** `POST`
* **Payload:** `FormData` (front image, optional back image, insurance company).
* **AI Model:** `gemini-2.5-flash`
* **Response Schema:** Structured JSON defining extracted document fields, validation checks, scan quality, and bounding boxes.

### 4.2 Chat Analyzer Route (`/api/sales-crm/ai/analyze-chat`)
* **Method:** `POST`
* **Payload:** `{ conversationText: string }`
* **AI Model:** `gemini-2.5-flash`
* **Response Schema:** Structured JSON mapping extracted email, phone, bank IBAN, start date, and original text snippets.

---

### userHistories.md

# User Histories — Sales & CRM Suite

Here are the primary user stories and acceptance criteria for the integrated CRM module:

---

## US-1: Commercial Pipeline Board
**As a** Sales Agent
**I want to** manage my pipeline in a Kanban board
**So that** I can easily drag and drop opportunities between commercial stages and view lead metrics.

### Acceptance Criteria:
* Columns must show correct metrics (total deals count and sum of deal values in COP).
* Opportunities can be dragged between stages, triggering status updates.
* Clicking on any card opens the Lead Inspector drawer.
* Quick arrows on card footers allow shifting stages with one tap (ideal for mobile layout).

---

## US-2: B2B Onboarding Stepper
**As an** Operations Agent
**I want to** transition accepted deals into the onboarding phase
**So that** I can compile compliance checklists, track paperwork, and issue policies.

### Acceptance Criteria:
* Accepted deals show up under the Onboarding Dashboard.
* Stepper details progress in: Data Collection $\rightarrow$ Sent to Insurer $\rightarrow$ Policy Issued $\rightarrow$ Active.
* Every transition is logged inside an immutable Activity Log.

---

## US-3: AI Document Scanner (OCR & Bounding Boxes)
**As an** Operations / Compliance Agent
**I want to** scan the client's ID (DNI) and extract details automatically using Gemini
**So that** I don't have to input official records manually and can identify expired documents.

### Acceptance Criteria:
* Agent uploads Front and Back images of the DNI.
* Document is analyzed on the server side using Gemini's multimodal capabilities (no API key exposed on the client).
* Extracted data is filled into fields automatically, with bounding box overlays highlighting the scanned text.
* Any warnings (e.g. DNI expired, crop quality poor) show up in the verification report.

---

## US-4: AI WhatsApp Chat Analyzer
**As a** Sales Agent
**I want to** paste logs of WhatsApp conversations
**So that** the AI can extract email, phone numbers, and bank details automatically.

### Acceptance Criteria:
* An input textarea is provided to paste conversation text.
* The parser extracts emails, bank IBAN codes, phone numbers, and plans, matching them with original text snippets.
* Agent can review the suggestions before applying them.
