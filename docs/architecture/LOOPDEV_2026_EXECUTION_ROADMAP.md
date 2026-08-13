---
title: Roadmap de Ejecucion 2026 de LoopDev
status: proposed
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: platform
approver: pending
approved_at: null
next_review: before-g0-execution
source_documents:
  - docs/architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md
  - docs/architecture/LOOPDEV_PILOT.md
---

# Roadmap de Ejecucion 2026 de LoopDev

## 1. Proposito y autoridad

Este es el unico roadmap para el desarrollo de LoopDev durante 2026. Concilia la arquitectura de producto objetivo con la evaluacion externa del CTO sobre el piloto CRM de Estar Protegidos.

Gobierna el orden del portfolio, los gates de entrada y salida, los riesgos prioritarios y la evidencia minima para iniciar la siguiente fase. No sustituye codigo desplegado, migraciones aplicadas, ADR aprobados, contratos publicos ni evidencia de los tracks de entrega. Ante una contradiccion se aplica este orden:

1. Codigo desplegado, migraciones aplicadas y configuracion de infraestructura en ejecucion.
2. ADR aprobados y contratos publicos.
3. Este roadmap despues de su aprobacion.
4. Tracks de programa y entrega.
5. Skills y guias de procedimiento.

El roadmap de arquitectura fuente conserva la referencia del estado objetivo. La evaluacion del piloto conserva el registro de auditoria y la base de evidencia del primer release train. Ningun documento fuente se reescribe de forma silenciosa; los siguientes tracks y ADR deben enlazar a este roadmap.

## 2. Decision ejecutiva

LoopDev avanza con un GO condicional para un piloto CRM controlado de Estar Protegidos. No avanza con el alcance completo del CRM comercial hasta que todos los gates del piloto tengan evidencia.

- CRM es la primera suite; Marketing Studio es la segunda.
- Estar Protegidos es el design partner, no la definicion de CRM Core.
- El baseline tecnico es un monolito modular con Next.js, Supabase, contratos compartidos, RLS y una base de datos multi-tenant compartida.
- La convergencia frontend es incremental y por slices; no se autoriza una migracion FSD global.
- Insurance es un vertical pack. Los datos sensibles de seguros y salud no entran en CRM Core.
- Quant, Health, mobile, billing, IA y refactors amplios de shell o Design System permanecen fuera del camino critico del piloto.

La unidad de planificacion cambia de fases amplias de plataforma a un resultado observable: un agente autorizado puede gestionar un flujo CRM real con datos persistentes, aislamiento entre tenants, trazabilidad y un release reversible.

## 3. Secuencia de producto

| Fase | Resultado de producto | Gate de entrada | Evidencia de salida |
| --- | --- | --- | --- |
| Release train del piloto | Estar Protegidos valida el flujo CRM core en un anillo protegido de usuarios nominales | G0 aprobado | G5 aprobado, o el entorno permanece como UAT privado |
| H2: MVP comercial de CRM | Un segundo tenant CRM puede hacer onboarding y usar un producto de pago operable | Evidencia del piloto, decision fiscal y demanda comercial | Segundo tenant, reconciliacion de entitlements, ruta de pago controlada y soporte operativo |
| H3: MVP de Marketing Studio | Dos organizaciones operan un flujo de marca, campanas y atribucion | H2 completado y atribucion CRM estable | Flujo de campana aprobado, sin publicacion no autorizada ni mezcla de datos |
| H4: Apalancamiento de plataforma | Las capacidades compartidas aceleran al menos dos suites | Dos consumidores reales por capacidad promovida | Reutilizacion auditable, coste atribuible por tenant, aprobaciones, rollback y ownership |
| H5: Expansion de suites guiada por demanda | Finance, Operations, Service, Projects o People amplia el portfolio | H4 mas design partner y compromiso comercial | Primer vertical slice vendible de la suite aprobada |

Health y Quant permanecen en mantenimiento. Mobile conserva su fundacion y no necesita alcanzar paridad funcional antes de H2. Ninguna fase empieza porque haya pasado el tiempo: su evidencia de entrada debe adjuntarse al program track que le corresponde.

## 4. Release train del piloto: G0-G5

El piloto es la primera fase de ejecucion de este roadmap. Sustituye la secuencia generica H0/H1 por un release train fechado y consciente de la capacidad. La ventana objetivo va del 2026-08-13 al 2026-09-11, con contingencia hasta el 2026-09-13.

### 4.1 Resultado del piloto

Un agente autorizado de Estar Protegidos puede iniciar sesion, buscar o crear un contacto, captar o actualizar un lead, mover persistentemente una oportunidad por el pipeline, registrar notas y tareas, completar una tarea y revisar la historia minima de un cliente. El mismo flujo sobrevive a la recarga y al cambio de dispositivo. Un viewer no puede mutarlo y un segundo tenant no puede leerlo, mutarlo ni referenciarlo.

### 4.2 Alcance incluido

- Aprovisionamiento manual de usuarios, scope real de organizacion/workspace/marca y permisos reales.
- Contactos y leads: listar, buscar, crear, editar y ver detalle; captura de lead incluida.
- Oportunidades y transiciones persistentes de etapa.
- Notas, actividades, tareas, finalizacion y timeline minima y tipada de Customer 360.
- Dashboard solo con agregados reales; una importacion validada con dry-run y reporte de rechazos.
- Exportacion administrativa cuando sea necesaria para la reversibilidad.
- Auditoria de mutaciones, errores trazables, soporte, desktop/tablet responsive, teclado y estados loading, empty, error y forbidden.
- Entitlement de organizacion y kill switch del lado servidor.

### 4.3 Exclusiones explicitas

- Billing, suscripciones, checkout, portal y autoservicio.
- Paridad CRM movil nativa.
- AI Insights, scoring aleatorio, recomendaciones, agentes, RAG o mutacion automatizada.
- OCR, extraccion documental, elegibilidad de seguros automatizada o cotizaciones.
- Email, WhatsApp saliente, plantillas, media, campanas y analitica avanzada.
- Refactors globales de shell, FSD o Design System.
- Nuevo trabajo de Marketing, Quant, Health o futuras suites.

WhatsApp entrante en modo solo lectura es un stretch goal unicamente despues de G3 y nunca desplaza un gate P0.

### 4.4 Gates e hitos

| Gate | Objetivo | Entregables obligatorios | Decision |
| --- | --- | --- | --- |
| G0 | Ago 13-14 | Alcance firmado, Product Owner/Tech Lead/release owner nombrados, capacidad efectiva, UAT, campos reales y dataset sintetico acordados | Empezar o reducir alcance |
| G1 | Ago 17-21 | RLS CRM por verbo, FKs tenant-aware, kill switches, audit append-only, seed/types/reset, pgTAP, gate CI requerido y slice persistente de contacto | Seguridad y primera verdad persistente |
| G2 | Ago 24-28 | Captura de lead transaccional/idempotente, detalle/edicion de lead, etapa de oportunidad persistente, estado de queries real y cobertura route/integracion/E2E | Contacto -> lead -> etapa sobrevive recarga y separacion de tenants |
| G3 | Ago 31-Sep 4 | Notas/tareas/timeline, Customer 360 minimo, dashboard real u oculto, import dry-run, staging, health, logs, Sentry y primer UAT | Flujo diario del agente y despliegue reproducible |
| G4 | Sep 7-9 | Remediacion UAT P0/P1, auth/secrets/rate limits, accesibilidad, rendimiento, restore drill, runbooks y formacion | Preparacion del release |
| G5 | Sep 10-11 | Produccion aislada, usuarios nominales, carga inicial doblemente validada, smoke checks, monitoreo y plan de hypercare | Go-live o continuar como UAT privado |

Si G1 no se cumple, el entorno permanece como UAT privado. Si en G5 sigue abierta una condicion absoluta de no-go de la seccion 6, no se activa ningun anillo de produccion con datos reales.

### 4.5 Regla de capacidad

El piloto completo requiere dos carriles efectivos: producto/full-stack CRM y datos/plataforma/calidad, ademas de decisiones diarias de producto y QA/UAT parcial. Con una sola persona ingeniera, el alcance se reduce inmediatamente a contactos, leads, pipeline y notas/tareas basicas. Customer 360 agregado, dashboard, importacion self-service y WhatsApp se eliminan antes de reducir seguridad, autorizacion, persistencia o gates de release.

## 5. Secuencia de trabajo y WIP

Solo tres tracks activos pueden soportar el camino critico al mismo tiempo:

1. Entrega de producto del piloto CRM.
2. Trabajo habilitador de datos, seguridad y tenancy.
3. Trabajo habilitador de calidad de release y operaciones.

Cada item de entrega debe caber en uno o dos dias y exponer un vertical slice usable. El trabajo P1 y los stretch goals nunca desplazan trabajo P0. Marketing, Quant, mobile, billing, IA y governance no critico permanecen congelados hasta G5.

El orden inicial de ejecucion es:

1. SEC-01 a SEC-04 y DB-01 a DB-02: RLS, integridad de tenant, kill switches, auditoria, evidencia de base de datos, reset reproducible, seed y tipos generados.
2. CI-01 a CI-03 y OPS-01 a OPS-03: gate de release no omitible, checks web reales, E2E criticos con auth real, entornos reproducibles, observabilidad, restore y rollback.
3. CRM-01 a CRM-04 y UX-01: sustituir fixtures y claims falsos por flujos reales de contacto, lead, pipeline, tarea, nota y timeline.
4. CRM-05, CRM-06, UX-02 y GOV-01 solo despues de que el camino P0 este en verde.

## 6. Condiciones absolutas de no-go

El piloto no puede describirse como produccion controlada, ni pueden cargarse datos reales de clientes, cuando se cumpla cualquiera de estas condiciones:

- El replay de base de datos, lint, pgTAP o los tipos generados no estan en verde.
- Un viewer puede mutar o borrar datos CRM, o se acepta una relacion cross-tenant.
- Desactivar una membership, organizacion o workspace no revoca el acceso.
- Un flujo de usuario usa `service_role`, fixtures, estado local autoritativo o una capacidad simulada.
- Produccion no tiene proyecto, secrets, dominio, health checks, error tracking, alertas, owner de soporte, rollback y restore drill exitoso separados.
- Los cinco journeys E2E criticos con auth real no pasan en staging.
- Permanece un defecto P0/P1 en auth, tenancy, integridad o perdida de datos, o en el camino critico.
- Falta la aprobacion de UAT.
- La captura publica o los webhooks carecen de validacion de firma, idempotencia o rate limits.
- Se procesan datos sensibles de salud sin aprobacion documentada de privacidad, proposito, retencion y acceso.

## 7. Riesgos prioritarios y controles obligatorios

| Prioridad | Riesgo | Senal actual | Control obligatorio y owner |
| --- | --- | --- | --- |
| P0 | El RLS de CRM permite acciones destructivas a usuarios de solo lectura | Una policy `FOR ALL` puede permitir delete bajo `crm.read` | Policies separadas por verbo; matriz pgTAP de roles; owner Data |
| P0 | Pueden persistir referencias cross-tenant | Algunos enlaces de tenant no tienen constraints compuestos tenant-aware | Constraints unique/FK compuestos y pruebas negativas; owner Data |
| P0 | Los kill switches no revocan todo el acceso | Los helpers no verifican consistentemente el estado activo de organizacion/workspace | Aplicar membership/org/workspace activos en UI, BFF y DB; owner Data/Backend |
| P0 | La UI CRM tiene una segunda fuente de verdad | Fixtures, estado local y score IA aleatorio siguen siendo autoritativos | Sustituir slice por slice con APIs reales y retirar claims simulados; owner CRM |
| P0 | Los journeys CRM estan incompletos o no son atomicos | CRUD/transiciones incompletos y captura multi-paso puede dejar datos huerfanos | Casos de uso BFF tipados, transacciones, idempotencia y pruebas de integracion; owner CRM/Backend |
| P0 | CI puede producir falsos verdes | Checks estaticos, unitarios, de tipos y build pueden omitirse ante cambios web | Gate agregado requerido y typecheck web real; owner Platform |
| P0 | El release no es recuperable ni observable | No hay topologia versionada de despliegue, restore drill ni runbooks | Render Blueprint, entornos separados, health, Sentry, alertas, rollback y evidencia de restore; owner Platform |
| P0 | CRM carece de evidencia de seguridad y comportamiento | No hay matriz CRM pgTAP ni E2E suficientes con auth real | pgTAP de dos tenants/roles y cinco journeys E2E criticos con auth real; owner QA/Data |
| P0 | Datos sensibles de seguros/salud contaminan CRM Core | El modelo local de lead incluye campos relacionados con salud | Mantenerlos fuera del piloto o aislarlos en Insurance Pack tras aprobacion de privacidad; owner Product/DPO/CRM |
| P1 | El modal critico es inaccesible | Faltan semantica de dialogo, control de foco y comportamiento de teclado | Usar un primitive de dialogo accesible y certificar el flujo critico; owner Frontend |
| P1 | Capacidad y alcance exceden el calendario | El plan completo requiere 37-49 engineer-days | Dos carriles o reduccion inmediata de alcance; owner Tech Lead/Product Owner |
| P1 | Dependencias externas retrasan UAT | Datos, roles o criterios de aceptacion del cliente pueden llegar tarde | Datos sinteticos, UAT calendarizado y reduccion de alcance en vez de asumir; owner Product Owner |
| P1 | El scope creep introduce capacidades inseguras | Tickets de Insurance, WhatsApp, IA o billing entran al piloto | Trade-off escrito que retire alcance equivalente; owner Release |
| P1 | El toolchain no es reproducible | Instalaciones y tests locales fallan por dependencias/bootstrap | Fijar y verificar bootstrap, cache y ruta CI determinista; owner Platform |

## 8. Arquitectura objetivo y decisiones diferidas

Las siguientes decisiones estan activas para 2026:

- Usar el monolito modular antes que microservicios. Separar un worker solo cuando lo requiera un caso de uso asincrono durable.
- Mantener Supabase Auth, PostgreSQL, RLS, Storage y una base multi-tenant compartida; endurecerlos antes de anadir infraestructura.
- Usar contratos como frontera publica de request/response y entre modulos. Los Route Handlers validan input, sesion, tenant/workspace, permiso, output y trazabilidad.
- Adoptar TanStack Query para el estado de servidor CRM segun se implementen slices reales. Context se limita a estado efimero de UI.
- Mantener CRM Core generico; Insurance Pack es owner de cobertura, elegibilidad, roles de asegurado y datos regulados.
- Tratar Communications, Documents, IA, Catalog, Workflow, Integrations y Analytics como capacidades cross-suite, no como estados finales propiedad de CRM.

Las siguientes decisiones quedan diferidas hasta cumplir su trigger:

| Decision | Trigger |
| --- | --- |
| Billing y autoservicio Stripe | Entrada H2: segundo cliente o necesidad comercial de autoservicio, con decision de mercado fiscal |
| WhatsApp saliente | Flujo core verde mas consentimiento, credenciales por cuenta, worker, retry/DLQ y auditoria |
| Caso de uso IA | Caso de valor definido, aprobacion de privacidad, dataset/evals versionados, presupuesto y kill switch |
| OCR/extraccion documental | Existan intake documental seguro y flujo de revision humana |
| Expansion de worker y queue | Carga asincrona durable con requisitos explicitos de retry/recovery |
| Enforcement FSD global | Al menos dos equipos o friccion medible de boundaries lo justifiquen |
| Microservicios | Necesidad demostrada de escala, ownership, disponibilidad o despliegue independiente |
| Expansion de CRM mobile, Health o Quant | Gate comercial o regulatorio explicito |

## 9. Roadmap H2-H5

### H2: MVP comercial de CRM

Abrir solo tras la evidencia de salida del piloto y una decision de mercado/fiscal. Entregar onboarding, entitlements basicos, comunicaciones controladas, Product Catalog, Insurance Quoting, intake documental seguro y revision manual, billing mediante un adaptador Stripe-first neutral al proveedor y operaciones de produccion sostenibles. La IA se limita a casos revisados y de solo lectura que cumplan su gate de activacion.

La salida requiere un segundo tenant sin fork, entitlements server-side, una ruta de pago controlada, evidencia de restore e incidentes, y flujos comerciales y de comunicaciones respaldados por audit.

### H3: MVP de Marketing Studio

Abrir solo cuando la atribucion CRM sea estable. Entregar Brand Hub, DAM persistente, revision de contenido, orquestacion de campanas, atribucion UTM, integraciones de publicacion controladas y metricas basicas verificables. La IA asiste contenido solo con contexto de marca, aprobacion humana y sin publicacion ni gasto autonomo.

### H4: Apalancamiento de plataforma

Promover Documents, Workflow, Integration Hub, Search/Knowledge, gobierno de IA, Analytics, Notifications y Files solo despues de que cada uno tenga dos consumidores reales. Cada promocion debe demostrar autorizacion, trazabilidad, rollback, ownership y coste operativo atribuible al tenant.

### H5: Expansion del portfolio guiada por demanda

Elegir la siguiente suite en este orden solo cuando la evidencia lo sustente: Finance, Operations/ERP, Customer Service, Projects/Professional Services y despues People/HR. Cada propuesta requiere design partner, compromiso comercial, owner, bounded contexts, dependencias y un primer vertical slice vendible. Health requiere aprobacion regulatoria antes de reactivarse.

## 10. Evidencia, metricas y governance

La metrica north-star es el numero de organizaciones activas que completan semanalmente un workflow de valor end-to-end. Para el piloto, la evidencia importa mas que los story points, el estado del documento o el numero de archivos de test.

Metricas obligatorias del piloto:

- Al menos 90 % de usuarios invitados completa el login y al menos 70 % esta activo semanalmente durante UAT.
- Al menos 90 % de intentos UAT del camino critico se completa sin ayuda.
- El 100 % de cambios de etapa del lead sobrevive a la recarga; las mutaciones fallidas sin explicacion son cero.
- Los incidentes cross-tenant, de perdida de datos y defectos P0 escapados son cero.
- La tasa de flakiness de E2E criticos se mantiene por debajo de 2 %.
- Cada 5xx tiene SHA de release y trace ID; cada alerta accionable tiene owner.

Reglas de gobernanza:

- Este roadmap pasa a `approved` solo con aprobador nombrado, fecha de aprobacion y fecha de revision.
- Los cambios duraderos de direccion arquitectonica requieren un ADR; los que alteren secuencia o alcance requieren una decision aprobada en el program track.
- Los delivery tracks contienen alcance ejecutable y evidencia; no duplican este roadmap.
- El roadmap se revisa en G0, G3, G5, entrada H2 y despues trimestralmente.
- El estado del programa se genera a partir de evidencia. Ningun track o documento autocertifica un gate.

## 11. Registro de aprobacion

| Version | Fecha | Estado | Aprobador | Alcance |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-08-13 | proposed | Pendiente | Roadmap 2026 consolidado y release train del piloto CRM |

La aprobacion autoriza la creacion y reconciliacion de los tres tracks del camino critico. No autoriza reescrituras destructivas de migraciones, procesamiento de datos sensibles ni activacion de capacidades diferidas.