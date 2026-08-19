---
id: crm-pilot-execution
title: CRM Pilot Execution
status: active
created: 2026-08-13
updated: 2026-09-06
owner: crm
lead: User
branch: null
branches: []
phase: 0
pull_requests: [108, 121]
issues: [68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 82, 84, 85, 87, 88, 92, 94]
packages: []
release: pilot
areas: [crm, platform, governance]
dependencies: [execution-roadmap-governance]
blocked_by: [UX-00, G0 approval]
supersedes: [estar-protegidos-crm-platform]
---

# CRM Pilot Execution

## Checkpoint operativo 2026-08-18

El programa se mantiene como el unico frente de coordinacion del piloto CRM. Para reducir el
trabajo en curso, los tracks se clasifican por su capacidad real de producir el siguiente gate;
la existencia de un track no implica que tenga autorizacion para iniciar implementacion.

| Track                           | Estado operativo                                     | Decisión                                                                                        | Siguiente evidencia                                                  |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `crm-pilot-execution`           | activo, coordinacion                                 | Mantener como fuente de verdad del roadmap y del Project                                        | Pipeline backend cerrado como delivery; Tasks es el siguiente bloque |
| `crm-shared-foundation`         | cerrado tras Contacts backend-first                  | Mantener como foundation reutilizable; no reabrirlo para nuevos módulos                         | PRs #111, #114, #116 y cierre #118                                   |
| `crm-leads-backend-foundation`  | backend-first mergeado en `develop` mediante PR #119 | Mantenerlo como dependencia de Pipeline y completar evidencia operativa                         | Validacion end-to-end con Supabase real y cierre operativo de #84    |
| `crm-ui-foundation`             | pausado para nuevos slices                           | Conservar la certificacion de #108; no abrir composiciones posteriores mientras G0 este abierto | Brechas de UI priorizadas despues de G0                              |
| `estar-protegidos-crm-platform` | historico, fuera del WIP                             | No usarlo para planificar entregas; el piloto central lo supersede operativamente               | Migracion o cierre documental posterior                              |

### Regla de trabajo

G0/#68 y la validación del primer consumidor Contacts (#82) están cerrados. Leads (#84) ya está
mergeado en `develop`, pero su cierre operativo aún requiere evidencia end-to-end y de aislamiento
remoto. Pipeline (#85) ya completó su delivery backend. Se autoriza ahora la implementación
funcional de Tasks (#87); Customer 360 (#88) queda posterior y Daily Operation continúa como
resultado transversal de G3. La UI y las primitives compartidas
siguen coordinadas por sus tracks transversales y no autorizan crear componentes CRM paralelos.

### Readiness preparatorio de Pipeline (#85)

- [x] Rama de preparación creada desde `origin/develop`: `feature/crm-pipeline-readiness`.
- [x] Contrato, impacto, auditoría de componentes, UX y handoff revisados.
- [x] Dependencias de Contacts y Leads presentes en `origin/develop`.
- [x] Tech Lead aprueba etapas estables, comandos, RLS e idempotencia.
- [ ] Se reconcilia la evidencia de Leads con el PR #119 y el cierre operativo de #84.
- [ ] G1 valida RLS, FKs tenant-aware, aislamiento cross-tenant y kill switches.
- [ ] Se ejecuta E2E contra la aplicación y Supabase realmente entregados.
- [x] Se autoriza la rama funcional `feature/crm-pilot-pipeline-implementation`.

## Outcome

Estar Protegidos valida en UAT privado un flujo CRM persistente, autorizado, observable y
reversible: login, contacto, lead, oportunidad, pipeline, notas, tareas y Customer 360 minimo. Un
segundo tenant no puede leer, mutar ni referenciar datos del primero.

Este es el program track central del piloto CRM. Coordina los delivery tracks del piloto y el
Project `CRM Pilot G0-G5` (`https://github.com/users/minoveaz/projects/3`); no sustituye al execution roadmap, a los ADR, a los contratos ni a la
evidencia de implementacion.

## Contexto

El track historico `estar-protegidos-crm-platform` conserva el descubrimiento de dominio y la
evidencia previa de CRM, Communications, Document Intelligence e Insurance Pack. Su alcance es
demasiado amplio para controlar el piloto. Este track lo supersede solamente como plan operativo
del piloto; no borra ni cierra el track historico.

`docs/architecture/LOOPDEV_2026_EXECUTION_ROADMAP.md` define la secuencia G0-G5 de este piloto.
Este track convierte esa secuencia en un programa ejecutable y en tracks pequenos de entrega, sin
abrir H2 ni capacidades diferidas.

La especificacion propuesta para UX-00 vive en
`docs/06-product/crm/shared/CRM_PILOT_UX_SPEC.md`. Requiere aprobacion explicita de Product Owner y Tech Lead
antes de marcar UX-00 como completado o iniciar slices CRM.

El dataset inicial esta versionado en
`docs/06-product/crm/fixtures/crm-pilot-contacts.csv`. Contiene dos organizaciones, 20 contactos
sinteticos y casos de deduplicacion. No contiene datos reales ni autoriza cargar datos en ningun
entorno.

La revision previa a pruebas esta definida en
`docs/06-product/crm/shared/CRM_PILOT_READINESS_REVIEW.md`. Es una plantilla pendiente: solo se ejecuta
cuando una release candidate este desplegada en staging y antes de cada ciclo de tests o UAT.

La auditoria de componentes del primer slice esta en
`docs/06-product/crm/contacts/CRM_CONTACTS_COMPONENT_AUDIT.md`. Clasifica primitives reutilizables, widgets,
features y entities necesarios para Contactos y Customer 360 bajo `SuiteRuntime + SuiteCanvas + FSD`.
La matriz fue aprobada por User el 2026-08-13 y desbloquea la preparacion de `CRM-01`.

El handoff para el equipo implementador esta en
`docs/06-product/crm/contacts/CRM_CONTACT_IMPLEMENTATION_HANDOFF.md`. El equipo debe leerlo y marcar su
Definition of Ready en el Issue #82 antes de crear
`feature/crm-pilot-contacts-implementation` desde `develop` actualizado.

La definicion de nuevos modulos sigue `.github/skills/module-definition`. Leads debe completar el
mismo paquete de cinco documentos antes de crear su rama de implementacion.

Pipeline/Opportunities se define en `docs/06-product/crm/pipeline/` mediante el mismo paquete de
cinco documentos y el Issue #85. El paquete permanece propuesto hasta revisar UX, componentes,
contrato e impacto con Product Owner y Tech Lead. Su alcance documental inicial usa `board` como
vista principal, `data` para tabla, `split` para previsualizacion, `record` para detalle y `focus`
para creacion manual.

La estandarizacion de tarjetas CRM aprobada para Pipeline incluye actividad reciente, salud de
actividad, indicadores con tooltip, estados de drag and drop, menu contextual accesible, view models
por entidad y theming por tokens. IA, PDFs/presupuestos, cotizaciones, documentos e integraciones
externas quedan fuera del piloto y se planifican para la siguiente fase.

El board de Pipeline queda aprobado con filtros, movimientos autorizados server-side, alternativa
accesible a drag and drop, estados UX y adaptacion responsive mobile. La reapertura de etapas
terminales requiere accion explicita, permiso elevado, motivo y auditoria.

La tabla de Opportunities queda aprobada con columnas, filtros, acciones, ordenacion, paginacion por
cursor y acciones masivas limitadas.

El detalle `record` de Opportunity queda aprobado con relaciones a Contact y Lead, historial de
etapas, timeline, tareas, notas y reapertura terminal con permiso elevado, motivo y auditoria.

La creacion manual de Opportunity queda aprobada en `focus`, con Contact obligatorio, `origin=manual`,
Lead nulo, producto/interes, etapa abierta, validaciones de tenant/permisos, idempotencia y estados
UX responsive.

El contrato y el impact assessment de Pipeline quedan aprobados por User el 2026-08-13. Pipeline
queda Ready documental en el Issue #85; la implementacion sigue sin iniciar.

Tasks se definira como modulo mediante `.github/skills/module-definition`, usando el Issue #87 como
delivery y el Issue #86 como coordinacion UX de G3. Daily Operation no se crea como modulo separado
en esta fase: se tratara como resultado transversal de G3 compuesto por Contacts, Leads, Pipeline,
Tasks, notas, timeline y Customer 360. El paquete de Tasks definira los contratos compartidos
`Task`, `Note`, `TimelineEvent` y `ActivityItem`.

El paquete de Tasks se organiza en `docs/06-product/crm/tasks/` y permanece `proposed` hasta la
revision punto por punto. Usa #86 como coordinacion UX de G3 y #87 como delivery Issue. Su futuro
handoff define `feature/crm-pilot-tasks-implementation`, pero esta rama documental no inicia codigo.

El Punto 1 de Tasks queda aprobado por User: vistas, rutas, modos Canvas y composicion de componentes.

El Punto 2 de Tasks queda aprobado por User: bandeja y Mi dia con columnas, estados, prioridades,
filtros, acciones, grupos, estados UX y responsive.

El Punto 3 de Tasks queda aprobado por User: detalle, creacion, edicion, relaciones con Contact/Lead/
Opportunity, ciclo de vida, permisos, validaciones y responsive. La entidad relacionada queda fijada
despues de crear la Task durante el piloto.

El Punto 4 de Tasks queda aprobado por User: Notes y Timeline como capacidades compartidas, Timeline
append-only, Notes protegidas por permisos, `ActivityItem` comun y agregacion sin duplicados en
Customer 360.

Customer 360 se define ahora como la proyeccion agregada dentro del detalle de Contact, usando el
Issue #88 y el paquete de cinco documentos en `docs/06-product/crm/customer-360/`. No es una entidad
ni un modulo de navegacion independiente; consume Contacts, Leads, Pipeline y Tasks con
`ActivitySource` y deduplicacion autorizada.

El Punto 1 de Customer 360 queda aprobado por User: vistas `record`, `split` y `overview`, secciones
agregadas, componentes reutilizables y componentes especificos.

El Punto 2 de Customer 360 queda aprobado por User: secciones, permisos por seccion, carga parcial y
deduplicacion mediante `ActivitySource`.

El contrato de Customer 360 queda aprobado por User el 2026-08-13. El impact assessment permanece
pendiente de revision y aprobacion separada.

Customer 360 queda aprobado por User el 2026-08-13: UX spec, component audit, contract e impact
assessment aprobados, y implementation handoff aprobado para handoff. El bloque queda Ready
documental en el Issue #88; Daily Operation sigue siendo resultado transversal de G3.

El paquete de Tasks queda aprobado por User el 2026-08-13: UX spec, component audit, contract e
impact assessment aprobados, y implementation handoff aprobado para handoff. Tasks queda Ready
documental en el Issue #87; Daily Operation permanece como resultado transversal de G3. La
implementacion backend-first de Tasks se ejecuta ahora en `feature/crm-pilot-pipeline-implementation`;
la UI y staging/UAT siguen fuera de este slice.

El alcance final del piloto queda aprobado por User el 2026-08-13. Incluye Auth, Contacts, Leads,
Pipeline, Tasks, Notes, Timeline, Customer 360, RLS, aislamiento tenant, auditoria, staging y UAT.
Quedan fuera Dashboard, import dry-run, IA, PDFs, cotizaciones, documentos, WhatsApp real, email,
calendario externo y paridad mobile. Los carriles son CRM/Frontend, Datos/Seguridad y
Calidad/Operaciones.

La plantilla `docs/06-product/crm/shared/CRM_PILOT_READINESS_REVIEW.md` queda aprobada como proceso
de entrada a cada ciclo de pruebas/UAT. Solo se ejecuta contra una release candidate identificable
desplegada en staging; no certifica el estado actual ni se marca como completada por anticipado.

La matriz de seguridad y aislamiento del piloto vive en
`docs/06-product/crm/shared/CRM_PILOT_SECURITY_AND_ISOLATION_MATRIX.md`. Es evidencia documental de
G1 y cubre roles, verbos, RLS, FKs tenant-aware, kill switches, auditoria y pruebas cross-tenant para
los Issues #70, #71, #72, #73 y #74.

La matriz de seguridad y aislamiento queda aprobada por User el 2026-08-13 como especificacion y
evidencia documental de G1. La ejecucion de policies, pgTAP, E2E, kill switches y auditoria sigue
pendiente y no se considera certificada por esta aprobacion.

User aprueba la secuencia de G1 y sus condiciones de salida el 2026-08-14. La secuencia es:
reset/seed, integridad tenant-aware, RLS por verbo, kill switches, auditoria append-only, pgTAP,
required CI gate, checks reales, E2E con Auth/RLS y validacion del gate G1. Los Issues #70-#78
permanecen Backlog/Todo hasta iniciar ejecucion; no se inicia implementacion desde esta rama.

**Owner operativo:** User. User coordina G0, los tres carriles y las decisiones de Product Owner, Tech
Lead y release owner hasta nueva delegacion.
delivery y el Issue #86 como coordinacion UX de G3. Daily Operation no se crea como modulo separado
en esta fase: se tratara como resultado transversal de G3 compuesto por Contacts, Leads, Pipeline,
Tasks, notas, timeline y Customer 360. El paquete de Tasks definira los contratos compartidos
`Task`, `Note`, `TimelineEvent` y `ActivityItem`.

El paquete de Leads esta organizado en `docs/06-product/crm/leads/`: UX spec, component audit,
contract, impact assessment e implementation handoff. UX, component audit, contract e impact
assessment estan aprobados por User el 2026-08-13; el handoff queda listo para confirmacion en el
Issue #84 antes de crear la rama de implementacion.

Contacts y Leads han validado el mismo flujo backend-first. El procedimiento reusable queda
centralizado en `docs/06-product/crm/shared/CRM_BACKEND_MODULE_PLAYBOOK.md` y debe ser la entrada
obligatoria para Pipeline (#85), Tasks (#87) y cualquier modulo CRM posterior. El playbook fija el
orden contract -> schema/RLS -> service/API -> fixtures -> tests -> handoff, los gates de validacion
y las reglas para reutilizar helpers sin duplicar arquitectura.

Leads tiene seis fuentes activas en el contrato del piloto: `manual`, `campaign`,
`whatsapp_simulated`, `referral`, `social` y `partner`. Las conexiones reales de proveedores siguen
diferidas, pero el modelo de atribucion e idempotencia queda preparado.

Cuando un Lead pasa a `cualificado`, el sistema puede crear una Opportunity de conversion por cada
producto/interes normalizado en el ID estable de etapa `qualified`, inicialmente visible como
`Cualificado`. La primera Opportunity `lead_conversion` mueve el Lead a `convertido`; productos
distintos pueden crear Opportunities adicionales. Reintentos y concurrencia devuelven la misma
Opportunity para la misma clave `tenant + lead + product_key + origin=lead_conversion`. Pipeline
puede crear Opportunities manuales con `origin=manual`. El admin puede cambiar nombre visible u
orden sin modificar IDs, contratos ni datos historicos.

Las decisiones UX/UI confirmadas para UX-00 son:

- Roles de Estar Protegidos: agente comercial, manager y admin. No se habilita perfil viewer.
- Superdev de LoopDev: acceso transversal privilegiado para soporte y operacion, separado de los
  roles tenant. Cada acceso o mutacion cross-tenant requiere proposito, actor y auditoria; no se
  concede como permiso ordinario de un usuario de Estar Protegidos.
- Navegacion visible: Contactos, Leads, Pipeline y Tareas. Customer 360 vive dentro del detalle del
  contacto y no como modulo de navegacion independiente.
- Pipeline configurable por administradores de Estar Protegidos: pueden anadir, quitar y ordenar
  etapas. Agente comercial y manager pueden mover oportunidades entre etapas autorizadas.
- Un lead nuevo crea un contacto salvo que la deduplicacion encuentre una coincidencia segura. La
  deduplicacion considera que una persona puede usar numeros distintos. Ante una coincidencia
  ambigua por nombre e identificador parcial, se crea el contacto, se informa al agente y se abre
  una revision humana de posible duplicado. Solo el agente aprueba un merge hacia un contacto unico;
  el merge conserva auditoria, referencias de leads y trazabilidad de la decision.
- El formulario de contacto admite un conjunto amplio de campos y una configuracion posterior de
  visibilidad por organizacion. Durante el piloto, el admin solo puede mostrar, ocultar y marcar
  como obligatorios campos existentes; no puede crear campos personalizados. UX-00 define el minimo
  obligatorio y el contrato de configuracion, sin introducir datos sensibles de seguros o salud en
  CRM Core.
- Campos personales requeridos por el piloto: DNI/NIE/pasaporte, fecha de nacimiento, genero y
  estado civil. Los cuatro son opcionales al crear o editar un contacto durante el piloto.
  DNI/NIE/pasaporte se vuelve obligatorio al iniciar una cotizacion o solicitud de poliza, flujos
  diferidos fuera del piloto. Se clasifican como datos personales confidenciales, no como datos de
  salud: se almacenan con proposito CRM declarado, acceso limitado por permisos, audit de
  lectura/exportacion cuando aplique, retencion definida antes de datos reales y exclusion expresa
  de logs y analytics.
- Customer 360 minimo: perfil, leads, oportunidades, notas, tareas y timeline. Quedan fuera familia,
  documentos, cotizaciones, seguros y comunicaciones.
- Una tarea puede asociarse a contacto, lead u oportunidad, pero aparece una sola vez en Customer 360.
- Dashboard e import dry-run quedan fuera del piloto inicial y se planifican para el sprint posterior,
  una vez validado el flujo CRM completo.
- UAT funcional en escritorio y tablet; mobile web conserva responsive basico sin paridad funcional.

La composicion frontend del piloto sigue el ADR
`docs/architecture/ADR-2026-08-13-suite-runtime-suite-canvas-fsd.md`: `SuiteRuntime + SuiteCanvas`
es la composicion estandar, y FSD organiza widgets, features y entities dentro de cada Canvas.
`SuiteCanvas` no contiene logica CRM ni accede a datos.

- Los leads pueden tener origen manual, campana de marketing, mensaje de WhatsApp simulado, referral,
  social o partner. En el piloto se implementa el contrato de origen y atribucion para los seis casos,
  con provider, identificador externo, campana/UTM, marca y workspace cuando existan. Las conexiones
  reales de Marketing y WhatsApp se mantienen desactivadas; H2 debe configurarlas como primera
  integracion posterior sin cambiar el modelo de lead ni crear contactos duplicados.

## Alcance

### Incluido

- G0: UX-00, scope firmado, owners, capacidad, dataset sintetico, sesiones UAT y Project operativo.
- G1: Contacts, seguridad RLS por verbo, integridad tenant-aware, kill switches, audit append-only,
  reset/seed/types, pgTAP, CI requerido y primer slice persistente.
- G2: captura de lead transaccional e idempotente, detalle/edicion de lead y pipeline persistente.
- G3: notas, tareas, timeline, Customer 360 minimo, staging, observabilidad y primer UAT. Dashboard e
  import dry-run quedan fuera del piloto y pasan al sprint posterior.
- G4-G5: remediacion P0/P1, accesibilidad, rendimiento, restore drill, runbooks, canary y decision
  de activar un anillo nominal o continuar como UAT privado.

### Excluido

- H2 CRM Commercial MVP y cualquier cobro, billing, checkout, portal o autoservicio.
- WhatsApp saliente; inbound solo puede considerarse stretch goal tras G3 y no desplaza P0.
- Insurance Quoting, elegibilidad automatizada, OCR, Document Intelligence, Product Catalog y
  documentos reales.
- IA, AI Insights, scoring, RAG, agentes o mutaciones automatizadas.
- Paridad CRM movil, Marketing Studio, Quant, Health y refactors globales de shell/FSD/Design System.

## Referencias de arquitectura obligatorias

| Fuente                                                                           | Parte que este track cumple                                                                                                | Aplicacion en el piloto                                                                                                |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `docs/architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md`, seccion 8.1 CRM | Core de contactos/empresas, leads, pipeline, actividades, tareas, notas, Customer 360, busqueda, permisos, RLS y auditoria | Entregar solo el core necesario para el flujo critico; inbox, automatizaciones, catalogo, documentos e IA siguen fuera |
| Mismo documento, secciones 11.1-11.4                                             | Jerarquia organization/workspace/brand, membership, permisos, entitlement, invariantes RLS y caminos privilegiados         | Probar aislamiento de dos tenants, FKs tenant-aware, kill switches y prohibir service role en requests de usuario      |
| Mismo documento, secciones 16.1 y 16.4-16.5                                      | Staging con datos sinteticos/pseudonimizados, produccion aislada, migraciones, tipos, smoke y restore                      | Preparar staging y solo abrir un anillo productivo tras G5; Dev o Staging no se presentan como produccion              |
| Mismo documento, secciones 17.1-17.4                                             | Seguridad, rate limits, logs, error tracking, health/readiness, alertas y runbooks                                         | Hacer operable y reversible el piloto antes de datos reales                                                            |
| Mismo documento, secciones 18.1-18.3                                             | Gates por frontend, database, contracts y Render; DoR y DoD de vertical slices                                             | Cada delivery track declara contratos, schema/RLS, estados UX, rollout, rollback, pruebas y evidencia                  |
| Mismo documento, seccion 19 H0-H1                                                | Foundation y CRM Pilot: ruta CRM estandar, staging reproducible, flujo critico y cero fallos cross-tenant P0/P1            | G0-G5 operacionaliza H0/H1; H2 solo se abre con evidencia de salida del piloto                                         |

## Decisiones aprobadas

| Fecha      | Decision                                                                                         | Motivo                                                                                                                              | Impacto                                                                                                                                                                        | Aprobado por |
| ---------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| 2026-08-13 | Crear `CRM Pilot Execution` como program track central                                           | El track CRM historico mezcla dominios y fases que exceden el piloto controlado                                                     | G0-G5, delivery tracks y GitHub Project se coordinan desde este documento                                                                                                      | User         |
| 2026-08-13 | Superseder el track CRM historico solo como plan operativo del piloto                            | Preservar evidencia previa sin usar un mega-track como control diario                                                               | `estar-protegidos-crm-platform` permanece como antecedente; no se cierra ni elimina                                                                                            | User         |
| 2026-08-13 | Definir roles, navegacion, pipeline configurable y alcance UX del piloto                         | UX-00 necesita decisiones de producto antes de implementar vistas CRM                                                               | Sin viewer; Customer 360 dentro de contacto; superdev auditado; UAT funcional en escritorio/tablet; dashboard y capacidades simuladas se excluyen                              | User         |
| 2026-08-13 | Limitar la configuracion de campos a mostrar, ocultar y marcar obligatorios                      | Crear campos personalizados altera schema, busqueda, exportacion, contratos y RLS                                                   | El piloto configura solo campos existentes; campos personalizados se difieren                                                                                                  | User         |
| 2026-08-13 | Incluir identificacion, fecha de nacimiento, genero y estado civil en Contactos                  | Estar Protegidos necesita esos datos personales para operar el CRM del piloto                                                       | Se aplican proposito, permisos, retencion, audit y exclusion de logs; no habilita datos de salud ni Insurance Pack                                                             | User         |
| 2026-08-13 | Crear contacto y solicitar revision ante duplicado ambiguo                                       | Una persona puede usar numeros distintos y no se debe bloquear la operacion ni fusionar automaticamente                             | El agente aprueba el merge auditado; coincidencias seguras reutilizan contacto                                                                                                 | User         |
| 2026-08-13 | Preparar atribucion de leads para Marketing y WhatsApp sin activar conexiones                    | Los futuros leads vendran de campanas o mensajes y H2 debe integrarlos sin rehacer el modelo                                        | Lead conserva origen, provider, identificador externo, campana/UTM, marca y workspace cuando existan                                                                           | User         |
| 2026-08-13 | Mantener los cuatro campos personales como opcionales en Contactos                               | La captacion CRM no debe bloquearse por datos necesarios mas adelante en cotizacion o solicitud de poliza                           | DNI/NIE/pasaporte sera obligatorio solo al iniciar esos flujos diferidos; fecha de nacimiento, genero y estado civil permanecen opcionales                                     | User         |
| 2026-08-13 | Aprobar UX-00 y asumir inicialmente Product Owner, Tech Lead y release owner                     | El piloto requiere una autoridad de producto, arquitectura y promocion aunque una sola persona cubra los roles                      | `CRM_PILOT_UX_SPEC.md` pasa a approved; User asume las tres responsabilidades hasta nueva delegacion                                                                           | User         |
| 2026-08-13 | Aprobar el enfoque de dataset sintetico y UAT por dos sesiones                                   | El piloto necesita datos representativos y aceptacion progresiva sin datos reales prematuros                                        | Se prepara CSV con dos tenants y casos de deduplicacion; UAT 1 valida journeys y UAT 2 confirma correcciones                                                                   | User         |
| 2026-08-13 | Exigir revision de estado y cobertura antes de iniciar pruebas                                   | No se debe ejecutar una suite sin saber que comportamiento entregado debe demostrar                                                 | Cada ciclo de test/UAT inventaria funcionalidades reales, casos esperados, cobertura existente, huecos y criterio de salida                                                    | User         |
| 2026-08-13 | Confirmar que User asume los tres roles del piloto                                               | Actualmente no hay responsables adicionales disponibles                                                                             | User actua como Product Owner, Tech Lead y release owner hasta nueva delegacion                                                                                                | User         |
| 2026-08-13 | Confirmar dos carriles de ingenieria                                                             | El piloto necesita separar producto/frontend de plataforma/datos aunque la ejecucion pueda ser secuencial                           | Carril CRM/Frontend y carril Datos/Seguridad/Operaciones; no implica dos personas disponibles                                                                                  | User         |
| 2026-08-13 | Adoptar `SuiteRuntime + SuiteCanvas` como composicion del piloto y aplicar FSD dentro del Canvas | El CRM parte de una composicion de suite flexible y modos de visualizacion ya demostrados en Shell Showcase                         | CRM usara Canvas sin logica de negocio; el contenido se organiza por widgets/features/entities                                                                                 | User         |
| 2026-08-13 | Crear dataset sintetico inicial                                                                  | Se necesita una base determinista para contratos, deduplicacion, importacion y pruebas                                              | `crm-pilot-contacts.csv` queda como fixture de referencia; debe ampliarse con leads, oportunidades y tareas antes de UAT                                                       | User         |
| 2026-08-13 | Usar fechas tentativas ligadas a gates para UAT                                                  | Las sesiones no deben bloquear G0 ni fingir disponibilidad antes de staging                                                         | UAT 1: 2026-09-04; UAT 2: 2026-09-11. Son fechas tentativas y se confirman cuando staging y funcionalidades esten Ready                                                        | User         |
| 2026-08-13 | Crear plantilla de revision de readiness                                                         | Las pruebas deben comparar producto realmente entregado, casos esperados y cobertura antes de ejecutarse                            | `CRM_PILOT_READINESS_REVIEW.md` bloquea interpretaciones de cobertura sin candidate en staging                                                                                 | User         |
| 2026-08-13 | Aprobar auditoria de componentes de Contactos                                                    | La vista debe construirse con limites claros entre shell, FSD y dominio CRM                                                         | `CRM-01` puede prepararse con ContactTable, ContactForm, ContactDetailPanel y sus features/entities                                                                            | User         |
| 2026-08-13 | Aprobar contrato de Contact e impact assessment de CRM-01                                        | La implementacion necesita un acuerdo comun de datos y una matriz de impactos antes de tocar codigo                                 | `CRM-01` pasa Definition of Ready; el desarrollo aun no se inicia                                                                                                              | User         |
| 2026-08-13 | Aprobar paquete UX de Leads y reglas de conversion por producto                                  | Un Lead puede interesarse por varios seguros sin duplicar la misma Opportunity; la unicidad debe proteger reintentos y concurrencia | Leads queda Ready documental; primera conversion mueve a `convertido`, conversiones posteriores usan `product_key` distinto y Pipeline distingue `manual` de `lead_conversion` | User         |
| 2026-09-06 | Confirmar que `brand_id` no es una frontera de seguridad CRM independiente                       | La marca identifica el CRM dentro de la organización, pero no debe crear un segundo aislamiento ni una vía para evadir el tenant    | Organización y workspace siguen siendo los límites autoritativos de RLS, FKs, RPCs y APIs; se prohíbe añadir RLS aislada por marca                                             | User         |
| 2026-08-13 | Definir Tasks como modulo y Daily Operation como resultado transversal de G3                     | Tasks es una entidad reutilizable; Daily Operation depende de Contacts, Leads, Pipeline, notas, timeline y Customer 360             | Se crea el paquete de cinco documentos para Tasks bajo `docs/06-product/crm/tasks/`; no se crea un modulo separado de Daily Operation                                          | User         |
| 2026-08-13 | Sacar Dashboard e import dry-run del piloto                                                      | El piloto debe validar primero el flujo CRM critico y reducir complejidad operativa                                                 | Dashboard e import dry-run pasan al sprint posterior, despues de validar Contacts, Leads, Pipeline, Tasks y Customer 360                                                       | User         |
| 2026-08-13 | Aprobar alcance final y tres carriles del piloto                                                 | Un mes exige limitar el producto a la jornada CRM critica y separar responsabilidades de ejecucion                                  | El piloto excluye Dashboard/import dry-run y capacidades diferidas; G0 puede pasar a preparar owners, dependencias y evidencias                                                | User         |
| 2026-08-13 | Aprobar plantilla de readiness del piloto                                                        | Las pruebas deben demostrar lo que la candidate realmente entrega, con casos, cobertura y evidencia                                 | `CRM_PILOT_READINESS_REVIEW.md` queda como gate obligatorio antes de cada ciclo de pruebas/UAT                                                                                 | User         |
| 2026-08-14 | Aprobar secuencia y salida de G1                                                                 | La matriz aprobada necesita un orden operativo y evidencia verificable antes de ejecutar CRM                                        | G1 sigue bloqueado por ejecucion pendiente; solo se aprueba la secuencia y sus condiciones de salida                                                                           | User         |

## Arquitectura y contratos

```text
UX-00 y G0 aprobados
  -> Contact slice con contratos, BFF, RLS y UI real
  -> Lead y pipeline persistentes
  -> Work, Customer 360 y UAT en staging
  -> Hardening, restore, canary y decision G5
```

Cada delivery track debe declarar Contracts, Schema, RLS, Storage, Secrets/providers, AI,
Billing/entitlements, Observability y Rollout/rollback. El navegador no usa `service_role`; las
mutaciones criticas usan contratos, autorizacion server-side, RLS y datos autoritativos.

## Plan de ejecucion operativo

### Orden y dependencias

| Orden | Fase                       | Issues                  | Carril principal      | Owner | Dependencia de entrada          | Salida exigida                                                 |
| ----- | -------------------------- | ----------------------- | --------------------- | ----- | ------------------------------- | -------------------------------------------------------------- |
| 0     | G0 Definition/readiness    | #66, #67, #68           | Coordinacion          | User  | Alcance, UX y Project definidos | G0 firmado, owners/evidencia/dependencias completas            |
| 1     | G1 Security/first slice    | #70-#78, #82            | Datos/Seguridad + CRM | User  | G0 aprobado                     | RLS, seed, CI, pgTAP, E2E y Contacts persistente               |
| 2     | G2 Lead/Pipeline           | #83, #84, #85           | CRM/Frontend          | User  | G1 validado                     | Leads y Opportunities persistentes, idempotencia y aislamiento |
| 3     | G3 Daily Operation/staging | #86, #87, #88, #79, #80 | CRM + Operaciones     | User  | G2 validado                     | Tasks, Customer 360, staging, observabilidad y readiness UAT 1 |
| 4     | G4 Hardening/UAT 2         | #90, #91, #92, #81      | Calidad/Operaciones   | User  | UAT 1 y G3 aceptados            | P0/P1 resueltos, restore/rollback y readiness UAT 2            |
| 5     | G5 Release decision        | #94                     | Calidad/Operaciones   | User  | UAT 2 aceptada                  | Smoke/canary y decisión UAT privado o anillo nominal           |

### Carriles y WIP

| Carril              | Responsabilidad                                                | Issues iniciales        | Regla WIP                               |
| ------------------- | -------------------------------------------------------------- | ----------------------- | --------------------------------------- |
| CRM/Frontend        | Contratos de ruta, vistas, estados UX e integración de módulos | #82, #84, #85, #87, #88 | Un slice activo por vez                 |
| Datos/Seguridad     | Schema, FKs, RLS, kill switches, audit, seed y pgTAP           | #70-#75                 | No avanzar sin evidencia de aislamiento |
| Calidad/Operaciones | CI, E2E, staging, observabilidad, restore, UAT y release       | #76-#81, #90-#94        | No ejecutar UAT sin readiness review    |

### Evidencia mínima por gate

| Gate | Evidencia mínima                                                                      | No-go                                                 |
| ---- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| G0   | Alcance aprobado, matriz de dependencias, Project actualizado, fechas UAT tentativas  | Scope ambiguo o sin owner operativo                   |
| G1   | RLS/pgTAP, seed reproducible, kill switches, audit append-only, CI y Contacts E2E     | Cross-tenant, service_role browser o P0 de seguridad  |
| G2   | Routes/API reales, persistencia, conversiones idempotentes, pruebas de Leads/Pipeline | Duplicados, pérdida de relación o aislamiento fallido |
| G3   | Candidate en staging, readiness review, Tasks/Customer 360 E2E, health/logs/Sentry    | Candidate no reproducible o caso P0 sin cobertura     |
| G4   | Correcciones UAT 1, a11y, rendimiento básico, rollback y restore drill                | P0/P1 abierto o restore no verificable                |
| G5   | UAT 2 aceptada, smoke/canary, runbooks y decisión explícita                           | Decisión sin evidencia o no-go sin remediación        |

### Calendario tentativo y checkpoints

```text
2026-08-13 -> planificación y G0 documental
2026-08-14..2026-08-21 -> G0 final + G1 seguridad/primer slice
2026-08-24..2026-09-02 -> G2 CRM persistente + G3 preparación staging
2026-09-03 -> Readiness Review UAT 1
2026-09-04 -> UAT 1
2026-09-05..2026-09-09 -> remediación P0/P1 + regresión
2026-09-10 -> Readiness Review UAT 2 + restore/rollback
2026-09-11 -> UAT 2
2026-09-12 -> decisión G5
2026-09-13 -> objetivo del piloto, sujeto a evidencia y aprobación
```

Las fechas posteriores al 2026-08-13 son tentativas. Se mueven si G1, G2, staging o readiness no
cumplen sus criterios de entrada. Dashboard e import dry-run quedan fuera de esta secuencia.

## Branch strategy

Este program track no tiene una rama unica porque sus tres carriles de ejecucion requieren ramas de
entrega separadas: CRM, datos/seguridad-tenancy y calidad/operaciones. Cada delivery track declara
su propia rama, PR y evidencia. La rama actual de documentacion solo contiene la definicion del
programa y no autoriza implementacion del piloto.

## Fases

### Fase 0: G0 - Definition and readiness

**Objetivo:** aprobar el alcance ejecutable del piloto antes de implementar vistas o slices CRM.

**Definition of Ready**

- [x] Execution roadmap aprobado.
- [x] UX-00 aprobado: navegacion, rutas, vistas, acciones, permisos, estados y flujos UAT.
- [x] Roles, navegacion visible, ubicacion de Customer 360, alcance excluido y plataformas UAT definidos.
- [x] User asume inicialmente Product Owner, Tech Lead y release owner.
- [x] Dos carriles de ingenieria confirmados, aunque puedan ejecutarse secuencialmente.
- [x] Dataset sintetico y estructura UAT aprobados.
- [x] Sesiones UAT calendarizadas con fechas concretas tentativas.

**Entregables**

- [x] GitHub Project `CRM Pilot G0-G5` con campos, vistas e items G0.
- [x] Alcance firmado y reduccion de alcance definida para una sola persona ingeniera.
- [x] Tres delivery tracks criticos preparados sin superar el WIP acordado.

**Validacion**

- [x] Owner operativo de G0 y carriles confirmado: User.
- [x] Cada item G0 tiene owner, dependencia, gate y evidencia esperada.
- [ ] Ninguna vista CRM inicia implementacion sin UX-00.
- [ ] Antes de cada ciclo de pruebas o UAT, existe una revision de readiness con funcionalidades entregadas, matriz de casos, cobertura existente, huecos y criterio de salida.

**Evidencia:** `docs/06-product/crm/shared/CRM_PILOT_UX_SPEC.md` v1.1, aprobado el 2026-08-13 por User.

**Estado:** pendiente.

**Calendario tentativo:** UAT 1 el 2026-09-04 para validacion funcional en staging; UAT 2 el
2026-09-11 para regresion, hardening y readiness de release. Las fechas no son compromiso definitivo:
se confirman tras G1/G2, despliegue reproducible y revision de readiness.

**Matriz operativa G0**

| Issue                  | Owner | Dependencia                                   | Gate     | Evidencia                                      |
| ---------------------- | ----- | --------------------------------------------- | -------- | ---------------------------------------------- |
| #66 Campos y dataset   | User  | UX-00 y contratos CRM aprobados               | G0       | `docs/06-product/crm/fixtures/` y paquetes CRM |
| #67 Sesiones UAT       | User  | Fechas tentativas, staging y readiness review | G0/G3/G4 | Este track y `CRM_PILOT_READINESS_REVIEW.md`   |
| #68 Alcance y carriles | User  | Roadmap, UX-00 y capacidad disponible         | G0       | Alcance aprobado y tres carriles en este track |

### Fase 1: G1 - Security and first persistent slice

**Objetivo:** establecer seguridad, aislamiento y el primer flujo de contactos con datos reales de
entorno controlado.

**Definition of Ready**

- [ ] G0 aprobado.
- [ ] Delivery tracks de datos/seguridad, calidad/operaciones y CRM preparados.

**Entregables**

- [ ] RLS por verbo, FKs tenant-aware, kill switches y audit append-only.
- [ ] Reset, seed sintetico, tipos generados, pgTAP y gate CI requerido.
- [ ] Lista, busqueda, creacion y detalle de contacto con API, autorizacion y persistencia real.

**Validacion**

- [ ] Viewer no muta y tenant B no accede ni referencia datos de tenant A.
- [ ] Reset/lint/pgTAP y el E2E del contacto pasan.

**Evidencia:** Pendiente.

**Estado:** bloqueada por Fase 0.

### Fase 2: G2 - Lead and pipeline end-to-end

**Objetivo:** completar contacto -> lead -> oportunidad/etapa con persistencia, idempotencia y
aislamiento verificable.

**Definition of Ready**

- [ ] Fase 1 validada.

**Entregables**

- [x] Captura de lead transaccional/idempotente y normalizacion unica (`captureLead`, idempotencia
      por `organization_id + source + external_lead_id`, unicidad de conversion por
      `organization_id + lead_id + product_key` con `origin=lead_conversion`).
- [x] Listado, edicion y transicion de estado de Lead persistentes (`GET/PATCH /api/crm/leads`,
      `POST /api/crm/leads/status`). Detalle de Lead (`getLead`) existe como helper interno; no se
      expone todavia como ruta propia (fuera de las cinco rutas pedidas para este slice).
- [x] Estado de servidor CRM real para Leads: contratos Zod, rutas delgadas y pruebas de
      ruta/servicio/contrato (46 tests). Pendiente pruebas E2E de Playwright (fuera de alcance de este
      slice backend-first, igual que en Contacts).
- [x] Pipeline como modulo (#85) implementado en backend: catalogo de etapas por organizacion/workspace,
      Opportunities persistentes, historial append-only, idempotencia y versionado optimista.

**Validacion**

- [x] El flujo HTTP autenticado sobrevive reintentos y valida owner/viewer, idempotencia, reapertura,
      actualización y conflicto de versión; la validación staging/UAT de producto sigue pendiente.
- [x] UAT técnico backend completado con owner/viewer, persistencia, autorización, aislamiento,
      auditoría y conflictos de concurrencia; el UAT visual y de interacción frontend queda pendiente.
- [x] Aislamiento cross-tenant verificado por pgTAP para las columnas y la unicidad nuevas
      (`supabase test db`, `supabase/tests/database/005_crm_security.sql`, 148 aserciones, archivo en
      `ok`).

**Evidencia:** Ver fila 2026-08-18 en "Evidencia de validacion" mas abajo.

**Estado:** Backend de Leads y Pipeline mergeado en `develop` mediante PRs #119 y #121. El delivery
backend de Pipeline queda cerrado con su evidencia técnica; la salida integral de G2 sigue pendiente
de reconciliar la validación de G1, staging/UAT y el cierre operativo de los delivery tracks.

### Fase 3: G3 - Daily operation and staging UAT

**Objetivo:** permitir la jornada critica de un agente en staging y obtener el primer UAT.

**Definition of Ready**

- [ ] Fase 2 validada.

**Entregables**

- [x] Notas, tareas, completado y timeline en backend-first: contratos, schema/RLS, servicio, API,
      fixtures y pruebas locales; la integración de producto queda pendiente.
- [x] Customer 360 backend-first (#88): proyección autorizada dentro de Contact, contratos de
      record/split/overview, secciones independientes, deduplicación por ActivitySource, rutas de lectura
      y comandos contextuales; la integración de producto, E2E y staging quedan pendientes.
- [ ] Staging reproducible, health, logs, Sentry y UAT 1.

**Validacion**

- [ ] Un agente completa el flujo diario critico con datos autorizados.
- [ ] Deploy y rollback de aplicacion son reproducibles.

**Evidencia:** Pendiente.

**Estado:** bloqueada por Fase 2.

**Fuera del piloto:** Dashboard CRM e import dry-run se planifican en el sprint posterior al piloto.

### Fase 4: G4-G5 - Hardening and release decision

**Objetivo:** resolver defectos criticos, demostrar recuperacion y tomar una decision binaria de
go-live o UAT privado.

**Definition of Ready**

- [ ] Fase 3 validada y UAT inicial completado.

**Entregables**

- [ ] Remediacion de P0/P1, accesibilidad, rendimiento, rate limits, secrets y runbooks.
- [ ] Restore drill, rollback, usuarios nominales, smoke checks y plan de hypercare.

**Validacion**

- [ ] Se cumplen todas las condiciones de salida G4-G5 y ninguna condicion absoluta de no-go.
- [ ] Tech Lead, Product Owner y representante de Estar Protegidos toman la decision G5.

**Evidencia:** Pendiente.

**Estado:** bloqueada por Fase 3.

## Registro de cambios de enfoque

| Fecha      | Cambio                                         | Motivo                                                                                                     | Impacto en alcance/fases                                                                                                                     | Aprobado por |
| ---------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-08-13 | Separar el piloto del mega-track CRM historico | El piloto requiere gates fechados, WIP limitado y evidencias operativas                                    | CRM Pilot Execution coordina G0-G5; el historico se preserva como antecedente                                                                | User         |
| 2026-08-19 | Continuar con Tasks antes de crear staging     | Contacts, Leads y Pipeline ya tienen delivery backend; staging se crea una vez para certificar el conjunto | Tasks es el siguiente delivery; Daily Operation sigue transversal; Customer 360 se completa después; staging queda posterior a estos bloques | User         |

## Riesgos y bloqueos

| Riesgo o bloqueo                                                               | Impacto                                                 | Mitigacion                                                                                     | Responsable | Estado  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- | ------- |
| UX-00 no aprobado                                                              | No existe una base coherente para vistas CRM            | Bloquear implementacion de vistas y slices hasta definir UX/UI                                 | crm         | abierto |
| Deduplicacion une personas distintas o duplica una persona con varios numeros  | Corrupcion de contactos o perdida de contexto comercial | Coincidencias deterministas seguras; candidatos ambiguos requieren revision humana             | crm         | abierto |
| Campos personales aparecen en logs, analytics o exportaciones sin control      | Exposicion de PII y riesgo de cumplimiento              | Clasificacion confidencial, minimizacion, proposito, permisos, audit y redaccion de logs       | crm         | abierto |
| Futuros adaptadores de campana o WhatsApp crean contactos/leads inconsistentes | Atribucion perdida o contactos duplicados al activar H2 | Contrato de origen e idempotencia preparado desde el piloto; pruebas de adapters al activarlos | crm         | abierto |
| Pruebas ejecutadas contra una superficie distinta de la entregada              | Falsos verdes o casos de negocio sin cobertura          | Revision de readiness y matriz de cobertura antes de cada ciclo de test/UAT                    | qa          | abierto |
| El roadmap/G0 no tiene aprobacion explicita                                    | No se puede activar ejecucion ni evaluar gates          | Mantener el track planned y obtener decision formal                                            | governance  | abierto |
| Mas de tres carriles activos                                                   | Capacidad diluida y P0 retrasados                       | Limitar el piloto a CRM, datos/seguridad y calidad/operaciones                                 | crm         | abierto |
| RLS, FKs o kill switches incompletos                                           | Riesgo de acceso cross-tenant o perdida de datos        | Delivery track dedicado, pgTAP y E2E con dos tenants                                           | platform    | abierto |
| Se introducen Insurance, WhatsApp saliente, IA o billing                       | Scope creep y retraso del flujo core                    | Aplicar exclusiones; aceptar cambios solo con trade-off escrito                                | crm         | abierto |
| Sin restore/rollback y observabilidad                                          | No es posible operar datos reales de forma segura       | Delivery track de operaciones y no-go en G5                                                    | platform    | abierto |

## Criterios de cierre

- [ ] G0-G5 concluidos con evidencia adjunta o se registra explicitamente la decision de continuar UAT.
- [ ] El flujo critico funciona con datos autoritativos, autorizacion y aislamiento verificables.
- [ ] Los riesgos residuales y las capacidades diferidas estan documentados.
- [ ] Los delivery tracks requeridos se cierran o difieren explicitamente.
- [ ] Cierre aprobado explicitamente por el usuario.

## Evidencia de validacion

| Fecha      | Validacion                                                                          | Resultado                                                                                                                                                                                                                                                                                                                    | Referencia                                                                                                                                                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | Reconciliacion de tracks frente al execution roadmap                                | Pendiente de aprobacion operativa                                                                                                                                                                                                                                                                                            | Se detectaron tracks activos historicos que exceden el WIP de tres carriles                                                                                                                                                                                                                                    |
| 2026-08-13 | Inicializacion del Project del piloto                                               | Correcta                                                                                                                                                                                                                                                                                                                     | Project #3 contiene paquetes P0 G0-G5; UX-00 es el unico item Ready                                                                                                                                                                                                                                            |
| 2026-08-13 | Conversion del Project a Issues reales                                              | Correcta                                                                                                                                                                                                                                                                                                                     | Project #3 contiene 31 Issues, sin borradores ni titulos duplicados; #93 y #95 cerrados como duplicados de #92 y #94                                                                                                                                                                                           |
| 2026-08-18 | CRM UI foundation                                                                   | Parcial: gate visual y responsive certificado; persistencia, RLS y UAT siguen pendientes                                                                                                                                                                                                                                     | PR #108 mergeado en `develop` mediante `76e9a340`; Issues #70-#78 y #82-#88 siguen abiertos                                                                                                                                                                                                                    |
| 2026-08-18 | Leads backend-first (#84): contratos, schema, servicio, rutas                       | Correcta en local: `pnpm --filter @loopdev/contracts build`, `tsc --noEmit` en `loopdev-os`, `eslint` sin hallazgos, `vitest run` (719/719, incl. 46 CRM), `supabase db reset` y `supabase test db` (140 aserciones pgTAP, archivo `005_crm_security.sql` en `ok`)                                                           | PR #119 mergeado en `develop`; falta E2E remoto/staging y cierre operativo de #84                                                                                                                                                                                                                              |
| 2026-08-18 | Readiness preparatorio de Pipeline (#85)                                            | Correcta: rama limpia `feature/crm-pipeline-readiness` basada en `origin/develop`; documentos de Pipeline y playbook revisados                                                                                                                                                                                               | Implementación funcional bloqueada hasta Tech Lead, G1, E2E y cierre operativo de Leads                                                                                                                                                                                                                        |
| 2026-08-19 | Aislamiento Quant experimental y repetición de G1                                   | Correcta: migración `20260819010000_isolate_experimental_quant_tables.sql`, reset reproducible, 5 suites pgTAP top-level (140 aserciones) y governance (4/4)                                                                                                                                                                 | Quant queda fuera del runtime; el E2E autenticado de Leads sigue bloqueado por un error 500 en `GET /api/crm/leads`                                                                                                                                                                                            |
| 2026-08-19 | E2E HTTP autenticado de Leads                                                       | Correcta tras normalizar vocabulario legacy y timestamps Supabase: lectura 200, cambio de estado 200, conversión 201 y reintento idempotente 200 con la misma Opportunity                                                                                                                                                    | Se corrige `apps/loopdev-os/src/services/crm/leads.ts`; cerrar la evidencia operativa de #84 y continuar con la aprobación técnica de Pipeline                                                                                                                                                                 |
| 2026-08-19 | Pipeline backend (#85): reset, contratos, typecheck y CRM tests                     | Reset local correcto: migraciones hasta `20260904000000_crm_pipeline_contract.sql` y seed aplicados; contratos build, typecheck completo (11/11), tests CRM focalizados (12/12) y governance Supabase correctos. `005_crm_security.sql` ahora cubre políticas/FKs de Pipeline y las 5 suites top-level pasan 148 aserciones. | El runner global sigue incluyendo `helpers/rls_helpers.sql` como suite independiente y termina con parse error de plan; falta E2E HTTP de Opportunities porque el servidor local requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` explícitos                                              |
| 2026-08-19 | Pipeline backend y matriz CI (#85)                                                  | Correcta: PR #121 mergeado en `develop` mediante `f577f045`; 148 aserciones pgTAP, matriz HTTP autenticada owner/viewer, tests CRM focalizados, typecheck, build, CodeQL y CI backend pasan. E2E frontend queda omitido por routing backend-only.                                                                            | G2 backend implementado; permanecen la validación integral de G1, staging/UAT y el cierre explícito del gate                                                                                                                                                                                                   |
| 2026-08-19 | UAT técnico backend de Pipeline                                                     | Correcta: flujo HTTP autenticado owner/viewer verificado para stages, creación, listado, retry idempotente, movimiento, reapertura, actualización, conflicto `409` y autorización `403`; pgTAP confirma RLS, FKs e historial.                                                                                                | UAT visual, drag-and-drop, responsive y accesibilidad frontend quedan pendientes hasta implementar la UI                                                                                                                                                                                                       |
| 2026-08-19 | Tasks backend-first (#87): contratos, schema/RLS, servicio, API, fixtures y pruebas | Correcta en local: `supabase db reset --local`, `006_crm_tasks_contract.sql` (18/18), `@loopdev/contracts` build, typecheck explícito de `loopdev-os`, tests CRM/API focalizados (49/49), governance Supabase y ownership de contratos.                                                                                      | Se implementan Task/Note/TimelineEvent, relaciones Contact/Lead/Opportunity, lifecycle, versionado optimista, idempotencia y timeline transaccional append-only; faltan E2E autenticado, staging/UAT y validación de concurrencia HTTP                                                                         |
| 2026-08-19 | Customer 360 backend-first (#88): contratos, proyección, API y pruebas              | Correcta en local: contratos build/typecheck, typecheck de `loopdev-os`, tests focalizados Customer 360/API (8/8) y `git diff --check`; no se añadió entidad ni migración.                                                                                                                                                   | Se entregan lecturas `record`/`split`/`overview`, paginación por sección, aislamiento tenant/workspace/brand, redacción de Notes, deduplicación `sourceType:sourceId` y comandos contextuales; Supabase governance y suite global conservan fallos preexistentes de Tasks, y staging/E2E/UAT quedan pendientes |
| 2026-09-06 | Daily Operation backend audit corrective work                                       | Correcta en local: reset Supabase, suites top-level 001-006 (176 aserciones), suite 006 aislada (28/28), typecheck de `loopdev-os`, contratos build, 11 suites CRM/API (41/41), governance, links, registries y diff check                                                                                                   | Private note body queda detrás de `crm_notes_visible`; actores autenticados se fuerzan en DB; conversión Lead es transaccional/idempotente; CI y registry incluyen 006 sin ejecutar `helpers/rls_helpers.sql`; `brand_id` no es frontera independiente                                                         |

## Handoff de sesion

- **Fecha:** 2026-08-19.
- **Rama de continuación:** `feature/crm-pilot-pipeline-implementation`.
- **Commit de partida:** `a8dc5a8` (Tasks backend-first ya presente en el worktree).
- **Estado alcanzado:** Leads, Pipeline, Tasks y Customer 360 backend-first implementados con
  contratos, servicios y API. Customer 360 permanece como proyección dentro de Contact, sin entidad ni
  navegación propia, con aislamiento y deduplicación autorizada.
- **Decisiones, bloqueos y riesgos:** G2 y los delivery backend están documentados, pero el cierre
  integral de G1/G2/G3 sigue pendiente; no se presenta staging/UAT como completado. La suite Supabase
  global y governance mantienen fallos ya existentes del contrato Tasks; E2E frontend no aplica a este
  slice backend-only.
- **Validación ejecutada:** contratos Customer 360 build/typecheck, typecheck explícito de
  `loopdev-os`, tests focalizados Customer 360/API (8/8), `git diff --check`; `supabase test db --local`
  ejecutado con el fallo conocido de `006_crm_tasks_contract.sql` y el helper sin plan.
- **Siguiente acción concreta:** completar la remediación/validación de Tasks en Supabase y después
  preparar staging reproducible para la certificación integral de Daily Operation, Customer 360 y UAT.

## Cierre

Pendiente de aprobacion explicita.
