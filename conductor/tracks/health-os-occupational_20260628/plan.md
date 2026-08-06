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
