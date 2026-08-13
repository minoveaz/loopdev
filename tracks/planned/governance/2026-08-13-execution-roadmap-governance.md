---
id: execution-roadmap-governance
title: LoopDev 2026 execution roadmap governance
status: planned
created: 2026-08-13
updated: 2026-08-13
owner: governance
lead: null
branch: docs/2026-execution-roadmap
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [governance, platform, crm, marketing-studio, ai-platform]
dependencies: [track-governance]
blocked_by: []
supersedes: []
---

# LoopDev 2026 execution roadmap governance

## Outcome

LoopDev has one approved, evidence-governed 2026 execution roadmap. It defines the CRM pilot
release train, annual portfolio sequence, gates, risk controls, ownership boundaries, and the
rules for translating the roadmap into program and delivery tracks.

## Contexto

`docs/architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md` defines the target product and
architecture. `docs/architecture/LOOPDEV_PILOT.md` contributes a CTO evaluation and a 30-day
CRM pilot plan. `docs/architecture/LOOPDEV_2026_EXECUTION_ROADMAP.md` reconciles both sources into
one proposed source of direction.

The new roadmap retains CRM-first, Marketing Studio second, a modular monolith, shared
multi-tenancy with RLS, incremental frontend convergence, and Insurance Pack separation. It turns
the initial H0/H1 ambiguity into the G0-G5 pilot release train and leaves H2-H5 gated by evidence.

## Alcance

### Incluido

- Review and approve, amend, or reject the proposed 2026 execution roadmap.
- Record the approval decision, approver, date, and next review in the roadmap.
- Reconcile the roadmap with current program and delivery tracks without silently closing,
  deleting, or rewriting historical evidence.
- Define and approve the CRM pilot UX/UI map before creating implementation views or CRM slices.
- Establish the initial three-track WIP model: CRM pilot delivery, data/security and tenancy,
  and release quality/operations.
- Create one GitHub Project that represents the operational execution of the G0-G5 pilot.
- Create `CRM Pilot Execution` as the central CRM program track for the G0-G5 pilot.
- Standardize module definition through `.github/skills/module-definition` before any new module or suite block is implemented.
- Publish and protect `docs/2026-execution-roadmap` as the durable planning branch after the CRM
  pilot planning package is complete.
- Convert accepted pilot gates, P0 risks, and dependencies into small execution tracks after
  roadmap approval.
- Keep the architecture roadmap and CTO evaluation as linked source records.

### Excluido

- Implementing CRM, RLS, CI, infrastructure, billing, AI, communications, or Insurance Pack work.
- Producing final visual implementation before the pilot UX/UI definition is approved.
- Declaring the CRM pilot ready for production or activating real customer data.
- Closing, moving, or deleting existing tracks without explicit approval.
- Replacing approved ADRs, deployed code, applied migrations, or public contracts.
- Treating roadmap approval as approval of sensitive-data processing or deferred capabilities.
- Using GitHub Projects as a second source of product, architecture, risk, or validation truth.

## Decisiones aprobadas

| Fecha | Decision | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-13 | Crear un track de governance para el roadmap de ejecucion 2026 | El roadmap debe tener evidencia, fases, riesgos y una aprobacion explicita antes de gobernar el trabajo anual | El documento se gestiona como propuesta planificada; no se inicia ningun delivery track por esta decision | User |
| 2026-08-13 | Tratar la definicion UX/UI de las vistas CRM como P0 de G0 | Sin mapa de navegacion, vistas, permisos y estados no existe una base para montar el CRM | UX-00 precede a los slices CRM y se incorpora al gate G0 | User |
| 2026-08-13 | Crear un unico GitHub Project operativo para el piloto | Se necesita una vista diaria para seguir el plan, priorizar bloqueos y evitar trabajo improvisado | El Project representa G0-G5; el roadmap y los tracks conservan direccion y evidencia | User |
| 2026-08-13 | Crear `CRM Pilot Execution` como program track central | El piloto necesita un documento operativo distinto del roadmap anual y del mega-track historico | El track CRM historico queda supersedido solo como plan operativo; su evidencia se conserva | User |
| 2026-08-13 | Aprobar el execution roadmap anual en terminos generales | La direccion, secuencia, riesgos y limites del piloto son suficientes para gobernar G0-G5 | El roadmap pasa a `approved`; se permiten ajustes menores no materiales y cambios materiales requieren decision aprobada | User |
| 2026-08-13 | Proteger la rama remota `docs/2026-execution-roadmap` al finalizar la planificacion CRM | La rama concentra el contexto durable que guiara el desarrollo del piloto y del ano | Se publicara, etiquetara y protegera contra borrado y force-push; cambios posteriores entraran por Pull Request | User |
| 2026-08-13 | Crear la skill `module-definition` como flujo estandar de definicion | Contactos tiene paquete completo y Leads estaba incompleto; futuras suites necesitan el mismo proceso | Cada modulo requiere UX, component audit, contract, impact assessment y implementation handoff | User |

## Arquitectura y contratos

El roadmap no modifica contratos de software. Su contrato de gobernanza es:

```text
fuentes de arquitectura y auditoria
  -> roadmap 2026 propuesto
  -> aprobacion explicita y registro de evidencia
  -> program tracks y delivery tracks pequenos
  -> evidencia de gate y decisiones aprobadas
```

La prioridad de fuentes se mantiene: codigo e infraestructura desplegados, ADRs y contratos
aprobados, roadmap aprobado, tracks, y skills o guias de procedimiento.

GitHub Projects es una capa operativa y no una fuente normativa. El Project `CRM Pilot G0-G5`
representa el execution roadmap con esta estructura:

- URL: `https://github.com/users/minoveaz/projects/3`
- Estado inicial: seis items P0 de G0 y paquetes P0 de G1-G5 en Backlog; `UX-00` es el unico item
  Ready.

| Campo | Valores o uso |
| --- | --- |
| Estado | Backlog, Ready, En curso, En revision, Bloqueado, Hecho |
| Gate | G0, G1, G2, G3, G4, G5 |
| Prioridad | P0, P1, P2 |
| Carril | UX/UI, CRM, Datos/Seguridad, Calidad/CI, Operaciones |
| Track | Enlace al track o issue que contiene el alcance y la evidencia duradera |
| Bloqueado por | Item, issue o decision pendiente que debe resolverse antes |
| Evidencia | PR, CI, UAT, runbook o validacion que permite mover el item |
| Decision requerida | Si/No, para separar un bloqueo de producto de trabajo ejecutable |

Las vistas minimas son `Ahora` (items Ready, del gate actual y sin bloqueos), `Kanban` (por
Estado), `Gates` (por Gate), `Bloqueados` y `Decisiones`. La regla diaria es tomar el item P0 Ready
que mas desbloquea el gate actual. Si no hay item Ready, se resuelve una decision o dependencia; no
se abre trabajo nuevo.

## Branch strategy

`docs/2026-execution-roadmap` contiene la documentacion inicial de este track. Los tracks de
ejecucion que deriven del roadmap deben usar ramas propias. Este track no autoriza agrupar la
implementacion de los riesgos P0 en una sola rama transversal.

## Fases

### Fase 0: Aprobacion y reconciliacion del roadmap

**Objetivo:** convertir el roadmap propuesto en una fuente de direccion aprobada o registrar los
ajustes necesarios antes de abrir ejecucion.

**Definition of Ready**
- [x] Se consolidaron la arquitectura objetivo y la evaluacion externa del piloto.
- [x] Existe un roadmap propuesto con G0-G5, H2-H5, riesgos, no-go y decisiones diferidas.
- [ ] UX-00 define y aprueba mapa de navegacion, rutas, vistas, acciones, permisos, estados y flujos UAT.
- [ ] Product Owner, Tech Lead y owner de release estan identificados para la aprobacion G0.

**Entregables**
- [x] Decision explicita de aprobar el roadmap anual en terminos generales.
- [ ] Mapa UX/UI del piloto aprobado antes de abrir vistas o slices CRM.
- [ ] `approver`, `approved_at`, `status`, `version` y `next_review` actualizados si se aprueba.
- [ ] Reconciliacion de los tracks activos con el limite de WIP de tres tracks criticos.
- [ ] GitHub Project `CRM Pilot G0-G5` creado con campos, vistas y items iniciales G0.
- [x] Program track `CRM Pilot Execution` creado y enlazado a las secciones 8.1, 11, 16-19 del roadmap de arquitectura.
- [ ] Primeros tracks de entrega creados solo para los P0 aceptados de G1.
- [ ] Baseline documental final aprobado y rama `docs/2026-execution-roadmap` publicada y protegida.

**Validacion**
- [ ] Validar el track y regenerar el dashboard de tracks.
- [ ] Confirmar que cada item de G0-G5 tiene owner, dependencia, gate y evidencia esperada.
- [ ] Confirmar que el Project enlaza los tracks y la evidencia, sin duplicar decisiones o criterios.
- [ ] Confirmar que no se declara produccion controlada sin cumplir las condiciones no-go.
- [ ] Confirmar tag `roadmap-2026-approved`, proteccion contra borrado/force-push y PR obligatorio.

**Evidencia:** `docs/architecture/LOOPDEV_2026_EXECUTION_ROADMAP.md`, commit `6c1d971`.

**Estado:** en definicion

### Fase 1: Activacion de la ejecucion del piloto

**Objetivo:** traducir la direccion aprobada en tracks pequenos sin superar el WIP acordado.

**Definition of Ready**
- [ ] Fase 0 aprobada explicitamente.
- [ ] G0 tiene owner, capacidad efectiva, sesiones UAT, campos reales y dataset sintetico acordados.

**Entregables**
- [ ] Un track de CRM pilot delivery.
- [ ] Un track habilitador de data/security y tenancy.
- [ ] Un track habilitador de release quality y operations.
- [ ] Dependencias y gates G1 documentados en los tres tracks.

**Validacion**
- [ ] Cada track declara impacto en contratos, schema, RLS, observabilidad, rollout y rollback.
- [ ] Ningun P1 o stretch goal desplaza un P0.
- [ ] La cantidad de tracks activos en el camino critico no supera tres.

**Evidencia:** Pendiente.

**Estado:** bloqueada por Fase 0.

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Proteccion de la rama documental

Al completar la planificacion del piloto CRM se ejecutara este cierre documental:

1. Confirmar que el baseline contiene roadmap, tracks, UX, contratos, ADRs, fixtures y handoffs,
  y que no contiene codigo de producto ni artefactos ajenos.
2. Publicar `docs/2026-execution-roadmap` en `origin`.
3. Crear el tag `roadmap-2026-approved` sobre el commit baseline.
4. Configurar proteccion remota contra borrado y force-push; los cambios posteriores entran por
  Pull Request con revision de governance/Product Owner.
5. Mantener la rama como referencia documental durante el ciclo de desarrollo. No se despliega y no
  se mezcla con ramas de implementacion.

La rama no se retirara ni eliminara hasta que termine el desarrollo anual asociado y exista una
decision explicita de archivado o retiro.

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigacion | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Un ajuste material se introduce sin decision aprobada | El roadmap y los tracks vuelven a divergir | Permitir solo ajustes menores; registrar todo cambio material en governance y ADR cuando sea durable | governance | abierto |
| Las vistas se implementan sin definicion UX/UI aprobada | Retrabajo, flujos incongruentes y CRM no operable | UX-00 es P0 de G0 y bloquea la implementacion de slices CRM | governance | abierto |
| GitHub Project se convierte en una fuente de verdad paralela | El roadmap, los tracks y el tablero divergen | Limitar el Project a estado operativo, enlaces y evidencia; registrar decisiones en roadmap/tracks | governance | abierto |
| Se abren mas de tres tracks criticos | Capacidad diluida y retraso de P0 | Aplicar el limite de WIP y diferir trabajo no critico | governance | abierto |
| Un P1 o stretch goal desplaza un P0 | El piloto no supera sus gates de seguridad y persistencia | Revisar gates G0-G5 antes de aceptar cada nuevo track | governance | abierto |
| Se procesan datos sensibles antes de la aprobacion correspondiente | Riesgo legal, de privacidad y de seguridad | Mantener datos de salud fuera del piloto y exigir decision documentada | crm | abierto |
| Las fuentes vuelven a divergir | Nuevas decisiones usan direccion obsoleta | Enlazar este roadmap desde tracks futuros y registrar cambios aprobados | governance | abierto |
| La rama documental se elimina o recibe cambios directos no revisados | Se pierde contexto o cambia la direccion sin trazabilidad | Protegerla al finalizar la planificacion y exigir PR/revision | governance | abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido: roadmap aprobado o reemplazado por una decision explicita.
- [ ] Fases requeridas cerradas o diferidas explicitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explicitamente por el usuario.

## Evidencia de validacion

| Fecha | Validacion | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-13 | Diagnostico Markdown del roadmap | Correcta | Sin errores del editor en `LOOPDEV_2026_EXECUTION_ROADMAP.md` |
| 2026-08-13 | Convenciones Git del commit de roadmap | Correcta | `pnpm exec node scripts/validate-git-conventions.mjs` antes de `6c1d971` |
| 2026-08-13 | Configuracion de GitHub Project | Correcta | Project #3 creado, enlazado a `minoveaz/loopdev`, con campos operativos e items G0-G5 |

## Handoff de sesion

- **Fecha:** 2026-08-13.
- **Rama de continuacion:** `docs/2026-execution-roadmap`.
- **Commit de partida:** `6c1d971`.
- **Estado alcanzado:** Roadmap aprobado, track de governance planificado y Project #3 configurado para G0-G5.
- **Decisiones, bloqueos y riesgos:** El roadmap anual fue aprobado con ajustes menores permitidos; UX-00, responsables, capacidad, datos, UAT y G0 siguen pendientes.
- **Validacion ejecutada:** Diagnostico Markdown del roadmap y convenciones Git del commit del roadmap.
- **Siguiente accion concreta:** Completar UX-00 antes de activar cualquier slice CRM.

## Cierre

Pendiente de aprobacion explicita.