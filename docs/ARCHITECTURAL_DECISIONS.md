# LoopDev Architectural Decisions (ADR)

Este documento define la arquitectura técnica y estratégica de LoopDev OS, asegurando 100% de reutilización y escalabilidad masiva.

---

## 🏗️ La Arquitectura de Tres Capas

### 1. Capa de Presentación (Design System) - `/ds/packages/*`
- **Responsabilidad**: Átomos, Moléculas y Organismos de UI puros.
- **Regla de Oro**: Prohibida la lógica de negocio o llamadas a API.
- **Salida**: `@loopdev/ui`, `@loopdev/tokens`.

### 2. Capa de Dominio (Módulos Funcionales) - `/modules/*`
- **Responsabilidad**: Unidades de lógica de negocio autocontenidas. Cada módulo tiene dos caras:
    - **Workspace View**: Interfaz de uso diario para el usuario final.
    - **Admin View**: Interfaz de configuración técnica del módulo.
- **Ejemplos**: `mod-crm`, `mod-marketing-studio`, `mod-auditor`.
- **Regla de Oro**: Deben ser independientes. Una App puede importar uno o varios módulos.

### 3. Capa de Orquestación (Aplicaciones) - `/apps/*`
- **Responsabilidad**: El producto final (Shell). Gestiona rutas, autenticación y la inyección de módulos.
- **Ejemplo Maestro**: `loopdev-os`.

---

## 🔐 Estrategia de Administración Multinivel

Para soportar el modelo SaaS, el sistema gestiona tres niveles de jerarquía:

1. **Nivel 1: Super Admin (LoopDev Ops)**
   - Ruta: `/admin/*`
   - Función: Gestión global de Tenants, Infraestructura y Design Audit.
2. **Nivel 2: Tenant Admin (Client Ops)**
   - Ruta: `/:tenantId/settings`
   - Función: Gestión de usuarios del cliente, facturación y theming dinámico.
3. **Nivel 3: App Admin (Module Specialist)**
   - Ruta: `/:tenantId/:moduleId/admin`
   - Función: Configuración específica de la herramienta (ej. flujos del CRM).

---

## 🛠️ Estándares de Ingeniería

- **Dynamic Navigation**: El Sidebar se construye leyendo un registro de módulos activos.
- **Core SDK**: El acceso a datos se centraliza en `@loopdev/mod-core-shared`.
- **Capability-Based Permissions**: El acceso se define por capacidades técnicas, no por roles estáticos.

---

## 📂 Directorio de Referencia (Estructura de Carpetas)

A continuación se detalla la estructura física del proyecto y la responsabilidad de cada directorio:

### 1. Applications (`/apps`)
Orquestadores finales que consumen módulos y el Design System.
- `loopdev-os/`: Aplicación principal (El Sistema Operativo).
  - `src/routes/`: Definición de rutas públicas, de suite y de administración global.
  - `src/layouts/`: Variaciones del Shell (MarketingLayout, OperatingLayout).
  - `src/pages/`: Cascarones de página que inyectan los módulos.
  - `src/registry/`: Configuración dinámica de qué módulos están activos para cada cliente.
  - `src/providers/`: Estados globales de la aplicación (Auth, i18n, etc.).

### 2. Functional Modules (`/modules`)
Lógica de negocio reutilizable y componentes funcionales.
- `mod-marketing-studio/`: Gestión de marca, campañas y activos creativos.
  - `src/views/workspace/`: Interfaz diaria para creativos (Ej. Brand Center).
  - `src/views/admin/`: Configuración técnica (Ej. Reglas de marca, fuentes).
- `mod-crm/`: Gestión de leads, pólizas y clientes.
  - `src/views/workspace/`: Uso diario para vendedores (Ej. Listado de leads).
  - `src/views/admin/`: Configuración técnica (Ej. Campos personalizados).
- `mod-core-shared/`: El motor común de todos los módulos.
  - `src/sdk/`: Clientes de API y conexiones a base de datos (Firebase).
  - `src/auth/`: Lógica de login y sesión.
  - `src/i18n/`: Diccionarios de traducción.
- `mod-auditor/`: Herramienta de DesignOps para migrar diseños a átomos del DS.

### 3. Design System (`/ds`)
El vivero de componentes y tokens de identidad visual.
- `packages/ui/`: Librería de componentes React (Atoms, Molecules, Organisms).
- `packages/tokens/`: Cimientos de diseño (Colores, Spacing, Typography).
- `apps/docs/`: Storybook oficial del sistema de diseño.
