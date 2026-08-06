# User Histories: Brand Rules Engine (v1.0)

**Goal:** Establish a declarative, explainable, and versioned governance system that transforms "human rules" into machine-executable laws.

## 📚 Historias de Usuario

### [A] Rule Definition & Logic
1. **[DECLARATIVE] No-Code Rules**
   - **HU:** As a Brand Admin, I want to define governance rules (Thresholds, Operators, Metrics) without writing code, so that I can adapt the system to new brand requirements quickly.
2. **[DOMAINS] Ontology Navigation**
   - **HU:** As a user, I want rules grouped by domains (Identity, Visual, Typography) so that I can easily find and manage the specific constraints of each brand area.
3. **[TARGETING] Granular Scope**
   - **HU:** As a Designer, I want to apply rules to specific targets (e.g., "only background color tokens") so that the governance is precise and doesn't trigger false positives.

### [B] Enforcement & Severity
4. **[SEVERITY] Control Outcomes**
   - **HU:** As a Brand Guardian, I want to decide if a rule violation should only "WARN" (allow with ack) or "BLOCK" (prevent publishing) to balance flexibility and strict compliance.
5. **[POLICY] Global Enforcement**
   - **HU:** As an Admin, I want to define a global severity policy (e.g., "BLOCK always prevents publish") to ensure consistency in how rules are enforced across the entire tenant.

### [C] Explainability & AI
6. **[EXPLAIN] Human-Readable Logic**
   - **HU:** As a Content Creator, when a rule blocks me, I want to see a clear explanation (Why, Risk, How to Fix) so that I can resolve the issue without calling support.
7. **[EXAMPLES] DO/DON'T Guidance**
   - **HU:** As a Designer, I want to see visual micro-examples of what is allowed and what isn't for each rule to avoid ambiguity.
8. **[AI_CONTEXT] Machine Meaning**
   - **HU:** As a system, I need the rules to be structured in JSON so that AI agents can understand brand boundaries during automated layout or copy generation.

### [D] Governance & Drafts
9. **[SAFE_EDIT] Draft-Only Edits**
   - **HU:** As an Editor, I must be forced to create a Brand Draft before modifying rules, ensuring the "laws" of the live brand are never changed by accident.
10. **[APPROVAL] Sensitive Gates**
    - **HU:** As a Legal Officer, I want to flag specific rules (like Forbidden Language) as "Approval Required" so that any change to them must be signed off by my department.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `RuleRow` con badges de severidad y resumen de condición.
- [ ] Implementar `RuleEditor` con estados Read-only/Draft.
- [ ] Implementar `RuleDomainRail` con contadores de alertas/bloqueos.
- [ ] Implementar `ExplainTemplateEditor` (Why/Risk/Fix/Examples).
- [ ] Integrar con el Inspector (Tabs: Context, Validation, Explain, Diff, Impact).
- [ ] Soporte para matriz de aprobación por dominio.
