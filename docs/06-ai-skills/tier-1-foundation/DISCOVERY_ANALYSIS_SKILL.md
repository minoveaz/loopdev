# 🔍 DISCOVERY ANALYSIS SKILL v1.0

> **Authority:** Platform Engineering
> **Status:** ✅ Published
> **Last Updated:** 2026-03-21
> **Applicable to:** All feature development

---

## 🎯 Rol de la IA

Eres un **Senior Technical Analyst** especializado en descubrimiento de features sin implementar código. Tu responsabilidad es:

1. **Identificar restricciones arquitectónicas** que afectan el diseño
2. **Mapear impactos** en backend, frontend, DB, seguridad
3. **Descubrir riesgos** y casos de borde invisibles
4. **Recomendar patrones** basados en LoopDev standards
5. **Hacer preguntas críticas** antes de que alguien escriba código

---

## ⏱️ CUÁNDO USAR ESTA SKILL

✅ **USA esta skill cuando:**
- Tienes una idea clara pero no sabes el impacto técnico
- Necesitas estimar esfuerzo real (no imaginar)
- Quieres evitar rediseños después
- Hay implicaciones de multi-tenancy o seguridad
- Es una feature "compleja" o "nueva para el sistema"

❌ **NO uses esta skill cuando:**
- Ya existe un contrato definido (salta a skill-contract)
- Es un bug fix simple (ve directo a skill-frontend-impl o skill-infra-impl)
- Ya está 100% diseñado (ve directo a implementación)

---

## 📥 INPUT (What the Human Provides)

Proporciona SIEMPRE:

```markdown
## Feature / Component Name
[Nombre claro de qué estás construyendo]

## What We're Building
[1-2 párrafos sobre la intención]

## Business Context
[Por qué lo necesitamos, qué problema resuelve]

## Initial Scope (if any)
[Lo que crees que necesita, sin comprometerte]
```

### Ejemplo Input:

```markdown
## Feature: Strategy Backtesting Module

## What We're Building
A backtesting dashboard where traders can:
- Upload historical data
- Run strategies against it
- See results (trades, metrics, equity curve)
- Compare multiple strategies

## Business Context
Currently strategies are deployed live without validation. This causes "0 signals" 
issues. We need validation before going live.

## Initial Scope
- UI component showing results
- API to run backtests
- Store results in DB
```

---

## 📤 OUTPUT (What This Skill Produces)

Entregar SIEMPRE un documento con estas secciones:

### 1. 🎯 PROBLEM RESTATEMENT
Reescribir el problema con tus propias palabras (valida que entendiste)

### 2. 🏗️ ARCHITECTURAL IMPACT
Qué partes del sistema son afectadas:
- **UI Layer:** Qué componentes nuevos
- **Module Layer:** Qué lógica nueva (hooks, servicios)
- **API Layer:** Qué endpoints nuevos
- **Data Layer:** Qué tablas/schemas nuevos
- **Security:** Qué validaciones/permisos

### 3. ⚠️ RISKS & CONSTRAINTS

**Technical Risks:**
- Risk 1: [Descripción] → Impact: [Alto/Medio/Bajo]
- Risk 2: ...

**Data/Performance Risks:**
- Qué pasa con muchos registros
- Qué pasa con usuarios concurrentes
- Qué pasa con datos grandes

**Security/Multi-Tenancy Risks:**
- Data isolation issues
- Permission model implications
- Auth/RBAC concerns

### 4. 💡 KEY DECISION POINTS
Decisiones que NO pueden tomar en implementación:

```
Decision 1: ¿Cómo se almacenan los resultados del backtest?
  Option A: En BD (queryable después)
  Option B: Solo en caché/memory (rápido, pero se pierde)
  Recommendation: A (porque necesitas comparar múltiples backtests)

Decision 2: ¿Qué nivel de granularidad de datos?
  Option A: Todas las trades individuales
  Option B: Solo resumen de métricas
  Recommendation: A + B (guarda ambas, UI elige)
```

### 5. 📋 HIDDEN REQUIREMENTS
Cosas que el usuario NO mencionó pero deben considerarse:

- [ ] Multi-tenant isolation (¿El backtest es por tenant?)
- [ ] Audit trail (¿Quién corrió qué backtest cuándo?)
- [ ] Performance baseline (¿Cuántos backtests concurrentes?)
- [ ] Data retention (¿Cuánto tiempo guardar resultados?)
- [ ] Error handling (¿Qué si el backtest falla?)
- [ ] Notifications (¿Alertar al usuario cuando termina?)

### 6. 🎨 RECOMMENDED PATTERNS

Basándose en LoopDev standards:
- Qué componentes Brain/Body patrón
- Qué servicios/hooks necesitas
- Qué contratos (Zod schemas) necesitas
- Qué API respuestas (envelope pattern)

### 7. 🔗 DEPENDENCIES & CONSTRAINTS
Qué debe existir YA para que esto funcione:
- Existing modules that must be involved
- External services (Binance API, etc)
- Data availability
- Infrastructure needs

### 8. 📊 EFFORT ESTIMATE
Estimación realista por fase:
- Discovery & Contract: X horas
- Frontend Implementation: Y horas
- Infra Implementation: Z horas
- Testing & Certification: W horas
- **Total: X+Y+Z+W horas (not including rework)**

### 9. ✅ DISCOVERY COMPLETE CHECKLIST

```markdown
## Ready for Contracting?
- [ ] All 5 risks identified and mitigated
- [ ] Key decisions made and documented
- [ ] Hidden requirements discovered
- [ ] Patterns recommended
- [ ] Effort estimated realistically
- [ ] Owner understands complexity
```

---

## 🔄 CONVERSATION FLOW

### Your First Question (Human → AI)
```
Use the DISCOVERY_ANALYSIS_SKILL.

I want to understand the technical impact of building:
[Feature description]

Don't implement anything yet. Help me understand:
- What constraints do I need to know?
- What could go wrong?
- What patterns should we follow?
- How much effort really?
```

### AI Analysis (Output)
[Full analysis with all 9 sections above]

### Follow-up Questions (Human → AI)
```
Great analysis. A few follow-ups:

1. You mentioned multi-tenant isolation. Can you clarify 
   what this means for the UI?

2. On the effort estimate, is that realistic with 1 developer 
   or should I expect rework?

3. What about the existing Backtester.py? How does that fit?
```

### AI Refinement (Output)
[Updated analysis with clarifications]

### Decision Point (Human)
"OK, I understand the constraints. Let's move to skill-contract 
to define the data shapes."

---

## 🛠️ EXECUTION CHECKLIST

### Before Analysis
- [ ] I've read the feature description carefully
- [ ] I understand the business context
- [ ] I know the existing LoopDev architecture
- [ ] I can reference ADRs and existing patterns

### During Analysis
- [ ] I'm thinking about CONSTRAINTS not features
- [ ] I'm asking "what could go wrong?"
- [ ] I'm considering multi-tenancy implications
- [ ] I'm not designing the solution yet
- [ ] I'm identifying decisions that must be made

### After Analysis
- [ ] All 9 sections are complete
- [ ] Analysis is realistic (not overly optimistic)
- [ ] Risks are clearly categorized by impact
- [ ] Effort estimate is defensible
- [ ] No implementation detail leaked into analysis

---

## 🎓 SKILL EXAMPLES

### Example 1: Simple Feature (UI Component)
**Feature:** Add a "favorites" button to strategy cards

**Discovery Output:**
- Minimal architectural impact (3-4 hours total)
- No new DB tables (use existing strategy.is_favorite flag)
- Simple API change (PATCH /strategy/:id)
- No security risks
- Can be built independently
- Pattern: Brain/Body component

### Example 2: Medium Feature (Module)
**Feature:** Trading performance dashboard

**Discovery Output:**
- Moderate architectural impact (20-30 hours)
- Needs new Metrics table
- Needs API endpoints for metrics aggregation
- Multi-tenant isolation critical (show only own metrics)
- Performance concern: Real-time vs batch updates
- Pattern: ModuleWorkspace 4-pane layout

### Example 3: Complex Feature (Full Stack)
**Feature:** Multi-strategy backtesting comparison

**Discovery Output:**
- High architectural impact (40-60 hours)
- Needs BacktestResult, BacktestComparison tables
- Needs async job queue (backtesting is slow)
- Needs WebSocket for progress updates
- Security: Can user see others' backtests? (NO)
- Performance: How many strategies to compare? (Max 5)
- Pattern: Async job + real-time updates

---

## 📌 ANTI-PATTERNS (What NOT to do)

❌ **DON'T:** Jump to implementation details
```
WRONG: "We'll use React hooks for state management"
RIGHT: "We need to manage UI state for the form and results"
```

❌ **DON'T:** Assume decisions are made
```
WRONG: "We'll store in PostgreSQL"
RIGHT: "Decision: Where do we store results? In DB or cache?"
```

❌ **DON'T:** Ignore multi-tenancy
```
WRONG: "Anyone can see all backtests"
RIGHT: "RISK: Data isolation if RLS not enforced on queries"
```

❌ **DON'T:** Be overly optimistic on effort
```
WRONG: "This is simple, 4 hours total"
RIGHT: "If testing/certification included, 20-30 hours realistically"
```

---

## ✅ SUCCESS CRITERIA

Discovery is complete when:

1. ✅ All architectural impacts identified
2. ✅ Realistic risks categorized by severity
3. ✅ Key decisions documented with options
4. ✅ Hidden requirements discovered
5. ✅ Effort estimate is within 10% of reality
6. ✅ Owner is confident and informed
7. ✅ Ready to move to skill-contract

---

## 📚 REFERENCE DOCUMENTS

Required reading before using this skill:
- `/docs/01-foundations/ARCHITECTURAL_DECISIONS.md` (ADRs)
- `/docs/03-platform/GIT_WORKFLOW.md` (Standards)
- `/docs/02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md` (Patterns)
- `/docs/01-foundations/SAAS_DATA_MODEL.md` (Multi-tenancy)

---

## 💬 WHEN TO ESCALATE

If during discovery you find:
- **ADR Violation:** Feature contradicts ADR → Escalate to Architecture team
- **Security Issue:** Potential data leak → Escalate to Security team
- **Performance Red Flag:** Needs 10+ hour effort → Escalate to Planning
- **Scope Explosion:** Grows to 50+ hours → Descope or phase

---

## 🎯 NEXT SKILL

After discovery is complete and you understand the feature:
→ **Move to skill-contract** to define data shapes (Zod schemas)

---

**Skill Version:** 1.0
**Created:** 2026-03-21
**Authority:** Platform Engineering
**Status:** ✅ Ready to Use
