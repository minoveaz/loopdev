---
id: external-dependency-evaluation
title: Evaluacion de dependencias externas para CRM y suites
status: planned
created: 2026-08-19
updated: 2026-08-19
owner: platform
lead: User
branch: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, frontend, design-system, crm]
dependencies: [reusable-suite-composition-patterns]
blocked_by: []
supersedes: []
---

# Evaluacion de dependencias externas para CRM y suites

## Outcome

Disponer de una recomendacion tecnica y gobernada sobre librerias externas que puedan ampliar
las capacidades de CRM y futuras suites sin romper los contratos, la identidad visual, la
accesibilidad, el responsive behavior ni las fronteras de LoopDev.

## Contexto

LoopDev ya dispone de componentes propios para shell, canvas, tablas, filtros, formularios
parciales, acciones, actividad y estados. Antes de implementar experiencias mas complejas como
calendarios, tablas avanzadas, formularios CRM, Kanban, editores o dashboards, conviene evaluar
si una libreria externa debe actuar como motor interno de un adapter LoopDev o si la capacidad
debe componerse con el DS existente.

La evaluacion nace durante el trabajo de C10 del track `reusable-suite-composition-patterns`,
despues de identificar que una tarjeta de calendario no justifica por si sola introducir una
libreria completa de calendario.

## Alcance

### Incluido

- Inventario de dependencias ya instaladas y capacidades existentes en LoopDev.
- Evaluacion de librerias para calendario y agenda, seleccion de fechas y recurrencias.
- Evaluacion de motores para datos remotos, tablas avanzadas y formularios.
- Evaluacion de drag and drop para Pipeline y vistas Board.
- Evaluacion de editores de notas, comandos, visualizaciones y mapas cuando exista una necesidad
  de producto verificable.
- Comparacion de licencia, mantenimiento, bundle size, SSR/Next.js, accesibilidad, teclado,
  responsive, theming y compatibilidad con PNPM/Turbo.
- Definicion de adapters, wrappers y contratos LoopDev cuando una libreria resulte recomendable.
- Priorizacion por impacto transversal en CRM y futuras suites.
- Registro de decisiones, alternativas descartadas, riesgos y evidencia reproducible.

### Excluido

- Instalar dependencias en esta fase.
- Cambiar contratos publicos de `@loopdev/ui` o `@loopdev/contracts`.
- Implementar CalendarWorkspace, formularios CRM, Pipeline, dashboards o editores.
- Sustituir componentes DS existentes sin evidencia de gap funcional.
- Introducir librerias visuales completas que reemplacen el lenguaje visual de LoopDev.
- Decidir sobre persistencia, RLS, autorizacion multi-tenant o contratos de negocio CRM.

## Decisiones aprobadas

| Fecha      | Decisión                                                                        | Motivo                                                                                                                                       | Impacto                                                                                                                                               | Aprobado por |
| ---------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-08-19 | Mantener la fase como evaluacion sin instalar dependencias.                     | Evitar decisiones prematuras mientras se revisan gaps reales del CRM.                                                                        | Las propuestas deben incluir evidencia de consumidor y adapter antes de adoptar una libreria.                                                         | User         |
| 2026-08-19 | Evaluar librerias como motores internos, nunca como sustitutos directos del DS. | Preservar identidad, tokens, accesibilidad y contratos de LoopDev.                                                                           | Cualquier adopcion futura requiere wrapper, ownership y validacion propia.                                                                            | User         |
| 2026-08-19 | Reservar `dnd-kit` para la implementacion real de Pipeline CRM.                 | El track reusable solo necesita certificar el patron visual Kanban; touch, teclado, sortable y persistencia pertenecen al flujo de Pipeline. | No instalar `dnd-kit` en esta fase. La futura implementacion de Pipeline debera usarlo mediante un adapter LoopDev y validar sus requisitos tecnicos. | User         |

## Arquitectura y contratos

La integracion recomendada, si se aprueba una dependencia, es:

```text
Libreria externa
  -> adapter o hook propiedad de LoopDev
  -> contrato LoopDev
  -> componente @loopdev/ui o widget de suite
  -> composicion SuiteCanvas
```

Las dependencias externas no deben importar logica CRM ni decidir shell, rutas, permisos,
persistencia o reglas multi-tenant. La responsabilidad de dominio permanece en la suite o modulo
consumidor.

## Matriz preliminar: drag and drop para C11

**Consumidor evaluado:** `KanbanBoard` del design system, con posible uso
posterior en Pipeline CRM y otros `BoardWorkspace`.

| Criterio                       | HTML5 actual en `KanbanBoard`                     | `dnd-kit`                                                                        | Evaluación LoopDev                                         |
| ------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Movimiento entre columnas      | Sí, mediante `dataTransfer` y `onDrop`.           | Sí, con sensores y colisiones configurables.                                     | `dnd-kit` ofrece más control para reglas futuras.          |
| Ordenamiento dentro de columna | No existe en el contrato actual.                  | Soportado mediante sortable utilities.                                           | Gap real si Pipeline requiere priorización.                |
| Mouse y touch                  | Mouse/desktop principalmente.                     | Sensores separados para mouse, touch y pointer.                                  | Ventaja clara para mobile.                                 |
| Teclado                        | No hay flujo explícito de movimiento por teclado. | Requiere configurar sensor, instrucciones y announcements.                       | Candidato mejor, pero la accesibilidad no es automática.   |
| Drag overlay                   | No.                                               | Soportado.                                                                       | Evita deformar columnas durante el arrastre.               |
| Restricciones y colisiones     | Limitadas a eventos nativos.                      | Estrategias de colisión y modifiers.                                             | Útil para estados CRM y columnas permitidas.               |
| API LoopDev                    | Contrato propio y pequeño.                        | Requiere adapter/hooks internos.                                                 | Mantener `KanbanBoardProps` independiente de la librería.  |
| Estados de error               | Captura y registra en consola dentro del hook.    | No resuelve persistencia ni errores de negocio.                                  | El consumidor sigue siendo propietario del error/rollback. |
| Responsive                     | Overflow horizontal del board.                    | No resuelve layout; solo interacción.                                            | Seguirá siendo responsabilidad de `BoardWorkspace`.        |
| Identidad visual               | Totalmente controlada por LoopDev.                | Sin UI obligatoria; buena compatibilidad con DS.                                 | Encaja mejor que una librería visual completa.             |
| SSR/Next.js                    | Nativo actual.                                    | Requiere aislar interacción en client components.                                | Compatible, sujeto a spike de build.                       |
| Licencia                       | Sin dependencia adicional.                        | Revisar licencia y paquetes exactos antes de instalar; candidato preliminar MIT. | Confirmar en revisión de dependencia y lockfile.           |
| Bundle y mantenimiento         | Coste cero adicional.                             | Coste adicional por `core`, sensores y sortable según alcance.                   | Medir antes de aprobar adopción.                           |

### Decisión preliminar

`dnd-kit` queda reservado como dependencia candidata para la futura
implementación del Pipeline CRM. No se adoptará dentro de este track para la
fixture visual de C11 ni se instalará durante la fase de evaluación.

La implementación de Pipeline deberá usar `dnd-kit` mediante un adapter interno
de LoopDev, manteniendo el contrato público de `KanbanBoard` independiente de la
librería y dejando la lógica de permisos, persistencia, optimistic update y
rollback en el consumidor CRM.

El spike debe demostrar como mínimo: mover una tarjeta entre columnas, ordenar
dentro de una columna, operación equivalente por teclado, touch en viewport
móvil, drag overlay, cancelación y rollback visual ante error. Debe medir bundle,
verificar SSR/Next.js, ejecutar Axe y conservar la API pública de LoopDev sin
exponer tipos de `dnd-kit`.

Alternativas descartadas por ahora: mantener HTML5 como solución final si C11
requiere keyboard/touch/sortable; adoptar una librería visual completa porque
duplicaría el DS; evaluar `react-beautiful-dnd` por su menor adecuación al estado
actual del ecosistema y su historial de mantenimiento.

## Branch strategy

El track permanece sin rama propia durante la fase de investigacion y readiness porque no modifica
codigo ni dependencias. Una futura fase de implementacion debera declarar una rama especifica antes
de instalar o adaptar cualquier libreria.

## Fases

### Fase 0: Definicion y readiness

**Objetivo:**

Crear una matriz de capacidades, candidatos, riesgos y criterios de adopcion para CRM y suites.

**Definition of Ready**

- [ ] Se han identificado gaps funcionales reales y consumidores previstos.
- [ ] Se ha separado motor funcional, adapter, contrato y componente visual.
- [ ] Cada candidato tiene licencia, mantenimiento, bundle, SSR, accesibilidad y responsive revisados.
- [ ] Se han revisado duplicados y capacidades ya existentes en `@loopdev/ui`.
- [ ] Existe una recomendacion priorizada con alternativas y decisiones pendientes.

**Entregables**

- [ ] Inventario de dependencias actuales.
- [ ] Matriz de candidatos por capacidad.
- [ ] Propuesta de adapters y ownership.
- [ ] Registro de riesgos, licencias y costes operativos.
- [ ] Recomendacion de siguiente fase para cada capacidad.

**Validación**

- [ ] `pnpm validate:plan`.
- [ ] Revision de registry y contratos afectados.
- [ ] Verificacion de licencias y compatibilidad tecnica de los candidatos.
- [ ] Aprobacion explicita de cualquier instalacion o spike posterior.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| ----- | ------ | ------ | ------------------------ | ------------ |

## Riesgos y bloqueos

| Riesgo o bloqueo                                    | Impacto                                               | Mitigación                                                         | Responsable    | Estado  |
| --------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ | -------------- | ------- |
| Introducir una libreria visual que duplique el DS.  | Deriva visual y contratos paralelos.                  | Adoptar solo motores internos mediante adapters LoopDev.           | Platform       | abierto |
| Elegir una libreria sin consumidor CRM verificable. | Dependencias sin retorno y mantenimiento innecesario. | Exigir consumidor, gap funcional y criterio de eliminacion.        | Platform / CRM | abierto |
| Licencia, bundle o SSR incompatibles.               | Bloqueos de build, coste o despliegue.                | Revisar licencia, bundle, SSR y CI antes de cualquier instalacion. | Platform       | abierto |
| Accesibilidad o responsive insuficientes.           | Regresiones en mobile y certificacion UX.             | Validar teclado, Axe, mobile y transformaciones por recipe.        | Frontend       | abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| ----- | ---------- | --------- | ---------- |

## Handoff de sesión

Actualizar al finalizar una sesión de implementación. Es un resumen breve y reemplazable: no duplica
la especificación, el historial de Git ni la conversación.

- **Fecha:** Pendiente.
- **Rama de continuación:** Pendiente.
- **Commit de partida:** Pendiente.
- **Estado alcanzado:** Track creado en planned; sin dependencias instaladas.
- **Decisiones, bloqueos y riesgos:** Evaluacion transversal pendiente; no hay bloqueo de implementacion.
- **Validación ejecutada:** Pendiente.
- **Siguiente acción concreta:** Construir la matriz de candidatos y gaps cuando se retome el track.

## Cierre

Pendiente de aprobación explícita.
