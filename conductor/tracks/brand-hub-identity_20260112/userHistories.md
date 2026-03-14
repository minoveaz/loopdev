# User Histories: Brand Identity Definition (v1.1)

**Goal:** Establish the semantic source of truth for the brand.

## 📚 Historias de Usuario

### [A] Definition & Structure
1. **[NARRATIVE] Semantic Foundation**
   - **HU:** As a Brand Manager, I want to define Mission, Vision, and Values in separate fields so that AI agents can consume them individually without confusion.
2. **[VOICE] Operational Guidance**
   - **HU:** As a Copywriter, I want to see clear "Do" and "Don't" examples side-by-side so I understand the boundaries of the brand voice.
3. **[CLAIMS] Legal Safety**
   - **HU:** As a Legal Officer, I want to define a list of "Forbidden Words" that triggers alerts in the campaign editor if used.
4. **[PROMISE] Brand Promise**
   - **HU:** As a Brand Manager, I want to define a Brand Promise so creators understand the single sentence contract the brand makes to customers.

### [B] Governance & Control
5. **[STATE] Safe Editing**
   - **HU:** As an Editor, I want to be forced to "Create Draft" before modifying identity fields, ensuring the live brand is never accidentally broken.
6. **[DIFF] Change Visibility**
   - **HU:** As a Reviewer, I want to see exactly what changed in the "Vision" text compared to the published version (diff highlight) before approving.
7. **[APPROVAL] Policy-aware actions**
   - **HU:** As an Admin, I want identity changes to require approval when governance policy demands, with mandatory justification.

### [C] Inspector & Context
8. **[INSPECT] Claim Context**
   - **HU:** As a user, when I click on a regulated claim, I want the Inspector to tell me *why* it is regulated (e.g., "Restricted by EU Law").
9. **[IMPACT] Voice Radius**
   - **HU:** As an architect, I want to see which channels are using the "Formal" tone profile via the Inspector's Impact tab.
10. **[EXPLAIN] Why this matters**
    - **HU:** As a user, when a rule/claim is blocking, I want the Inspector Explain tab to tell me the risk and recommended next action.

### [D] Resilience & Onboarding
11. **[EMPTY] Guided Setup**
    - **HU:** As a user setting up a new brand, I want the Narrative section to show prompts (e.g., "Our mission is to...") rather than a blank box.
12. **[RESILIENCE] Partial load**
    - **HU:** As a user, if Voice profiles fail to load, I want Narrative and Claims to remain usable.
13. **[DEEPLINK] Shareable review**
    - **HU:** As a reviewer, I want a link that opens the Inspector on a specific field (e.g., Vision) and shows Diff, so reviews are fast.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `StructuredTextBlock` con estados de lectura/edición.
- [ ] Implementar `ToneProfileCard` con layout de dos columnas (Do/Don't).
- [ ] Implementar `ClaimList` con severidad y jurisdicción.
- [ ] Bloqueo de edición en `Published`.
- [ ] Inspector abre tabs correctas al hacer click en campos.
- [ ] Soporte de Deep-link (`?inspect=...`).
- [ ] Mock Data robusto: `LoopDev Identity`.