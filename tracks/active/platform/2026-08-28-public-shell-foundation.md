---
id: public-shell-foundation
title: Public Shell Foundation, Contract-Driven Architecture and Modular Client Surfaces
status: active
created: 2026-08-28
updated: 2026-08-28
owner: platform
lead: null
branch: feature/public-shell-foundation
branches: [feature/public-shell-foundation]
phase: 1
pull_requests: []
issues: []
packages: ['@loopdev/contracts', '@loopdev/tokens', '@loopdev/ui', '@loopdev/public-shell']
release: not-required
areas: [platform, governance, marketing-studio]
dependencies: []
blocked_by: []
supersedes: []
---

# Public Shell Foundation, Contract-Driven Architecture and Modular Client Surfaces

## Outcome

Proveer una arquitectura canónica de shell público basada en contratos (`@loopdev/contracts`) y bloques composables reutilizables (`@loopdev/public-shell`), garantizando que cualquier cliente actual o futuro (como **CIMO**, **VitaBlue** u otros clientes del ecosistema LoopDev) disponga de una experiencia integral en **Desktop (3 columnas / multi-panel)**, **Tablet (2 columnas adaptativas)** y **Mobile (App táctil con BottomNav)**, eliminando el código inline en las páginas y desacoplando la estructura del diseño de marca (*White-label Theming*).

---

## Contexto y Principios de Diseño

LoopDev cuenta con una gobernanza sólida para su `SaaS Shell` (`loopdev-os`) basada en especificaciones formales y contratos Zod. Sin embargo, las superficies públicas de cara al usuario final (PWA, portales de clientes, redes sociales deportivas y páginas de captación) carecían de una arquitectura unificada.

### Principios Fundamentales:
1. **Un Solo Shell Responsivo Continuo:** No existen variantes desconectadas. Un único componente `<PublicShell>` gestiona dinámicamente la transición fluida entre Mobile (`< 640px`), Tablet (`640px - 1024px`) y Desktop (`≥ 1024px`).
2. **Cero Código Inline / Composición por Bloques:** Las páginas no maquetan layouts con `divs` ni estilos manuales; declaran una especificación (`PublicPageSpec`) y componen bloques primitivos reutilizables a través de slots formales (`topBar`, `sidebar`, `main`, `contextPanel`, `bottomNav`, `drawer`, `modal`).
3. **Contratos Estrictos con Zod:** Todos los estados estructurales, capacidades, rutas de navegación, puntos de ruptura y temas de marca se validan en tiempo de compilación y runtime mediante `@loopdev/contracts`.
4. **Theming White-Label Universal:** La identidad visual (colores `#00B894`, `#1F4E5F`, logos SVG, tipografías y contraste accesible) se inyecta mediante tokens dinámicos en `BrandThemeProvider`.
5. **CIMO como Cliente Piloto de Certificación:** Se transforma la aplicación de CIMO para validar la experiencia completa de 3 columnas en Desktop, navegación Tablet y PWA móvil táctil.

---

## Decisiones Aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| :--- | :--- | :--- | :--- | :--- |
| **2026-08-28** | Unificar Desktop, Tablet y Mobile en un solo `PublicShell` adaptativo. | Evitar bifurcaciones de código y proveer una experiencia desktop rica (3 columnas) sin degradar la app móvil. | Arquitectura universal para todos los clientes públicos. | `@minoveaz` |
| **2026-08-28** | Arquitectura orientada a contratos en `@loopdev/contracts/src/platform/public-shell.ts`. | Mantener la misma disciplina y robustez que gobierna el SaaS Shell de LoopDev. | Tipado Zod estricto en runtime y compile-time. | `@minoveaz` |
| **2026-08-28** | Composición por Slots y Bloques Reutilizables (Cero código inline en páginas). | Estandarizar la interfaz y garantizar consistencia de accesibilidad y responsive. | Páginas declarativas y altamente mantenibles. | `@minoveaz` |
| **2026-08-28** | Inyección de Tokens de Marca dinámicos (`PublicBrandTheme`). | Permitir que CIMO, VitaBlue y futuros clientes compartan el 100% de la infraestructura visual. | Soporte nativo para clientes multi-marca (*White-Label*). | `@minoveaz` |

---

## Arquitectura de Contratos (`@loopdev/contracts`)

El contrato central `packages/contracts/src/platform/public-shell.ts` define:

### 1. Estados Estructurales del Shell (`PublicShellState`)
- `ready`: Shell completamente renderizado con datos.
- `loading`: Esqueleto de carga estructurado (*Skeleton Loaders* sin layout shifts).
- `error`: Estado de error con acción de reintento.
- `offline`: Indicador de pérdida de conectividad PWA.
- `unauthenticated`: Modo explorador / invitado con disparador de autenticación.
- `maintenance`: Pantalla de mantenimiento controlada.

### 2. Composición de Layout por Viewport (`PublicLayoutComposition`)
- **Desktop (`≥ 1024px`):** `grid-3-col` (Filtros/Mapa | Feed | Detalle de Crew / Acciones), `split-2-col` o `full-width`.
- **Tablet (`640px - 1024px`):** `split-2-col` o `drawer-sidebar`.
- **Mobile (`< 640px`):** `stack-bottom-nav` (TopBar + Contenido táctil + BottomNav fija con Safe Area Insets).

### 3. Capacidades Declarativas (`PublicShellCapabilities`)
- `top-bar`, `bottom-nav`, `search-header`, `sidebar-filters`, `context-panel`, `drawer`, `footer`, `cookie-banner`, `floating-actions`, `auth-modal`, `seo-metadata`.

### 4. Navegación Pública Tipada (`PublicNavRoute`)
- Rutas con identificador, path, label, icono semántico, badge de conteo en vivo (ej. chats no leídos), visibilidad por viewport (`mobile`, `tablet`, `desktop`) y requerimiento de autenticación.

### 5. Motor de Temas de Marca (`PublicBrandTheme`)
- Paleta semántica (`primary`, `primaryHover`, `secondary`, `accent`, `background`, `surface`, `textMain`, `textSecondary`).
- Logos vectoriales SVG (`markSvg`, `fullSvg`, `favicon`).
- Tipografía del sistema y contraste accesible (mínimo 4.5:1 WCAG AA).

---

## Alcance

### Incluido

1. **Definición de Contratos en `@loopdev/contracts`:**
   - `packages/contracts/src/platform/public-shell.ts` y exportación canónica en `index.ts`.
   - Pruebas unitarias de contratos en `packages/contracts/src/platform/__tests__/public-shell.test.ts`.
2. **Implementación de `@loopdev/public-shell` (`ds/packages/public-shell`):**
   - `<PublicShell>`: Motor central de composición de slots.
   - `<PublicTopBar>`: Header responsive con buscador, logo dinámico y acciones.
   - `<PublicBottomNav>`: Barra de navegación inferior móvil táctil (touch-target ≥ 44px) con badges.
   - `<PublicSidebar>`: Columna lateral de filtros / categorías.
   - `<PublicContextPanel>`: Columna de inspección / detalle de actividad / acciones secundarias.
   - `<PublicDrawer>`: Menú lateral animado para móviles y tablets.
   - `<PublicAuthModal>`: Modal de autenticación/registro desacoplado con estados OTP y Magic Link.
   - `<BrandThemeProvider>` / `useBrandTheme`: Inyección de variables CSS y contexto de diseño.
3. **Refactorización de CIMO (Cliente Piloto):**
   - Declarar `cimoFeedPageSpec` y `cimoTheme`.
   - Eliminar maquetación inline en favor de bloques reutilizables.
   - Validar la experiencia de 3 columnas en Desktop, 2 columnas en Tablet y App móvil táctil en Mobile.
4. **Calidad y Verificación:**
   - Pruebas unitarias con Vitest.
   - Verificación de TypeScript estricto (`tsc --noEmit`) y Linting.
   - Auditoría de responsive sin overflow horizontal ni layout shifts.

### Excluido

- Modificaciones a la lógica interna de suites de backoffice de `loopdev-os`.
- Módulos verticales específicos de seguros de VitaBlue (se migrarán en una fase subsiguiente tras certificar el shell con CIMO).

---

## Fases de Ejecución y Checkpoints

### 📌 Fase 1: Contratos y Especificaciones en `@loopdev/contracts`
- [ ] Crear `packages/contracts/src/platform/public-shell.ts` con todos los schemas Zod y tipos inferidos.
- [ ] Exportar los contratos en `packages/contracts/src/index.ts`.
- [ ] Añadir suite de tests unitarios de validación de contratos (`public-shell.test.ts`).
- [ ] Ejecutar build de contracts: `pnpm --filter @loopdev/contracts build`.

### 📌 Fase 2: Construcción del Paquete `@loopdev/public-shell`
- [ ] Configurar `ds/packages/public-shell/package.json` y `tsconfig.json`.
- [ ] Implementar el motor de theming: `BrandThemeProvider` y `useBrandTheme`.
- [ ] Construir los bloques composables reutilizables:
  - `PublicShell.tsx` (gestor de slots: `topBar`, `sidebar`, `main`, `contextPanel`, `bottomNav`, `drawer`, `modal`).
  - `PublicTopBar.tsx`, `PublicBottomNav.tsx`, `PublicSidebar.tsx`, `PublicContextPanel.tsx`, `PublicAuthModal.tsx`.
- [ ] Implementar hooks de responsive (`useShellBreakpoint`).
- [ ] Añadir tests unitarios en `ds/packages/public-shell`.

### 📌 Fase 3: Integración Piloto en CIMO
- [ ] Crear la especificación formal de página `cimoFeedPageSpec` y los tokens `cimoBrandTheme`.
- [ ] Modularizar los componentes de CIMO en bloques desacoplados:
  - `SportFiltersBlock` (para slot `sidebar`).
  - `ActivitiesFeedBlock` (para slot `main`).
  - `CrewDetailContextBlock` (para slot `contextPanel`).
  - `JoinCrewAuthBlock` (para slot `modal`).
- [ ] Validar el renderizado en Desktop (3 columnas), Tablet (2 columnas) y Mobile (PWA con BottomNav).

### 📌 Fase 4: Certificación de Calidad y Pipeline de CI
- [ ] Ejecutar `pnpm turbo run build lint test` en todo el monorepo.
- [ ] Verificar accesibilidad táctil (touch target ≥ 44px) y navegación por teclado.
- [ ] Registrar evidencia en el track y preparar Pull Request hacia `develop`.

---

## Criterios de Aceptación

1. **Validación de Contratos:** El 100% de los schemas Zod de `public-shell.ts` compilan y superan las pruebas unitarias.
2. **Cero Código Inline en Pantallas:** Las páginas públicas de clientes componen exclusivamente bloques y slots definidos en el contrato.
3. **Triple Experiencia Verificada:**
   - **Desktop (`≥ 1024px`):** Layout expansivo de 3 columnas completamente funcional.
   - **Tablet (`640px - 1024px`):** Reorganización limpia en 2 columnas con drawer colapsable.
   - **Mobile (`< 640px`):** Experiencia táctil fluida con TopBar compacta, BottomNav fija y safe-areas respetadas.
4. **Theming White-Label Operativo:** El cambio de tokens de marca adapta instantáneamente colores, logos y tipografías sin tocar componentes.
5. **Quality Gate Verde:** `pnpm turbo run build typecheck test` finaliza con 0 errores en el monorepo.
