# User Histories: Color Token Management (v1.5)

**Goal:** Provide a governed, high-fidelity environment for defining brand colors with baked-in accessibility and context awareness.

## 📚 Historias de Usuario

### [A] Definition & Visibility
1. **[PALETTE] Instant Overview**
   - **HU:** As a Designer, I want to see tokens grouped by category so I can verify completeness at a glance.
2. **[TOKEN] Value Accuracy**
   - **HU:** As a Developer, I want to copy the resolved hex value in one click to use it in implementation.
3. **[CONTEXT] Context Preview**
   - **HU:** As a Designer, I want to toggle Light/Dark preview so I can validate the palette in both modes without leaving the page.

### [B] Governance & Safety
4. **[CONTRAST] Accessibility Guardrails**
   - **HU:** As a Brand Manager, I want contrast warnings with WCAG ratio to keep the system inclusive.
5. **[STATE] Safe Editing**
   - **HU:** As an Editor, I must be forced to create a draft before changing any token, ensuring production stability.
6. **[APPROVAL] Policy Enforcement**
   - **HU:** As an Admin, I want core token changes to require approval when policy demands.

### [C] Inspector & Context
7. **[DIFF] Visual Comparison**
   - **HU:** As a Reviewer, I want side-by-side swatch comparison in the Inspector before approving a change.
8. **[IMPACT] Usage Awareness**
   - **HU:** If I change a token, I want to know which modules/components will be affected.
9. **[EXPLAIN] Why & Next Step**
   - **HU:** When a token status is BLOCK/WARN, I want an explanation and recommended remediation in the Inspector.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `ColorTokenCard` con badge WCAG dinámico.
- [ ] Implementar `ColorContextBar` para switching Light/Dark.
- [ ] Conectar selección de token al Inspector (Context/Diff).
- [ ] Bloquear edición directa en estado `Published`.
