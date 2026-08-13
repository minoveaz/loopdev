# INFRA Definition of Ready (DoR)

## Propósito
Garantizar que ningún trabajo de infraestructura o backend comienza sin intención clara, impacto acotado y alineación con la arquitectura LoopDev.

---

## 🟢 Un trabajo de Infra está READY si cumple:

### 1️⃣ Intención clara
- [ ] Definido qué problema resuelve.
- [ ] Explicable en 1–2 frases.
- [ ] No mezcla múltiples objetivos no relacionados.

### 2️⃣ Alcance acotado
- [ ] Afecta a una capa principal (API / DB / Storage / Auth / Docs).
- [ ] No se cuelan funcionalidades “extra” fuera del objetivo.

### 3️⃣ Decisiones explícitas
- [ ] Definida la ubicación del código (`/apps/api`, `/packages/contracts`, etc.).
- [ ] Qué estándar sigue (API_STANDARDS, MULTI_TENANCY_STRATEGY, etc.).
- [ ] Definido qué **NO** se va a resolver en este sprint.

### 4️⃣ Contratos definidos
- [ ] Existe un schema (Zod / TS) aunque sea mínimo.
- [ ] Shape de request/response documentado.
- [ ] Errores esperados definidos.

### 5️⃣ Impacto en Frontend
- [ ] Identificada la parte del frontend que consumirá esto.
- [ ] Estados UI pensados (loading, error, empty, success).
- [ ] No se rompe el modelo Brain/Body ni se introduce lógica de negocio en UI.

### 6️⃣ Seguridad y aislamiento por organización
- [ ] Pensado el `organization_id` y aislamiento de datos.
- [ ] Permisos mínimos (RBAC v1) considerados.

---

## 🔴 Si NO cumple el DoR
El trabajo **no empieza**. Se documenta qué falta y se crea una tarea previa de decisión o refinamiento.

---
*Gobernanza de Plataforma - LoopDev Engineering*
