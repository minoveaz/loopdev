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
