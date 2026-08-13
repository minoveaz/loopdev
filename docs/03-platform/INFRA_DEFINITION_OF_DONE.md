# INFRA Definition of Done (DoD)

## Propósito
Este documento define cuándo un trabajo de infraestructura o backend se considera **FINALIZADO** en LoopDev. Un trabajo NO está Done solo porque "funciona en local"; está Done cuando es seguro, auditable y plenamente consumible por el frontend.

---

## 🟢 Un trabajo de Infra está DONE si cumple:

### 1️⃣ Implementación funcional (Obligatorio)
- [ ] El comportamiento definido en el DoR está implementado completamente.
- [ ] El código compila y arranca sin errores (`tsc`, `build`).
- [ ] No existen paths de ejecución "a medias" o TODOs críticos.

### 2️⃣ API clara y contractual (API-first)
- [ ] Los endpoints siguen `API_STANDARDS.md`.
- [ ] Request y Response definidos por contrato (**Zod / TS**).
- [ ] Los errores siguen el esquema estándar (Code, Message, TraceId).
- [ ] **Regla:** Si el frontend no sabe qué esperar, NO está Done.

### 3️⃣ Aislamiento por organización aplicado (Bloqueante)
- [ ] Toda entidad persistente está asociada a un `organization_id`.
- [ ] El backend resuelve el contexto de la organización de forma explícita (no confía en el cliente).
- [ ] ❌ Falta de validación de organización = **CRITICAL FAIL**.

### 4️⃣ Seguridad & Permisos (RBAC v1)
- [ ] El endpoint valida identidad (Auth) y pertenencia a la organización.
- [ ] El endpoint valida rol/capacidad mínima.
- [ ] Accesos denegados devuelven error semántico (403).

### 5️⃣ Persistencia y Datos (DB / Storage)
- [ ] **DB:** Migraciones versionadas y reproducibles (Prisma/Drizzle).
- [ ] **Storage:** Rutas siguen `STORAGE_CONVENTIONS.md`. No hay accesos públicos sin control.
- [ ] Seeds disponibles para el entorno de desarrollo.

### 6️⃣ Estados para Frontend (Fidelidad Visual)
- [ ] Estados posibles identificados: `loading`, `success`, `empty`, `error`.
- [ ] Errores distinguibles por tipo (User, Validation, System).
- [ ] Permite que la UI use **Skeletons, Toasts y ErrorStates** correctamente según el Sistema Visual v3.8.

### 7️⃣ Observabilidad & Calidad
- [ ] Logs estructurados (incluyen `requestId`, `organizationId`).
- [ ] Smoke test del endpoint (Happy Path) funcionando.
- [ ] Test de aislamiento entre organizaciones verificado.

### 8️⃣ Documentación Actualizada
- [ ] README del servicio actualizado.
- [ ] Decisiones relevantes registradas en ADRs.

---

## 🔴 Casos que BLOQUEAN el "Done"
- ❌ No hay validación de organización.
- ❌ No hay contrato claro (Zod/TS).
- ❌ No hay migraciones reproducibles.
- ❌ No hay documentación mínima.

---
*Gobernanza de Plataforma - LoopDev Engineering*
