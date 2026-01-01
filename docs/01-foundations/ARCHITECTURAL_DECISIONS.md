# LoopDev Architectural Decisions (ADR)

Este documento define la arquitectura técnica y estratégica de LoopDev OS, asegurando 100% de reutilización y escalabilidad masiva.

---

## 🏗️ ADR 001: La Arquitectura de Tres Capas

### 1. Capa de Presentación (Design System) - `/ds/packages/*`
- **Responsabilidad**: Átomos, Moléculas y Organismos de UI puros.
- **Regla de Oro**: Prohibida la lógica de negocio o llamadas a API.
- **Salida**: `@loopdev/ui`, `@loopdev/tokens`.

### 2. Capa de Dominio (Módulos Funcionales) - `/modules/*`
- **Responsabilidad**: Unidades de lógica de negocio autocontenidas. Cada módulo tiene dos caras:
    - **Workspace View**: Interfaz de uso diario para el usuario final.
    - **Admin View**: Interfaz de configuración técnica del módulo.
- **Salida**: `@loopdev/mod-<name>`, `@loopdev/modp-<capability>`.

### 3. Capa de Orquestación (Aplicaciones) - `/apps/*`
- **Responsabilidad**: El producto final (Shell). Gestiona rutas, autenticación y la inyección de módulos.
- **Ejemplo Maestro**: `loopdev-os`.

---

## 🔐 ADR 002: Estrategia de Administración Multinivel

Para soportar el modelo SaaS, el sistema gestiona tres niveles de jerarquía:

1. **Nivel 1: Super Admin (LoopDev Ops)**
   - Ruta: `/admin/*`
   - Función: Gestión global de Tenants e Infraestructura.
2. **Nivel 2: Tenant Admin (Client Ops)**
   - Ruta: `/:tenantId/settings`
   - Función: Gestión de usuarios del cliente y facturación.
3. **Nivel 3: App Admin (Module Specialist)**
   - Ruta: `/:tenantId/:moduleId/admin`
   - Función: Configuración específica de la herramienta (ej. flujos del CRM).

---

## 📦 ADR 003: Taxonomía de Módulos & Dependencias (DAG)

Establecemos una jerarquía estricta para evitar acoplamientos circulares y maximizar la reutilización.

### Tipos de Módulos (Naming Official)
1. **APP (App):** Orquestador de routing y sesión.
   - Naming: `apps/app-<name>`
2. **MOD-PRODUCT (Product Module):** Dominio de negocio (Navegable).
   - Naming: `modules/mod-<domain>` (ej: `mod-marketing-studio`).
3. **MODP-PLATFORM (Platform Module):** Capacidad técnica compartida (No navegable).
   - Naming: `modules/modp-<capability>` (ej: `modp-file-ops`, `modp-notifications`).

### Grafo de Dependencias (Directed Acyclic Graph)
```
UI (ds)
 ├─▶ MODP-PLATFORM (Services)
 │     └─▶ MOD-PRODUCT (Business)
 │           └─▶ APP (Orchestrator)
```
**Reglas No Negociables:**
- Los módulos de plataforma NO pueden depender de módulos de producto.
- Las Apps NO contienen lógica de negocio compleja; solo montan módulos.
- Prohibida la dependencia circular entre productos (`mod-a` ↔ `mod-b`).

---

## 📜 ADR 004: Contract-First Architecture

Para eliminar la discrepancia de datos entre Frontend y Backend, establecemos una "Constitución de Datos" compartida.

### 1. El Paquete `@loopdev/contracts`
- **Ubicación:** `loopdev/packages/contracts`.
- **Contenido:** Esquemas de validación (Zod) e interfaces TypeScript inferidas.
- **Responsabilidad:** Definir la forma de los datos (Dominio) y los mensajes (API).

### 2. Regla de "Single Source of Truth"
- El Frontend **NO** define interfaces manuales para las respuestas de API. Importa el tipo del contrato.
- El Backend **NO** valida el body de un request manualmente. Usa `schema.parse()`.
- **Database Alignment:** Las migraciones de SQL deben reflejar fielmente el contrato Zod.

### 3. Flujo de Desarrollo (The Phase 0 Rule)
Antes de escribir cualquier lógica de UI o Endpoint:
1.  Definir el Dominio en texto (`DOMAIN.md`).
2.  Definir el Contrato en código (`brand.schema.ts`).
3.  Solo entonces, implementar en paralelo Front y Back.

---

## 🛠️ Estándares de Ingeniería

- **Dynamic Navigation**: El Sidebar se construye leyendo un registro de módulos activos.
- **Core SDK**: El acceso a datos se centraliza en `@loopdev/modp-core`.
- **Capability-Based Permissions**: El acceso se define por capacidades técnicas, no por roles estáticos.
- **The Workbench Pattern**: Arquitectura de 3 capas (Shell, Coordinator, Domain) para lienzos complejos.

---

## 📂 Directorio de Referencia (Estructura de Carpetas)

### 1. Applications (`/apps`)
- `app-loopdev-os/`: El Sistema Operativo principal.

### 2. Functional Modules (`/modules`)
- `mod-marketing-studio/`: Gestión de marca y activos.
- `mod-crm/`: Gestión de leads y pólizas.
- `modp-core/`: El motor común (Auth, SDK, i18n).
- `mod-auditor/`: Herramienta de DesignOps.

### 3. Shared Logic (`/packages`)
- `packages/contracts/`: Esquemas Zod y Tipos compartidos.

### 4. Design System (`/ds`)
- `packages/ui/`: Librería `@loopdev/ui`.
- `packages/tokens/`: `@loopdev/tokens`.
- `apps/docs/`: Storybook oficial.
