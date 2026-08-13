# Infra Certification Checklist — LoopDev Platform

> **Status:** DEPRECATED. Superseded on 2026-08-13 by the infrastructure
> implementation and QA Skills plus track evidence. Retained only as historical
> migration evidence.

## 🎯 Propósito
Esta checklist define los criterios de certificación para cualquier pieza de infraestructura o backend de LoopDev. Un sistema certificado es seguro, multi-tenant, auditable y plenamente consumible por el frontend. Esta certificación es el equivalente funcional del sello visual `Loopdev.lab` aplicado a componentes UI.

---

## 🟦 Estados de Certificación
| Estado | Nombre | Significado |
| :--- | :--- | :--- |
| 🔵 | **Infra_Certified** | Lista para producción real. |
| 🟡 | **Infra_Audit** | Funcional, pero con puntos pendientes de blindaje. |
| 🟣 | **Infra_Lab** | Experimental / Prototipo inicial. |

❗ Solo los sistemas marcados como **Infra_Certified** pueden ser utilizados en el entorno de producción.

---

## ✅ Checklist de Certificación (Infra_Certified)
Un sistema SOLO puede marcarse como **Infra_Certified** si cumple TODOS los puntos siguientes:

### 1️⃣ Arquitectura & Scope (Bloqueante)
- [ ] Vive en la capa correcta (`/apps/api`, `/apps/workers`, `/packages/contracts`).
- [ ] No mezcla responsabilidades (API ≠ Worker ≠ UI).
- [ ] Respeta la arquitectura de 3 capas: UI → Modules → Apps.
- [ ] No introduce dependencias ocultas entre capas.

### 2️⃣ API & Contratos (Bloqueante)
- [ ] La API sigue estrictamente `API_STANDARDS.md`.
- [ ] Todos los endpoints tienen contrato definido (**Zod / TS**).
- [ ] Esquema de error estándar aplicado (Code, Message, Details).
- [ ] No se filtran detalles internos (DB errors, stack traces).

### 3️⃣ Multi-tenancy (CRÍTICO)
- [ ] Todas las entidades persistentes incluyen `organization_id`.
- [ ] El tenant se resuelve y valida forzosamente en el backend.
- [ ] No existen queries globales sin justificación documentada.
- [ ] Tests validan el aislamiento total entre Tenant A y Tenant B.
- ❌ **Si falla este bloque -> NO certificable.**

### 4️⃣ Auth & Permisos (Bloqueante)
- [ ] Identidad validada vía **Supabase Auth**.
- [ ] Membership validada para el tenant activo.
- [ ] RBAC v1 aplicado (Owner, Admin, Member, Viewer).
- [ ] Accesos indebidos devuelven errores semánticos (401 / 403).

### 5️⃣ Persistencia (DB & Storage)
- **Base de Datos:**
  - [ ] Migraciones versionadas, reproducibles y probadas.
  - [ ] Seeds disponibles para el entorno de desarrollo.
- **Storage:**
  - [ ] Rutas cumplen con `STORAGE_CONVENTIONS.md`.
  - [ ] Acceso controlado vía URLs firmadas o políticas de Supabase.

### 6️⃣ Estados para Frontend (Fidelidad Visual)
- [ ] Estados de carga, éxito, vacío y error identificados.
- [ ] Errores distinguibles: User, Validation, Permission, System.
- [ ] El frontend puede aplicar **Skeleton / Toast / ErrorState** correctamente.

### 7️⃣ Observabilidad (Obligatoria)
- [ ] Logs estructurados con `requestId`, `tenantId` y `userId`.
- [ ] Errores críticos reportados a Sentry o equivalente.
- [ ] Endpoint de salud disponible (`/health`).

### 8️⃣ Testing Mínimo de Infra
- [ ] Smoke test (Happy Path) del endpoint.
- [ ] Test de denegación de permisos.
- [ ] Test de aislamiento multi-tenant.
- [ ] Escenarios críticos de negocio cubiertos.

### 9️⃣ Documentación (Bloqueante)
- [ ] README del servicio actualizado y completo.
- [ ] Decisiones técnicas relevantes registradas como ADRs.
- 📌 **Si no está documentado -> No está certificado.**

### 🔍 10️⃣ Audit-ready (Principio LoopDev)
- [ ] El sistema puede ser auditado sin contexto externo adicional.
- [ ] No depende de conocimiento implícito del desarrollador.
- [ ] Deuda técnica consciente registrada en el log.

---

## 🟥 Condiciones que INVALIDAN la certificación
- ❌ Falta de validación de `organization_id`.
- ❌ Ausencia de contratos claros (Zod/TS).
- ❌ Falta de enforcement de seguridad en el servidor.
- ❌ Migraciones no reproducibles.

---
*Gobernanza de Plataforma - LoopDev Engineering*
