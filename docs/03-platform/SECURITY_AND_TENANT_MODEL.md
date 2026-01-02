# Security & Tenant Model v1.1

## 🎯 Propósito
Establecer las reglas de ciberseguridad, resolución de identidad y aislamiento multi-tenant para garantizar que LoopDev sea una plataforma de grado industrial blindada contra fugas de datos y accesos indebidos.

---

## 1. Principios de Ciberseguridad (v1)

### 1.1 Backend‑First (Regla de Oro)
El **backend es la única autoridad** de lógica de negocio y seguridad. El frontend es un consumidor reactivo.
- El frontend **NUNCA** decide permisos ni accede directamente a la DB.
- Cualquier validación visual en la UI es solo UX; el cumplimiento real ocurre en el servidor.

### 1.2 Aislamiento Multi‑Tenant (CRÍTICO)
- **Aislamiento por RLS:** Todas las tablas de negocio deben usar Row Level Security.
- **Cero Confianza:** El backend resuelve el `tenant_id` desde la sesión autenticada (`auth.uid()`), nunca desde un parámetro enviado por el cliente que pueda ser manipulado.

### 1.3 Manejo Seguro de Errores
- **Sanitización:** Prohibido devolver stack traces o errores crudos de la base de datos al cliente.
- **Mensajes Semánticos:** El cliente recibe códigos de error seguros (ej: `SYNC_FAILED`). El detalle técnico vive solo en logs internos protegidos.

---

## 2. Resolución de Tenant
El sistema determina el contexto del cliente de forma jerárquica:
1. **Subdominio (Producción):** `customer-name.loop.dev`
2. **Context Selector (Dashboard):** Selector manual en el AppShell.
3. **URL Param (API):** `api.loop.dev/v1/:tenantId/...`

---

## 3. Modelo de Autorización (RBAC v1)
Definimos 4 niveles de acceso estándar por tenant:
- **Owner:** Control total, facturación y gestión de administradores.
- **Admin:** Gestión de usuarios y configuración de módulos.
- **Member:** Acceso operativo completo.
- **Viewer:** Acceso de sólo lectura.

---

## 4. Infraestructura Segura

### 4.1 Storage & Assets
- **Buckets Privados:** Acceso exclusivo mediante URLs firmadas con expiración (TTL).
- **Paths Namespaced:** Siempre estructurados bajo `tenants/{tenantId}/...`.

### 4.2 Rate Limiting
- Obligatorio para logins, uploads y procesos costosos (IA, exportaciones).
- Identificado por par `user_id` + `tenant_id`.

### 4.3 Gestión de Secrets
- Aislamiento total de claves entre entornos (DEV, STAGING, PROD).
- Prohibida la persistencia de secretos en el código fuente.

---
*Gobernanza de Plataforma - LoopDev Engineering Board*