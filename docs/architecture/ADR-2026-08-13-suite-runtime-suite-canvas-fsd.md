---
title: Standard suite composition with SuiteRuntime and SuiteCanvas
status: approved
date: 2026-08-13
approver: User
---

# ADR: Composicion estandar de suites con SuiteRuntime y SuiteCanvas

## Decision

Las suites nuevas de LoopDev usaran `SuiteRuntime + SuiteCanvas` como composicion estandar. FSD
organizara el contenido de negocio dentro de cada Canvas:

```text
app route -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared
```

## Rules

- `SuiteRuntime` compone identidad, navegacion, acceso, contexto de organizacion/workspace y
  contratos de la suite.
- `SuiteCanvas` compone la superficie visual y sus modos: `overview`, `data`, `workspace`, `split`,
  `board` y `full-bleed` cuando proceda.
- `SuiteCanvas` no conoce CRM, leads, contactos, Supabase, reglas de negocio ni mutaciones.
- El shell no importa slices de dominio.
- Los widgets componen features y entities; las features ejecutan acciones mediante contratos y
  APIs de aplicacion.
- No se crea una capa FSD `pages` paralela al App Router.
- La migracion desde `AppShell -> SuiteShell -> ModuleShell -> ModuleWorkspace` es incremental y
  debe conservar compatibilidad mientras se integra el contrato nuevo.

## Consequences

- CRM puede usar `data` para Contactos y Leads, `board` para Pipeline y `split` para Contact 360 sin
  duplicar shell ni sidebar.
- La composicion visual puede evolucionar sin contaminar el dominio.
- El track de shell debe completar la integracion y los checks del contrato antes de declarar la
  implementacion global terminada.
- El primer CRM slice debe usar el contrato aprobado y mantener la entrada de ruta del App Router
  delgada.

## Scope

Esta decision gobierna las suites nuevas y el piloto CRM. No autoriza por si sola una migracion
masiva de las suites existentes ni cambia contratos de datos, RLS o APIs.
