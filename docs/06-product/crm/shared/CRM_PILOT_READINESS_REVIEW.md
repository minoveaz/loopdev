---
title: CRM Pilot Readiness Review
status: template
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
execution_gate: before-test-or-uat
---

# Revision de Readiness del Piloto CRM

## 1. Proposito

Esta checklist se ejecuta antes de cada ciclo relevante de pruebas o UAT. No certifica el estado
actual del producto y no debe marcarse como completada antes de que exista una release candidate
desplegada en staging.

Su objetivo es comparar:

- Lo que el execution roadmap y UX aprobado dicen que debe existir.
- Lo que el producto realmente entrega en el commit/release candidate revisado.
- Lo que los contratos, APIs, datos y permisos realmente soportan.
- Lo que los tests existentes demuestran.
- Los casos esperados que aun no tienen cobertura.

Un resultado verde solo significa que los casos inventariados tienen evidencia. No significa que se
hayan cubierto funcionalidades que no fueron inventariadas.

## 2. Datos de la revision

| Campo | Valor |
| --- | --- |
| Gate | Pendiente |
| Entorno | Staging |
| Release candidate / SHA | Pendiente |
| Fecha de revision | Pendiente |
| Revisado por | Pendiente |
| Product Owner | User |
| Tech Lead | User |
| Release owner | User |
| Resultado | Pendiente |
| Evidencia principal | Pendiente |

## 3. Condicion de entrada

La revision solo puede empezar cuando:

- [ ] Existe una release candidate identificable por SHA o tag.
- [ ] La candidate esta desplegada en staging, no solo en local.
- [ ] Staging usa datos sinteticos o pseudonimizados.
- [ ] El despliegue, migraciones aplicables y configuracion pueden identificarse.
- [ ] Se conoce el alcance que el equipo afirma haber entregado.
- [ ] Existe una lista de cambios desde la ultima candidate.

Si alguna condicion falla, el resultado es `NOT READY` y no se inicia UAT ni se interpreta la suite
como evidencia del release.

## 4. Inventario de producto realmente entregado

Completar solo con comportamiento observable en la candidate. No marcar por intencion o por codigo
sin ruta accesible.

| Superficie | Requisito UX | Ruta/vista entregada | API/datos reales | Estado | Evidencia |
| --- | --- | --- | --- | --- | --- |
| Contactos | Lista, busqueda, filtros | Pendiente | Pendiente | Pendiente | Pendiente |
| Contactos | Crear y editar | Pendiente | Pendiente | Pendiente | Pendiente |
| Contactos | Detalle y Customer 360 | Pendiente | Pendiente | Pendiente | Pendiente |
| Contactos | Posible duplicado y merge humano | Pendiente | Pendiente | Pendiente | Pendiente |
| Leads | Lista, crear/capturar y detalle | Pendiente | Pendiente | Pendiente | Pendiente |
| Leads | Origen y atribucion manual/campana/WhatsApp simulado | Pendiente | Pendiente | Pendiente | Pendiente |
| Pipeline | Tablero y detalle de oportunidad | Pendiente | Pendiente | Pendiente | Pendiente |
| Pipeline | Etapas configurables por admin | Pendiente | Pendiente | Pendiente | Pendiente |
| Tareas | Bandeja, crear, completar | Pendiente | Pendiente | Pendiente | Pendiente |
| Customer 360 | Nota, tarea, leads, oportunidades y timeline sin duplicados | Pendiente | Pendiente | Pendiente | Pendiente |
| Estados UX | Loading, empty, error, forbidden, success | Pendiente | Pendiente | Pendiente | Pendiente |
| Responsive | Escritorio y tablet UAT; mobile web basico | Pendiente | Pendiente | Pendiente | Pendiente |
| Exclusiones | Dashboard/IA/documentos/cotizaciones ocultos o no simulados | Pendiente | Pendiente | Pendiente | Pendiente |

## 5. Revisión de plataforma y datos

- [ ] Login y sesion funcionan en staging.
- [ ] Roles reales del piloto estan configurados: agente, manager y admin.
- [ ] Superdev usa un camino privilegiado separado, auditado y no un permiso tenant ordinario.
- [ ] Organizacion, workspace y marca activos se resuelven server-side.
- [ ] Viewer no aparece como rol del piloto.
- [ ] Dos organizaciones tienen datos separados.
- [ ] Tenant B no puede leer, mutar ni referenciar datos de tenant A.
- [ ] RLS esta activo y las policies por verbo estan verificadas.
- [ ] FKs y constraints tenant-aware estan verificadas.
- [ ] Kill switches revocan acceso al desactivar membership, organizacion o workspace.
- [ ] Auditoria registra mutaciones, merges, cambios de etapa y acciones privilegiadas.
- [ ] PII no aparece en logs, analytics, screenshots ni payloads de error.
- [ ] Fixture y seed usados son sinteticos y reproducibles.

## 6. Matriz de casos y cobertura

Completar esta matriz antes de ejecutar la suite. `No cubierto` no es un fallo de test: es una
señal para reducir alcance, crear cobertura o aceptar explicitamente el riesgo.

| ID | Caso esperado | Funcionalidad entregada | Test existente | Tipo de evidencia | Resultado |
| --- | --- | --- | --- | --- | --- |
| C-01 | Login y acceso al CRM con rol autorizado | Pendiente | Pendiente | Auth E2E | Pendiente |
| C-02 | Crear contacto con campos obligatorios | Pendiente | Pendiente | Route + E2E | Pendiente |
| C-03 | Crear contacto con DNI/fecha/genero/estado opcionales | Pendiente | Pendiente | Contract + E2E | Pendiente |
| C-04 | Coincidencia exacta reutiliza contacto | Pendiente | Pendiente | Integration | Pendiente |
| C-05 | Coincidencia ambigua crea contacto y abre revision | Pendiente | Pendiente | Integration + E2E | Pendiente |
| C-06 | Agente/manager aprueba merge auditado | Pendiente | Pendiente | Route + DB + E2E | Pendiente |
| C-07 | Crear lead con origen manual | Pendiente | Pendiente | Route + E2E | Pendiente |
| C-08 | Atribucion de campana/WhatsApp simulado es idempotente | Pendiente | Pendiente | Contract + integration | Pendiente |
| C-09 | Crear oportunidad y mover etapa configurable | Pendiente | Pendiente | DB + E2E | Pendiente |
| C-10 | Agente y manager mueven; admin configura etapas | Pendiente | Pendiente | Auth + E2E | Pendiente |
| C-11 | Crear/completar tarea asociada a contacto, lead u oportunidad | Pendiente | Pendiente | Route + E2E | Pendiente |
| C-12 | Customer 360 muestra tarea una sola vez | Pendiente | Pendiente | Integration + E2E | Pendiente |
| C-13 | Estados loading/empty/error/forbidden son coherentes | Pendiente | Pendiente | Component + browser | Pendiente |
| C-14 | Escritorio y tablet completan journeys UAT | Pendiente | Pendiente | Playwright | Pendiente |
| C-15 | Mobile web mantiene responsive basico | Pendiente | Pendiente | Browser smoke | Pendiente |
| C-16 | Tenant B queda aislado en UI, API y DB | Pendiente | Pendiente | pgTAP + Auth E2E | Pendiente |

## 7. Revisión de tests

| Dimensión | Pregunta | Resultado |
| --- | --- | --- |
| Unit/contract | ¿Schemas, mappers, errores y query keys cubren lo entregado? | Pendiente |
| Route/BFF | ¿Cada ruta responde 400/401/403/404/409/500 según corresponda? | Pendiente |
| Integration | ¿Transacciones, deduplicacion, merge e idempotencia están probados? | Pendiente |
| Database | ¿Reset, RLS, FKs tenant-aware, kill switches y audit tienen evidencia? | Pendiente |
| Frontend | ¿Cada vista entregada tiene estados y acciones por rol? | Pendiente |
| E2E | ¿Los journeys ejecutan Auth/RLS reales sin bypass? | Pendiente |
| A11y | ¿Dialogos, teclado, foco y Axe cubren la superficie entregada? | Pendiente |
| Responsive | ¿Desktop/tablet y mobile basico tienen evidencia proporcional? | Pendiente |

## 8. Huecos y decisión

| Hueco | Severidad | Acción | Owner | Estado |
| --- | --- | --- | --- | --- |
| Pendiente de completar tras inventario | P0/P1/P2 | Crear test, reducir alcance o aceptar riesgo | User | Pendiente |

Reglas:

- Un hueco P0 en auth, tenancy, pérdida/corrupción de datos o camino crítico es `NOT READY`.
- Un caso entregado sin test no se considera cubierto por un test de otra superficie.
- Una funcionalidad no entregada se elimina del alcance UAT; no se prueba contra una promesa.
- Todo riesgo aceptado requiere owner, mitigación y fecha de revisión.

## 9. Criterio de salida

Marcar `READY FOR TEST` solo cuando:

- [ ] Inventario de producto y rutas completado.
- [ ] Matriz de casos completada.
- [ ] Cada caso P0 tiene cobertura o una decisión aprobada.
- [ ] No hay P0 abierto.
- [ ] Staging es reproducible y la candidate tiene SHA.
- [ ] Datos, roles, permisos y aislamiento están verificados.
- [ ] El equipo sabe qué se prueba y qué queda fuera.
- [ ] Product Owner/Tech Lead/release owner aprueban el alcance de la sesión.

## 10. Registro de revisiones

| Fecha | Candidate | Gate | Resultado | Aprobado por | Evidencia |
| --- | --- | --- | --- | --- | --- |
| 2026-08-13 | Pendiente | G0 | Plantilla creada; no ejecutada | User | Documento de proceso |
