# 🚀 Roadmap Industrial Detallado — Brand Hub (v1.0)

> **Documento Vivo:** Este es el plan de ejecución táctico. Cada checkbox representa una unidad de trabajo atómica.
> **Scope:** Construcción del módulo `mod-brand-hub` dentro de `loopdev`.

---

## 🟢 FASE 0: Contratos y Definiciones (The Nervous System)
**Objetivo:** Establecer el lenguaje común (Tipos) antes de crear infraestructura. Nadie codifica UI ni DB hasta que esto esté verde.

### 0.1 Dominio y Estándares
- [x] **Dominio:** Crear `docs/05-operations/BRAND_HUB_DOMAIN.md`. (✅ Completado)
- [x] **API Standard:** Crear `docs/03-platform/API_STANDARDS.md` definiendo:
    - [x] Envelope: `{ data: T, meta: Paginator, error: null }`
    - [x] HTTP Codes: `200`, `201`, `400`, `401`, `403`, `404`, `500`.
    - [x] ISO-8601 para fechas.

### 0.2 Package `@loopdev/contracts`
Crear un workspace interno para compartir tipos entre Front y Back.
- [x] **Scaffolding:** `packages/contracts/package.json` (TS only, no react).
- [x] **Config:** `tsconfig.json` estricto.
- [x] **Schema: Brand:** Crear `src/brands/brand.schema.ts` (Zod).
    - `id`: uuid
    - `tenant_id`: uuid
    - `name`: string (min 2)
    - `description`: string (optional)
    - `status`: 'draft' | 'published' | 'archived'
- [ ] **Schema: Asset:** Crear `src/brands/asset.schema.ts`.
- [ ] **Schema: Palette:** Crear `src/brands/palette.schema.ts` (Tokens).
- [x] **Export:** `index.ts` exportando tipos inferidos (`z.infer`).

---

## 🟢 FASE 1: Infraestructura Backend (The Spine)
**Objetivo:** Persistencia segura y API CRUD básica. Sin UI todavía.

### 1.1 Base de Datos (Supabase)
- [x] **Migration 001:** Crear tabla `brands`. (✅ Completado)
- [x] **RLS Policies (Seguridad):** (✅ Completado)
- [x] **Seeding:** Script SQL para poblar 3 marcas de prueba. (✅ Completado)

### 1.2 Next.js Architecture (The App Shell)
**Objetivo:** Configurar el entorno Next.js para soportar Auth y Multi-tenancy.
- [x] **Scaffolding:** Crear `apps/loopdev-os` (Next.js App Router + TypeScript). ✅
- [x] **Monorepo Link:** Conectar `@loopdev/ui` y `@loopdev/contracts`. ✅
- [x] **Supabase SSR:** Instalar `@supabase/ssr` y configurar clientes (Server/Client/Middleware). ✅
- [x] **Auth Middleware:** Proteger rutas `/dashboard/*` y redirigir a Login. ✅
- [x] **Data Layer:** Configurar `TanStack Query` y `QueryProvider`. ✅
- [ ] **API Routes (Optional):** Crear `/api/v1/brands` solo si la lógica RLS es insuficiente.

### 1.3 Testing de Infra infraestructura activa en Supabase Cloud. ✅

---

## 🟢 FASE 2: UI Vertical Slice (The Face)
**Objetivo:** Conectar el Frontend a la API. Primera interacción real del usuario.

### 2.1 Authentication Gate
- [x] **DS Dependency:** Certificar componente `Input` en `@loopdev/ui`. ✅
- [x] **Login Page:** Implementar `/src/app/login/page.tsx`. (✅ Completado)
- [ ] **Auth Callback:** Configurar `/src/app/auth/callback/route.ts` para manejo de sesiones.

### 2.2 Service Layer (Frontend)
- [ ] **Fetcher:** Implementar `lib/api-client.ts` (wrapper de fetch con manejo de tokens).
- [ ] **Hooks:** Implementar `hooks/useBrands.ts` (TanStack Query).
    - `useBrandsList()`
    - `useBrandCreate()`
    - `useBrandDetail(id)`

### 2.2 Pantalla: Brand List
- [ ] **Layout:** Usar `DashboardLayout` existente.
- [ ] **Container:** Página `/brands`.
- [ ] **Componentes:**
    - `Header`: Título + Botón "New Brand".
    - `Grid`: Mapear brands a `BrandCard` (usando componentes `Card` basicos).
    - `EmptyState`: Usar componente certificado si array vacío.
    - `Skeleton`: Mostrar mientras `isLoading`.

### 2.3 Pantalla: Create Brand
- [ ] **Modal:** Usar Primitivo `Dialog` (o crear wrapper simple si no existe).
- [ ] **Form:**
    - `Label` + `Input` (Nombre).
    - `Label` + `Textarea` (Descripción).
    - `Button` (Submit, `isLoading` state).
- [ ] **Feedback:** `Toast.success("Brand created")` al terminar.

---

## 🟢 FASE 3: Assets & Storage (The Muscle)
**Objetivo:** Subida de archivos reales. Es la parte más compleja de infra.

### 3.1 Infra Storage
- [ ] **Bucket:** Crear bucket `brand-assets` en Supabase.
- [ ] **RLS Storage:**
    - Policy: "Allow uploads folder `tenants/{tenantId}/*`".
    - Policy: "Allow public read (o signed URL)".

### 3.2 Backend Upload
- [ ] **Endpoint:** `POST /api/v1/assets/sign`.
    - Generar URL firmada para subida directa (Client -> Storage).

### 3.3 UI Upload
- [ ] **Componente:** `AssetUploader`.
    - Input `type="file"`.
    - Preview de imagen local.
    - Progress Bar (usar `Toast` loading o componente simple).
- [ ] **Grid:** Galería de assets dentro de `BrandDetail`.

---

## 🟢 FASE 4: Tokens & Rules (The Brain)
**Objetivo:** Gestión de colores y reglas. El valor diferencial.

### 4.1 Color Palette UI
- [ ] **Editor:** Lista de inputs de color (Hex).
- [ ] **Preview:** Visualizador de paleta generado dinámicamente.
- [ ] **Persistencia:** Guardar JSON en columna `brands.palette`.

### 4.2 Rules Engine (v1 JSON)
- [ ] **Schema:** Definir `rules.schema.ts` en contracts.
- [ ] **UI:** Formulario simple para editar reglas clave (ej: "Allow Dark Mode").

---

## 🟢 FASE 5: Industrialización (The Shield)
**Objetivo:** Dejarlo listo para producción.

### 5.1 Quality
- [ ] **E2E Test:** Cypress/Playwright flujo crítico (Login -> Create Brand -> Upload Logo).
- [ ] **Error Handling:** `ErrorBoundary` en rutas de detalle.

### 5.2 Telemetry
- [ ] **Logs:** Instrumentar fallos de API.

---

## 🏁 Definition of Done (Global)
El módulo Brand Hub se considera terminado cuando:
1. Un usuario puede loguearse y crear una marca.
2. Esa marca persiste en PostgreSQL con el `tenant_id` correcto.
3. Se pueden subir assets y se ven en la galería.
4. No hay errores de consola ni de tipos.
5. El código pasa el linter y build.

---

## 🔵 FASE 6: Automatización de Tooling (The Catalyst)
**Objetivo:** Crear herramientas internas que aceleren el ciclo de diseño a producción.

> ⚠️ **ESTADO: DEUDA TÉCNICA**
> La implementación del HTML Ingestor y la unificación del laboratorio (`labdev` -> `loopdev/apps/lab`) se posponen para priorizar la infraestructura de Layouts v1.

### 6.1 HTML Ingestor
- [ ] **Scoping:** Definir la arquitectura del módulo `mod-html-ingestor`.
- [ ] **Core Logic:** Implementar el parser de HTML a React con `cheerio`.
- [ ] **UI:** Crear la interfaz en Marketing Studio para la subida de archivos.
- [ ] **CI/CD:** Generar PRs automáticos con los componentes convertidos.