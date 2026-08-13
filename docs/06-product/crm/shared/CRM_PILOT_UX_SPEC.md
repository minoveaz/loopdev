---
title: CRM Pilot UX Specification
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
github_issue: https://github.com/minoveaz/loopdev/issues/63
approver: User
approved_at: 2026-08-13
---

# Especificacion UX/UI del Piloto CRM

## 1. Proposito

Este documento es el entregable de UX-00. Define las rutas, vistas, permisos, estados y journeys del piloto CRM de Estar Protegidos. Gobierna los slices del piloto hasta una enmienda aprobada; no sustituye contratos, RLS, validacion, observabilidad ni evidencia de implementacion.

## 2. Usuario y plataformas

El agente comercial captura, consulta y sigue oportunidades. El manager supervisa al equipo. El admin de Estar Protegidos configura etapas del pipeline y la visibilidad u obligatoriedad de campos existentes.

El UAT funcional se certifica en escritorio y tablet. Mobile web exige responsive basico sin overflow ni perdida de acciones criticas, pero no paridad funcional ni certificacion completa.

## 3. Roles y permisos UX

| Rol | Acciones |
| --- | --- |
| Agente comercial | Crear, buscar y editar contactos/leads; crear y completar tareas; crear notas; crear y mover oportunidades; revisar merges permitidos |
| Manager | Todo lo del agente, reasignar, consultar equipo y revisar merges |
| Admin Estar Protegidos | Todo lo del manager; administrar etapas; mostrar, ocultar y marcar como obligatorios campos existentes; administrar usuarios y permisos de su organizacion |
| Superdev LoopDev | Soporte transversal separado de roles tenant; exige proposito, actor, audit y controles privilegiados |

No existe `viewer`. La UI solo presenta acciones que el permiso server-side y RLS pueden autorizar.

## 4. Navegacion y vistas

| Seccion | Ruta base | Vistas minimas |
| --- | --- | --- |
| Contactos | `/sales-crm/contacts` | Lista/busqueda/filtros, crear, detalle Customer 360, editar y posible duplicado |
| Leads | `/sales-crm/leads` | Lista, crear/capturar, detalle y editar |
| Pipeline | `/sales-crm/pipeline` | Tablero, detalle de oportunidad y cambio de etapa |
| Tareas | `/sales-crm/tasks` | Bandeja personal, crear, filtrar, reasignar autorizada y completar |

Customer 360 vive en `/sales-crm/contacts/:contactId`; no es una seccion independiente. Muestra perfil, leads, oportunidades, notas, tareas y timeline. Una tarea asociada a contacto, lead u oportunidad aparece una sola vez dentro de Customer 360.

Quedan ocultos: AI Insights, scoring, cotizaciones, documentos, seguros, inbox/comunicaciones simuladas, campanas, automatizaciones y dashboard sin agregados reales.

## 5. Pipeline y tareas

El admin puede anadir, quitar y ordenar etapas. No puede eliminar una etapa que tenga oportunidades sin una reasignacion explicita. Agente y manager pueden mover oportunidades entre etapas autorizadas.

Las notas son internas. Las tareas tienen prioridad y fecha limite, pueden asociarse a contacto, lead u oportunidad y se completan desde Tareas o Customer 360.

## 6. Contactos y datos personales

### Obligatorios al crear

- Nombre y primer apellido.
- Al menos telefono movil o email.
- Origen, marca y asignado a.

### Campos existentes configurables

El admin solo puede mostrar, ocultar y marcar como obligatorios campos existentes; no crea campos personalizados.

- Segundo apellido, nombre preferido, telefono/email secundario.
- DNI/NIE/pasaporte, fecha de nacimiento, genero y estado civil.
- Direccion, pais, provincia, ciudad y codigo postal.
- Empresa, cargo, idioma, canal preferido, franja horaria, etiquetas y notas internas iniciales.

DNI/NIE/pasaporte, fecha de nacimiento, genero y estado civil son opcionales en Contactos. DNI/NIE/pasaporte se exige solo al iniciar cotizacion o solicitud de poliza, fuera del piloto. Son PII confidencial: no se registra en logs o analytics y requiere permisos, proposito, retencion y auditoria segun el program track.

El sistema conserva organizacion, workspace, marca de origen, actor, fechas, datos normalizados, origen/atribucion y estado de posible duplicado como datos no editables directamente.

## 7. Deduplciacion y merge

1. Coincidencia exacta de telefono E.164 o email normalizado en la organizacion: reutilizar contacto.
2. Nombre e identificador parcial, o telefono diferente y nombre parecido: crear contacto, informar al agente y abrir revision humana; nunca bloquear la operacion ni fusionar automaticamente.
3. Agente autorizado o manager aprueba merge o descarta el aviso.
4. El merge conserva leads, oportunidades, tareas, notas, identificadores originales y auditoria de la decision.

## 8. Leads y atribucion futura

Un lead siempre pertenece a un contacto. Campos minimos: contacto, origen manual/campana/WhatsApp, marca y workspace cuando correspondan, asignado a, interes en texto libre, campana/UTM, provider/identificador externo y nota inicial.

Marketing y WhatsApp permanecen desactivados. El contrato conserva provider, identificador externo, campana/UTM, marca y workspace para activar adaptadores en H2 sin rehacer el modelo ni duplicar contactos.

## 9. Estados y accesibilidad

Cada vista define `loading`, `empty`, `error`, `forbidden` y `success`. `error` permite reintento seguro y muestra `traceId` cuando exista; `forbidden` no revela datos de otro tenant. Los dialogos criticos tienen teclado, foco visible, restauracion de foco, Escape y nombres accesibles.

## 10. Journeys UAT

### A. Captacion y pipeline

1. Buscar persona; crear contacto si no existe.
2. Ante posible duplicado, crear contacto y revisar aviso.
3. Crear lead con origen y atribucion.
4. Crear oportunidad y moverla por una etapa configurada.
5. Recargar y comprobar persistencia.

### B. Seguimiento y Customer 360

1. Abrir detalle de contacto.
2. Crear nota y tarea vinculada a contacto, lead u oportunidad.
3. Completar tarea.
4. Confirmar que nota, tarea y resultado aparecen una sola vez en Customer 360.

## 11. Aprobacion UX-00

UX-00 fue aprobado el 2026-08-13 por User. Las vistas cubren ambos journeys, las acciones coinciden con permisos, campos/PII/deduplicacion tienen reglas explicitas y las capacidades excluidas no aparecen como funcionales.