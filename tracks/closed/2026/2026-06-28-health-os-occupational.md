---
id: health-os-occupational
title: Health OS Occupational Health Suite
status: closed
created: 2026-06-28
updated: 2026-08-12
owner: health
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/health-os-occupational_20260628
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Health OS Occupational Health Suite

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

# Plan: Health OS Occupational Health Suite

## Phase 1: Database & Contracts Configuration
- [ ] Task: Create PostgreSQL migrations for `corporate_accounts`, `job_profiles`, `patient_appointments`, `clinical_records`, and `aptitude_certificates`.
- [ ] Task: Apply RLS policies to `clinical_records` restricting read access only to users with clinical roles.
- [ ] Task: Define Zod schemas and TypeScript models in `@loopdev/contracts` for `Patient`, `ClinicalRecord`, and `AptitudeCertificate`.

## Phase 2: Core Asistencial Components
- [ ] Task: Implement `Cie10Searcher` autocomplete input component.
- [ ] Task: Create `SoapNoteInput` for clinical evaluations.
- [ ] Task: Create `AptitudeStatusPill` with semantic status colors (Apto, Apto con restricciones, No Apto).

## Phase 3: Route Setup & Views
- [ ] Task: Create the base directory and layouts for `apps/loopdev-os/src/app/health-os/`.
- [ ] Task: Build `/health-os/kam` page for commercial contract management.
- [ ] Task: Build `/health-os/company` page for B2B client autogestión (profesiogramas & scheduling).
- [ ] Task: Build `/health-os/clinical` desk page showing the patient queue and medical evaluation forms.

## Phase 4: Colombian Regulation Integration
- [ ] Task: Implement RIPS exporter utility service to output JSON format compliant with Resolución 2275 de 2023.
- [ ] Task: Set up XML billing generator configuration for Colombian health invoice requirements (DIAN integration).
- [ ] Task: Connect digital signature signing process for locking HCE clinical logs.

---

### spec.md

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

---

### userHistories.md

# User Histories: Occupational Health (zonaMedica)

**Goal:** Provide an industrial-grade management and clinical tool for occupational health operations in Colombia.

## 📚 User Histories

### [A] KAM Roles (Key Account Manager)
1. **[CONTRACTS] Client Onboarding**
   - **HU:** As a KAM, I want to configure a new Corporate Account with its custom pricing list (for CUPS codes) so that the billing is automatically calculated upon exam execution.
2. **[CREDIT] Prepaid & Postpaid Control**
   - **HU:** As a KAM, I want to set credit limits or prepaid exam balances for each company so that scheduling is automatically blocked if their account has outstanding balances or has run out of packages.
3. **[SLA] Operational Turnaround**
   - **HU:** As a KAM, I want to see the Average Turnaround Time (SLA) for certificate delivery so that I can prevent client complaints.

### [B] Corporate Clients (RRHH / SST)
4. **[PROFESIOGRAMA] Job Profile Customization**
   - **HU:** As a client SST Leader, I want to define job profiles linked to specific exam lists so that workers get the correct evaluations matching their roles.
5. **[SCHEDULING] Mass Scheduling**
   - **HU:** As a client HR Manager, I want to schedule list of employees directly from the portal, matching them to their preconfigured job profiles.
6. **[CERTIFICATES] Bulk Download**
   - **HU:** As a client HR Manager, I want to download Signed Aptitude Certificates for my workers without having access to their confidential medical histories.

### [C] Medical & Clinical Staff
7. **[QUEUE] Live Route Tracking**
   - **HU:** As a Receptionist, I want to check-in workers and track their clinical path status through stations so I know where they are inside the clinic.
8. **[SOAP] Medical Examination**
   - **HU:** As an Occupational Doctor, I want to see the preloaded battery of exams for the patient and fill out their SOAP evaluation forms using click-based templates to complete the task in under 5 minutes.
9. **[CIE10] Fast Diagnosing**
   - **HU:** As a Doctor, I want to quickly search for ICD-10 diagnostic codes so I can assign them to the medical assessment without typing full descriptions.
10. **[SIGNATURE] Record Locking**
    - **HU:** As an Occupational Doctor, I want to digitally sign the patient record to cryptographically lock it (unalterable history) as required by Colombian law.

### [D] Patients
11. **[CONSENT] Digital Signing**
    - **HU:** As a Patient, I want to read and sign the clinical consent form and Habeas Data authorization on a tablet at the check-in desk before entering my consultations.
12. **[RECOMMENDATIONS] Automated Delivery**
    - **HU:** As a Patient, I want to receive my medical recommendations and prescriptions in my email automatically after the doctor closes my consultation.
