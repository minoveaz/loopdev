---
id: platform-user-drawer-context
title: Estandarización del Drawer de Usuario y Contexto de Plataforma
status: active
created: 2026-09-06
updated: 2026-09-06
owner: platform
lead: User
branch: feature/platform-shell-user-context-standardization
branches: [feature/platform-shell-user-context-standardization]
phase: 1
pull_requests: [209]
issues: []
packages: []
release: not-required
areas: [platform, governance]
dependencies: []
blocked_by: []
supersedes: []
---

# Estandarización del Drawer de Usuario y Contexto de Plataforma

## Outcome

Estandarizar el Drawer de Usuario lateral (`PlatformContextPanel` en modo `profile`) como el patrón canónico único de identidad en toda la plataforma (Launchpad y Suites), alimentándolo con los datos de sesión reales de Supabase Auth (`useAuth`), habilitando el cierre de sesión real y corrigiendo el estado de carga y visualización de organizaciones en el header del Launchpad.

## Contexto

Previamente existían inconsistencias entre el Launchpad y las Suites:

- En el Launchpad, hacer clic en el avatar abría un dropdown popover, mientras que en las Suites abría un Drawer lateral (`ContextPanelHost`).
- El Drawer lateral contenía datos mock hardcodeados ("Alex Morgan", "showcase@loopdev.local", "TENANT_ADMIN") y el botón Sign Out no operaba.
- En las Suites (`DocumentIntelligenceShell` y `SalesCrmShell`), el componente `UserMenu` recibía nombres estáticos ("Document Intelligence User", "CRM User") en vez de la sesión real.
- En el header del Launchpad, el `ContextSwitcher` quedaba en ocasiones bloqueado mostrando el texto plano "Loading context".
- La iniciativa integral de notificaciones backend y persistencia queda explícitamente desacoplada para un track futuro dedicado.

## Fases

### Fase 1: Datos reales de sesión y Drawer canónico de Usuario

- [x] Conectar `ContextPanelHost` con `useAuth()` y `useOrganization()`.
- [x] Mostrar nombre, email, badge de rol y organización activa real.
- [x] Conectar `Sign Out` con `signOut()` de Supabase y redirección a `/login`.
- [x] Zona horaria automática mediante `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- [x] Botones de navegación interna (_Profile_, _Account Settings_, _Billing_) como placeholders no operativos declarados.

### Fase 2: Unificación de apertura de Drawer en Launchpad y Suites

- [x] Conectar el avatar en `apps/loopdev-os/src/app/launchpad/page.tsx` para abrir el Drawer canónico de perfil.
- [x] Proveer datos reales de sesión a `UserMenu` en `DocumentIntelligenceShell` y `SalesCrmShell`.

### Fase 3: Corrección de estado de carga en Launchpad ContextSwitcher

- [x] Sincronizar el estado de carga con la resolución de sesión y membresías.
- [x] Reemplazar el bloque rígido de "Loading context" con un estado de carga visual limpio y sin parpadeos.

## Criterios de cierre

- [x] Clic en el avatar tanto en Launchpad como en Suites abre el Drawer lateral de perfil.
- [x] El Drawer muestra la identidad real del usuario autenticado sin datos mock.
- [x] El cierre de sesión desloguea la sesión real de Supabase y redirige a `/login`.
- [x] El `ContextSwitcher` del Launchpad no se queda atascado en "Loading context".
- [x] El icono de la bombilla en notificaciones permanece inalterado.
- [ ] Validaciones de CI y linters pasan en verde.
