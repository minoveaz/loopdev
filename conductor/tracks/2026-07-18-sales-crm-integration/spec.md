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
