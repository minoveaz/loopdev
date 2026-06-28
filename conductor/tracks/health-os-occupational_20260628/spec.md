# Health OS — Occupational Health ERP Spec (v1.0)

> **View:** Health OS Portal (zonaMedica)
> **Route:** `/health-os`
> **Goal:** Design the unified workspace for occupational health management, clinical care, and company billing for the IPS **zonaMedica**.

---

## 1. Information Architecture (Exact Modules)

### A — KAM Workspace (Commercial & Billing)
**Component:** `KamDashboard`
*   **KPIs:** Invoice totals (prepaid vs postpaid), active corporate accounts, contract expiration alerts.
*   **Contract Editor:** Configuration of pricing lists (CUPS codes) and billing style (credit limits vs package credits).
*   **SLA Monitor:** Tracks Average Turnaround Time (TAT) from patient check-in to certificate issuance.

### B — Corporate Portal (B2B Client)
**Component:** `CorporatePortal`
*   **Profesiograma Builder:** Interactive setup matching job profiles (e.g. "Height Worker") to medical batteries (e.g. Visiometria, Electrocardiograma).
*   **Appointment Dispatcher:** Mass uploading of workers to schedule them according to live IPS calendar availability.
*   **Certificates Desk:** Folder structure to view and bulk-download signed Aptitude Certificates (Apto/No Apto).

### C — Clinical Consultations Desk (Doctors & Specialists)
**Component:** `ClinicalDesk`
*   **Patient Queue:** Status matrix showing patient progress through different clinical exams (e.g., waiting room, visiometria complete, pending medical exam).
*   **SOAP Exam Form:** Plantilla estructurada (Subjective, Objective, Assessment, Plan) containing checkboxes and dropdowns for fast completion.
*   **CIE-10 Catalog Search:** Integrated database search of standard ICD-10 codes.
*   **Digital Seal & Signature:** Professional signing area that cryptographically locks the HCE from further modifications.

### D — Patient Reception Desk (Totem)
**Component:** `PatientTotem`
*   **Document Scanner:** Scanning Colombian ID (Cédula) to load patient profiles.
*   **Consent Pad:** Digital signature input for clinical authorization and Habeas Data consent.

---

## 2. Component System (Reusables)

### 2.1 Atoms
*   `CupsBadge`: Displays the CUPS code and standard price.
*   `AptitudeStatusPill`: Displays "Apto", "Apto con Restricciones", or "No Apto".
*   `TriageLevelPill`: Color-coded priority indicator (Triage 1-5).

### 2.2 Molecules
*   `Cie10Searcher`: Direct search autocomplete for ICD-10 diagnostic entries.
*   `SoapNoteInput`: Structured textareas and metrics inputs for SOAP records.
*   `ProfesiogramaRow`: Renders cargo name, risk level (ARL), and the mapped list of exams.

### 2.3 Composites
*   `PatientQueueTable`: Displays workers currently in the IPS and their active route.
*   `ContractsManager`: Billing configuration workbench for KAMs.
