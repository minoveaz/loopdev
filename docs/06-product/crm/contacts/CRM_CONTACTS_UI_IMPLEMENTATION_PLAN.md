---
title: CRM Contacts UI Implementation Plan
status: proposed-for-approval
version: 1.0
created: 2026-08-20
updated: 2026-08-20
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
related_issue: https://github.com/minoveaz/loopdev/issues/82
backend_handoff: CRM_CONTACT_IMPLEMENTATION_HANDOFF.md
component_audit: CRM_CONTACTS_COMPONENT_AUDIT.md
contract: CRM_CONTACT_CONTRACT.md
post_pilot_backlog: ../shared/CRM_POST_PILOT_BACKLOG.md
---

# Plan de implementacion UI: Contactos CRM

## 1. Proposito y alcance

Este documento convierte la propuesta visual de Contactos en un contrato de implementacion para la
primera entrega frontend. Debe aprobarse antes de construir la pantalla y mantenerse alineado con el
contrato de Contact, el backend certificado y el `SuiteRuntime` existente.

La primera entrega cubre la lista de Contactos en `SuiteCanvas mode="data"`:

- explorar y buscar contactos autorizados;
- aplicar filtros soportados por el backend;
- seleccionar registros en la pagina actual;
- abrir el detalle cuando exista la ruta autorizada;
- iniciar el flujo de creacion si el usuario tiene `crm.manage`;
- representar loading, empty, error, forbidden y success sin fixtures de produccion.

Quedan fuera de esta entrega: Customer 360 completo, merge humano, exportacion real, acciones de
comunicacion, bulk edit y campos que el backend aun no expone. Estas capacidades no se pierden: se
registran en [CRM Post-Pilot Backlog](../shared/CRM_POST_PILOT_BACKLOG.md) con prioridad y condiciones
de entrada para una fase posterior.

## 2. Decisiones de arquitectura

| Decision         | Aprobacion propuesta                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| Ruta             | `/sales-crm/contacts`, no `/crm/contacts`; la primera pertenece al shell actual |
| Canvas           | `SuiteCanvas mode="data"`                                                       |
| Receta           | `DataWorkspace` con overlay responsive `TechnicalDialog`/`BottomSheet`         |
| Shell            | `PlatformHeader`, `SuiteSidebar` y `SuiteCanvas` permanecen platform-owned      |
| Ownership CRM    | `ModuleHeader`, `ModuleToolbar`, búsqueda, tabla, view model y acciones         |
| Estado server    | Consumir `GET /api/crm/contacts`; no leer Supabase desde el navegador           |
| Paginacion       | Cursor del contrato (`nextCursor`/`hasMore`), no paginacion numerica simulada   |
| Seleccion        | Seleccion por pagina; no ejecutar acciones masivas hasta tener capability y API |
| Responsive       | Tabla desktop/tablet y transformacion semantica a lista compacta en mobile      |
| Fuente de verdad | Contratos y respuesta API; la imagen es referencia visual, no contrato de datos |

## 3. Anatomia aprobada de la pantalla

```text
SalesCrmShell
  -> SuiteRuntime
    -> SuiteCanvas mode="data"
      -> ContactsPage
        -> ModuleHeader
          -> Contact module title + supported count state
          -> Segment tabs (solo segmentos implementados)
          -> CreateContactButton (crm.manage)
        -> ModuleToolbar
          -> ModuleSearch (query URL q, debounce 300 ms)
          -> ContactFilters (fase posterior; requiere query contract)
          -> ColumnVisibilityButton (fase posterior)
          -> BulkActions (fase posterior; capability + API required)
        -> ContactTable
          -> ContactRow / ContactIdentityCell
          -> row actions (solo acciones con endpoint)
        -> ContactPagination
          -> current cursor state
          -> next/previous navigation only when contract supports it
```

### Ownership por zona

| Zona             | Responsable | Debe hacer                                                       | No debe hacer                                       |
| ---------------- | ----------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| `PlatformHeader` | Plataforma  | identidad, tenant, ayuda, perfil y comandos globales             | crear contactos, filtrar CRM o exportar             |
| `SuiteSidebar`   | Plataforma  | navegación y módulo activo                                       | conocer columnas o permisos CRM                     |
| `SuiteCanvas`    | Plataforma  | geometría y viewport del modo `data`                             | consultar contactos o decidir estados de negocio    |
| `ModuleHeader`   | CRM         | título, estado de conteo disponible, segmentos y acción primaria | inventar total absoluto si API no lo entrega        |
| `ModuleToolbar`  | CRM         | búsqueda, filtros y acciones contextuales                        | duplicar la responsabilidad de scroll del Canvas    |
| `ContactTable`   | CRM         | renderizar filas tipadas, selección y ordenación compatible      | mutar datos directamente o consultar tablas         |
| Estado de datos  | CRM/shared  | loading, empty, error, forbidden y success                       | ocultar errores de autorización o mostrar PII ajena |

El scroll vertical primario pertenece al área de datos. La tabla puede tener overflow horizontal
controlado en desktop/tablet; no se debe crear un segundo scroll vertical para el Canvas.

## 4. Componentes a reutilizar

### Plataforma y layout

- `SuiteRuntime` y `SuiteCanvas` desde `@loopdev/ui`.
- `ModuleHeader` para la cabecera local y sus slots.
- `ModuleToolbar` para distribuir búsqueda, filtros y acciones.
- `ModuleSearch` para búsqueda contextual.
- `FilterBar` y `FilterDropdown` para filtros autorizados.
- `ResponsiveTable` para tabla, selección, estados, ordenación y transformación mobile.
- `Button`, `IconButton`, `Input`, `Select` y `Checkbox`.
- `EmptyState` para estados sin datos y sin resultados.
- Primitivas existentes de loading/error/forbidden cuando cubran el contrato.
- `TechnicalDialog` para el overlay desktop, con Radix Dialog para foco, `Escape`, backdrop y
  scroll interno.
- `ToastItem`, `ToastViewport` y `toast.show` para feedback de éxito y error; el toast requiere el
  `tenantId` activo y no debe duplicar errores inline del formulario.
- `Input`, `Button`, `Heading` y `Divider` para la superficie del formulario.

### Componentes CRM que deben desarrollarse

- `ContactListWidget` o equivalente de widget para orquestar query, estados y selección.
- `ContactIdentityCell` para nombre, email e iniciales, con PII renderizada según contrato.
- `ContactCompanyCell` solo cuando el read model incluya compañía y rol.
- `ContactStatusCell` solo cuando exista un estado CRM autorizado en el read model.
- `ContactOwnerCell` solo cuando exista asignación autorizada.
- `ContactRowActions` únicamente para acciones con API y capability definida.
- `ContactFilters` como adaptador de filtros de dominio a `FilterBar`.
- `ContactForm` y `ContactFormDialog` como componentes CRM-owned de UI-2.
- `ContactDetailPanel` y Customer 360 en la siguiente superficie `workspace/split`.

No se debe promover ningún componente CRM a `@loopdev/ui` sin un segundo consumidor real y un
contrato agnóstico.

### Decisión de overlay y formularios para UI-2

La ambigüedad entre dialog, drawer y sheet queda resuelta para esta entrega:

```text
ContactFormDialog
  -> TechnicalDialog centrado en desktop/tablet (>= 768px)
  -> BottomSheet CRM-owned en mobile (< 768px)
```

`TechnicalDialog` ya existe en `@loopdev/ui` y usa `@radix-ui/react-dialog`; por tanto, no se
creará otro modal global ni se duplicarán el focus trap, el cierre con `Escape`, el backdrop o el
scroll interno. En cambio, el repositorio no expone actualmente un primitive global `BottomSheet`,
`Sheet` o `Drawer` para formularios. UI-2 debe implementar la transmutación mobile dentro de
`ContactFormDialog`, manteniendo el mismo estado y contrato de accesibilidad. Si el patrón obtiene
un segundo consumidor real, se extraerá después un primitive global a `@loopdev/ui` mediante una
decisión separada.

### Decisión de arquitectura global para formularios

LoopDev tendrá una infraestructura común de formularios, pero el formulario no estará acoplado a
`TechnicalDialog`. La separación aprobada es:

```text
@loopdev/ui
  -> Form primitives: Form, FormField, FormSection, FormActions, FieldError
  -> Field controls: Input, Select, Textarea, Checkbox, Switch...
  -> Overlay primitives: TechnicalDialog y futuro BottomSheet

features de dominio
  -> schema y modelo del dominio
  -> ContactForm / ContactFormDialog
  -> adapter, permisos, mutaciones y estados de negocio
```

Reglas globales:

- `Form` y sus campos estandarizan labels, ids, `aria-describedby`, `aria-invalid`, errores,
  required, estados disabled/loading y layout responsive.
- `TechnicalDialog` estandariza el contenedor overlay, no los campos ni el submit.
- Un mismo formulario debe poder montarse en una página, workspace, `TechnicalDialog` o
  `BottomSheet` sin cambiar su validación ni su contrato de datos.
- Las reglas de negocio, schemas Zod, mensajes específicos y llamadas API permanecen fuera de
  `@loopdev/ui`.
- No se promoverán componentes CRM como primitives globales; sí patrones agnósticos con al menos
  dos consumidores o una necesidad transversal explícita.

### Política global de presentación de formularios

LoopDev usará una política única de presentación para evitar que cada suite elija entre dialog,
drawer o página de forma arbitraria:

| Tipo de flujo | Presentación estándar | Regla |
| ------------- | --------------------- | ----- |
| Crear/editar registro corto, hasta aproximadamente 6-8 campos | `TechnicalDialog` en desktop/tablet y `BottomSheet` en mobile | Mantiene el contexto de la lista y usa una sola experiencia responsive |
| Formulario largo, wizard, muchos campos o relaciones | Página o `SuiteCanvas mode="workspace"` | Tiene navegación, secciones, guardado progresivo y más espacio vertical |
| Detalle contextual, filtros avanzados o inspección no transaccional | Drawer/panel contextual | No se usa como sustituto del formulario estándar |
| Confirmación simple o alerta | `TechnicalDialog` compacto | No se convierte en un formulario ni en un drawer |

La decisión para UI-2 Contacts queda fijada como **formulario corto transaccional**:

```text
Desktop/tablet -> TechnicalDialog centrado
Mobile         -> BottomSheet inferior como transmutación responsive del mismo overlay
```

El `BottomSheet` no representa una segunda decisión de diseño ni una implementación de dominio
alternativa. Será la presentación mobile del primitive de formulario modal. Los formularios de
Marketing, CRM, Trading y el resto de suites deben seguir la misma política y no crear drawers
locales para crear o editar entidades salvo que exista una excepción aprobada por plataforma.

Una excepción debe justificar explícitamente el cambio de presentación por longitud, navegación,
guardado progresivo o necesidad de mantener contexto persistente. La existencia de una suite
distinta, una preferencia visual local o la reutilización accidental de un componente antiguo no
son razones suficientes.

La implementación global se hará en dos niveles:

1. **Primera entrega de plataforma:** crear primitives agnósticos de campos y layout en `@loopdev/ui`
  y cubrir accesibilidad con tests. Esta base ya está implementada como `Form`, `FormField`,
  `FormActions` y `SubmitButton`, con integración controlada mediante `FormProvider`.
2. **Motor de estado/validación:** `react-hook-form`, `@hookform/resolvers` y Zod ya están instalados
  en `@loopdev/ui`. La integración de cada dominio debe añadir schemas, resolver y reglas de negocio
  sin duplicar los primitives visuales.

No hay actualmente `react-hook-form`, Formik, Final Form ni `@hookform/resolvers` instalados. Zod ya
existe en contratos y aplicaciones, pero valida datos; no sustituye por sí solo los primitives de
presentación ni el motor de estado. UI-2 debe ser el primer consumidor de la infraestructura de
campos global, no crear estilos y accesibilidad de inputs de forma local.

## 5. Matriz de datos y dependencias

| Elemento visual                            | ¿Existe en API actual? | Fuente requerida                     | Decision                                              |
| ------------------------------------------ | ---------------------- | ------------------------------------ | ----------------------------------------------------- |
| ID, nombre                                 | Sí                     | `CrmContact`                         | Implementar                                           |
| Email, teléfono                            | Sí                     | `CrmContact`                         | Implementar, respetando PII                           |
| Empresa                                    | Parcial                | `companyName` básico                 | Mostrar solo si el contrato frontend lo confirma      |
| Rol/puesto                                 | No                     | ampliar read model                   | No incluir en v1                                      |
| Lifecycle stage                            | No                     | relación/atributo CRM                | No incluir en v1; no confundir con Lead status        |
| Propietario                                | No                     | `assignedUserId` + lookup autorizado | No incluir hasta completar contrato                   |
| Última interacción                         | No                     | Customer 360/activity projection     | No incluir en v1                                      |
| Total absoluto                             | No                     | count contract/API                   | Mostrar solo `items.length` o estado de página        |
| Cursor siguiente                           | Sí                     | `nextCursor`, `hasMore`              | Implementar                                           |
| Cursor anterior                            | No directo             | historial local de cursores          | Implementar como navegación local, no página numérica |
| Ordenación server-side                     | No                     | ampliar query contract               | No prometer cabeceras ordenables en v1                |
| Exportación                                | No endpoint/capability | `contacts.export` + API              | Fuera de v1                                           |
| Bulk edit/delete                           | No API/capability      | comandos y permisos                  | Fuera de v1                                           |
| Segmentos Todos/Míos/Sin asignar/Recientes | No query completa      | filtros y campos faltantes           | No mostrar como tabs funcionales aún                  |

La pantalla no debe renderizar columnas vacías para aparentar cobertura funcional. Una columna solo se
incluye cuando existe read model, autorización y comportamiento de estado definido.

## 6. Contrato de query inicial

La UI consumirá el contrato actual mediante el route adapter:

```text
GET /api/crm/contacts
  ?organizationId=<active organization>
  &query=<optional search>
  &limit=<bounded limit>
  &cursor=<optional cursor>
```

El `organizationId` debe resolverse desde el contexto autorizado de la suite y no desde una selección
libre confiada al navegador. El adapter actual valida la consulta y aplica `crm.read` server-side.

Respuesta utilizada:

```ts
type CrmContactPage = {
  items: CrmContact[];
  nextCursor: string | null;
  hasMore: boolean;
};
```

El primer view model debe ser una proyección estricta de `CrmContact`; no debe inventar
`expectedVersion`, `lastContactedAt`, `lifecycleStage` ni relaciones no entregadas por la API.

## 7. Fases de implementacion

### Fase UI-1: lista autoritativa

- [ ] Confirmar contexto de organización activo y su integración con la query.
- [ ] Crear widget de lista dentro de la superficie Contacts.
- [ ] Integrar `ModuleHeader`, `ModuleToolbar`, `ModuleSearch` y `ResponsiveTable`.
- [x] Implementar búsqueda con `q` en URL y debounce de 300 ms.
- [x] Mantener UI-1 sin `FilterBar`: el contrato actual solo soporta `query`, `cursor` y `limit`.
- [ ] Implementar cursor, límite acotado y navegación anterior/siguiente local.
- [ ] Implementar loading, empty global, empty por búsqueda, error, forbidden y success.
- [ ] Implementar selección por página sin acciones mutantes.
- [ ] Implementar enlace a detalle solo cuando exista ruta y contrato de detalle.

### Fase UI-2: creación y edición

- [ ] Implementar `ContactForm` con los campos contractuales `firstName`, `lastName`, `email`, `phone` y `companyName`.
- [ ] Aplicar validación client-side alineada con `CrmCreateContactCommandSchema` y `CrmUpdateContactCommandSchema`.
- [ ] Exigir al menos un canal de contacto: `email` o `phone`; el backend permanece como autoridad final.
- [ ] Abrir el formulario de creación desde `ModuleHeader.rightSlot` mediante `TechnicalDialog` o drawer accesible.
- [ ] Abrir el mismo formulario en modo edición con valores iniciales del `CrmContact` seleccionado.
- [ ] Crear mediante `POST /api/crm/contacts` con `organizationId` del contexto autorizado, nunca desde un input editable.
- [ ] Editar mediante `PATCH /api/crm/contacts` enviando `contactId` y `expectedUpdatedAt` para control de concurrencia.
- [ ] Mantener un `ContactsDataAdapter` con implementaciones API y fixture; el formulario no debe conocer la fuente de datos.
- [ ] En modo fixture, simular create/update, validación, error y conflicto sin cambiar la composición de la pantalla.
- [ ] Representar estados `idle`, `editing`, `submitting`, `success`, `validation-error`, `forbidden`, `conflict` y `error`.
- [ ] Mapear respuestas `400`, `403`, `409` y `500` a mensajes seguros y accionables sin mostrar errores técnicos crudos.
- [ ] Evitar doble submit, conservar los valores del formulario en error y permitir reintento.
- [ ] Invalidar/refrescar la lista tras una mutación exitosa y conservar búsqueda/filtros cuando sea válido.
- [ ] Cerrar el dialog tras éxito y restaurar el foco en `Create contact` o en la acción que abrió edición.
- [ ] Gestionar cierre con cambios sin guardar y focus management completo en desktop, mobile, light y dark mode.
- [ ] No incluir en UI-2 `owner`, `lifecycleStage`, segmentos, actividad, Customer 360, merge, exportación ni bulk actions.

#### Contrato operativo de UI-2

El formulario debe ser una proyección estricta de los contratos existentes:

```ts
type CrmCreateContactCommand = {
  organizationId: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
};

type CrmUpdateContactCommand = {
  organizationId: string;
  contactId: string;
  firstName?: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  expectedUpdatedAt: string;
};
```

La separación de responsabilidades aprobada es:

```text
ContactsPage
  -> ContactsDataAdapter (fixture o API)
  -> ModuleHeader (acción Create contact)
  -> ContactFormDialog (apertura, cierre y foco)
  -> ContactForm (campos, validación y submit)
  -> FiltersActions (lista, filtros, selección y estados)
```

El adapter debe exponer operaciones equivalentes a `listContacts`, `createContact` y
`updateContact`. Con `NEXT_PUBLIC_CRM_CONTACTS_FIXTURE=true` se usa el fixture externo de diseño;
con la bandera desactivada se consumen los endpoints reales. Cambiar la fuente no debe requerir
modificar `ContactForm` ni la composición visual.

#### Estados y respuestas

| Situación | Comportamiento requerido |
| --------- | ------------------------ |
| `idle` | Dialog cerrado o formulario listo para edición |
| `validation-error` | Mensajes junto al campo; no se envía request |
| `submitting` | Submit bloqueado, valores conservados y loading visible |
| `201` | Cerrar, confirmar éxito, refrescar lista y restaurar foco |
| `400` | Mostrar error de validación seguro y conservar valores |
| `403` | Informar falta de permisos y no ofrecer reintentos inútiles |
| `409` | Informar que el contacto cambió; no sobrescribir y permitir recargar/cancelar |
| `500` | Mostrar error general seguro y permitir reintentar |

#### Auditoría de gaps actual de UI-2

| Capacidad | Estado actual | Evidencia o gap | Acción de UI-2 |
| --------- | ------------- | --------------- | -------------- |
| Canvas `data` | `[x]` | `SalesCrmShell` ya usa `canvasProps={{ mode: 'data' }}` | Mantener sin duplicar configuración |
| `TechnicalDialog` | `[x]` primitive global | Existe en `@loopdev/ui`; cubre dialog accesible, backdrop, `Escape`, focus trap y scroll interno | Reutilizarlo en desktop/tablet |
| `BottomSheet` | `[ ]` no disponible | No hay export ni primitive dedicado en `@loopdev/ui` | Implementar la variante mobile dentro de `ContactFormDialog`; extraer globalmente solo con segundo consumidor |
| Sistema de toast | `[x]` global | `ToastItem`, `ToastViewport` y `toast.show` existen y tienen tests de accesibilidad, duración y aislamiento por tenant | Reutilizar `toast.show({ tenantId, variant, title, description })` tras éxito o error recuperable |
| Primitive de formulario | `[ ]` no disponible | No hay `ContactForm`, `ContactFormDialog` ni wrapper global de campos | Crear componentes CRM-owned para UI-2 con controles de `@loopdev/ui` |
| Librería de formularios | `[x]` base instalada | `react-hook-form`, `@hookform/resolvers` y Zod están en `@loopdev/ui`; no se han añadido Formik ni Final Form | Usar la base global y añadir schemas/resolvers por dominio |
| Validación client-side | `[ ]` pendiente | Los schemas existen en `@loopdev/contracts`, pero aún no se proyectan a errores de campo en UI | Añadir validación de `firstName` y regla `email || phone` antes del request |
| Adapter | `[ ]` pendiente | La lista cambia API/fixture directamente dentro de `ContactsPage` y no existe `ContactsDataAdapter` | Extraer `listContacts`, `createContact` y `updateContact` detrás del mismo contrato |
| POST real | `[x]` endpoint disponible | `POST /api/crm/contacts` valida schema y `crm.manage`; la UI aún no lo invoca | Conectar adapter API y mapear `201/400/403/500` |
| PATCH real | `[x]` endpoint disponible | `PATCH /api/crm/contacts` exige `contactId` y `expectedUpdatedAt`; la UI aún no lo invoca | Conectar edición y mapear `200/400/403/409/500` |
| Creación desde header | `[ ]` pendiente | `Create contact` se renderiza sin `onClick` | Abrir `ContactFormDialog` y conservar el trigger para restauración de foco |
| Edición desde fila | `[ ]` pendiente | La tabla no tiene acción de edición conectada | Añadir acción solo para `crm.manage`, con contacto inicial y trigger identificable |
| Fixture mutante | `[ ]` pendiente | El fixture actual solo expone lectura/paginación y sus IDs no son UUID | Añadir adapter mutable de diseño y normalizar IDs antes de parsear contratos |
| Conflicto `409` | `[x]` backend / `[ ]` UI | El backend traduce concurrencia a `409`; no existe estado visual ni recarga | Mostrar `ConflictAlert`, no sobrescribir y permitir recargar/cancelar |
| Refresco tras éxito | `[ ]` pendiente | La lista no tiene invalidación ligada a una mutación | Refrescar la página actual conservando `q`, filtros válidos y organización |
| Focus restoration | `[~]` parcial | Radix gestiona foco dentro del dialog, pero no existe trigger stateful en Contacts | Guardar el elemento que abrió create/edit y devolverle foco tras cierre |
| Cambios sin guardar | `[ ]` pendiente | No existe estado `dirty` ni política de descarte | Confirmar antes de cerrar por `Escape`, backdrop o botón cerrar si hay cambios |
| Pruebas UI-2 | `[ ]` pendiente | No existen tests específicos de Contacts para formulario y mutaciones | Añadir unit/integration y Playwright para foco, validación, `409` y éxito |

Esta tabla distingue infraestructura existente de integración pendiente. En particular, tener
`TechnicalDialog` y toast global no significa que UI-2 esté implementada: todavía falta el slice CRM
que orquesta formulario, adapter, permisos, mutaciones, estados y restauración de foco.

### Detalle operativo UI-1

UI-1 es la superficie autoritativa de consulta de Contacts. No es una tabla aislada: combina
contexto de módulo, búsqueda, filtros autorizados, selección, ordenación compatible, estados y
responsive behavior.

#### UI-1A: cabecera y acción primaria

- `ModuleHeader` pertenece a la pantalla Contacts y contiene el título, segmento actual y
  `Create contact` en `rightSlot` cuando existe `crm.manage`.
- El conteo mostrado es el número de registros visibles en la página actual; no se debe presentar
  como total absoluto mientras la API no exponga un count contract.
- La cabecera debe conservar layout, foco, contraste y acción primaria en desktop, mobile, light y
  dark mode.

#### UI-1B: búsqueda y filtros

- La búsqueda usa `q` en URL y debounce de 300 ms.
- El adapter de lista debe cancelar requests obsoletos y conservar los parámetros no relacionados.
- Solo se muestran filtros con opciones y comportamiento definidos por contrato.
- Los filtros visuales de diseño pueden usar el fixture externo, pero no deben enviarse al endpoint
  real hasta que `CrmContactQuerySchema` los soporte.
- Cada filtro debe definir opciones, cardinalidad, limpieza individual, limpieza global, estado sin
  opciones, URL state y comportamiento mobile.
- No se muestran como funcionales `owner`, `lifecycleStage`, segmentos, lead status o actividad sin
  read model, capability y query server-side aprobados.

#### UI-1C: tabla, selección y ordenación

- La tabla solo representa campos presentes en `CrmContact` y autorizados para el read model.
- La primera proyección incluye `Contact`, `Phone`, `Company` y `Updated`.
- Los valores ausentes deben tener copy estable y accesible; no se crean columnas vacías para
  aparentar cobertura.
- La selección es por página y no ofrece acciones mutantes mientras no existan API y capability.
- La ordenación local de columnas puede usarse para la página cargada; no debe presentarse como
  ordenación global server-side.
- La ordenación server-side queda diferida hasta definir su contrato junto con cursor pagination.

#### UI-1D: cursor y paginación

- El backend entrega `nextCursor` y `hasMore`; no entrega páginas numéricas absolutas.
- La UI mantiene historial local para navegación anterior.
- El adapter debe traducir `Next` a un request con cursor y `Previous` al cursor anterior conocido.
- La paginación visual no debe duplicarse entre Contacts y `FiltersActions`.
- En mobile se utiliza la variante compacta y se mantiene una sola fila de controles cuando el ancho
  lo permite.

#### UI-1E: estados y responsive

La pantalla debe representar loading de contexto, loading de permisos, loading de datos, forbidden,
empty global, empty filtrado, error de red, errores HTTP, success, selección y organización ausente.

En desktop/tablet se usa tabla con overflow horizontal controlado. En mobile se usa una lista
semántica de tarjetas, sin cabecera genérica `Record/Status/Actions` cuando Contacts proporciona su
propio `renderMobileRow`. Las tarjetas muestran nombre, email o teléfono y empresa, con separación,
padding, truncado y estados de datos ausentes.

### Detalle operativo UI-3: enriquecimiento autorizado

UI-3 no es un único incremento. Cada enriquecimiento debe aprobarse como slice independiente con
read model, query, capability, autorización, estados y pruebas.

#### UI-3A: owner y asignación

- Definir `assignedUserId`, lookup tenant-aware y estado `Unassigned`.
- Definir quién puede ver, asignar y reasignar.
- Definir usuarios desactivados, auditoría, concurrencia y recuperación de error.
- No implementar bulk assignment hasta que exista capability y endpoint de acciones masivas.

#### UI-3B: lifecycle stage

- Definir catálogo, labels, orden, stage inicial y transiciones permitidas.
- Mantenerlo separado de Lead status.
- Definir permisos, auditoría, URL state y comportamiento ante stage archivado.
- El dropdown no se muestra hasta que exista contrato estable.

#### UI-3C: empresa y rol

- Decidir si `companyName` permanece como texto o evoluciona a `companyId` y relación tipada.
- Definir empresa principal, relaciones múltiples, rol, selección, creación y eliminación.
- Aplicar permisos y estados para empresa inexistente o no autorizada.

#### UI-3D: última interacción y filtros enriquecidos

- Definir fuente de actividad, tipos incluidos, deduplicación, timezone y permisos.
- Definir filtros por owner, lifecycle, company, última interacción, created date y updated date.
- Cada filtro debe especificar campo, operador, tipo, valor, serialización URL, query server-side,
  estado vacío y autorización.

### Detalle operativo UI-4: detalle y Customer 360

UI-4 introduce una superficie distinta en `/sales-crm/contacts/:id` con `SuiteCanvas mode="workspace"`.

#### UI-4A: detalle del contacto

- Header con nombre, identidad, empresa principal, acciones autorizadas y navegación de retorno.
- Datos de contacto, canales, empresa, owner y lifecycle solo cuando el read model los entregue.
- Loading, forbidden, not found, error, PII restrictions y estado de contacto archivado.

#### UI-4B: timeline y relaciones

- Timeline paginado con tipos de evento, orden temporal, timezone, deduplicación y permisos.
- Notas y tareas con endpoints, auditoría, estados y errores definidos.
- Relaciones con empresas, leads, opportunities y personas relacionadas únicamente cuando exista
  contrato de navegación y autorización.

#### UI-4C: responsive y split

- Definir cuándo usar `workspace` y cuándo `split` para lista más preview.
- En mobile, decidir entre columna única, tabs, accordions o bloques colapsables.
- Definir sticky actions, navegación secundaria, restauración de foco y estados de cada bloque.
- Duplicate review y merge permanecen fuera hasta tener contrato, auditoría y comandos autorizados.

### Matriz de trazabilidad UI

| UI | Ruta | Canvas | Fuente | Acción primaria | Contrato principal | Estados | Responsive | Tests |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| UI-1 lista | `/sales-crm/contacts` | `data` | API/fixture | Create contact | `CrmContactQuery` / `CrmContactPage` | loading, empty, error, forbidden, success | tabla desktop, tarjetas mobile | unit, integration, E2E |
| UI-2 crear | `/sales-crm/contacts` + overlay | `data` | API/fixture | Submit create | `CrmCreateContactCommand` | validation, submitting, success, 400, 403, 500 | TechnicalDialog desktop, BottomSheet mobile | unit, integration, E2E |
| UI-2 editar | `/sales-crm/contacts` + overlay | `data` | API/fixture | Submit update | `CrmUpdateContactCommand` | validation, submitting, success, 400, 403, 409, 500 | TechnicalDialog desktop, BottomSheet mobile | unit, integration, E2E |
| UI-3 enriquecida | `/sales-crm/contacts` | `data` | API | filters/actions | approved enriched query/read model | permission, loading, empty, error, conflict | responsive toolbar/table | contract, integration, E2E |
| UI-4 detalle | `/sales-crm/contacts/:id` | `workspace`/`split` | API | Edit/back | detail, activity and relation contracts | loading, not found, forbidden, error, partial | workspace mobile | unit, integration, E2E |

### Criterios de aceptación por fase

#### UI-1

- La ruta usa `SalesCrmShell` y `SuiteCanvas mode="data"`.
- La fuente puede cambiar entre API y fixture sin cambiar la composición.
- Query, cursor, permisos, estados, selección y responsive están cubiertos.
- No existen mocks de producción ni acceso directo del navegador a Supabase.

#### UI-2

- Crear y editar usan el formulario contractual y `crm.manage`.
- Se exige email o teléfono y se evita doble submit.
- `POST`, `PATCH`, `expectedUpdatedAt`, `400`, `403`, `409` y `500` tienen comportamiento definido.
- El fixture permite revisar create/update/error/conflict sin backend.
- El dialog/drawer mantiene focus management en desktop/mobile y light/dark.
- La lista se refresca tras éxito sin perder estado válido de búsqueda y filtros.

#### UI-3

- Cada capacidad tiene contrato, capability, query, read model, auditoría y pruebas antes de mostrarse.
- No hay controles visuales sin opciones o acciones sin endpoint.
- Filtros y campos enriquecidos se sincronizan con URL cuando corresponda.

#### UI-4

- Detalle, timeline, notas, relaciones y duplicate review tienen contratos separados.
- La ruta respeta permisos y no filtra PII no autorizada.
- `workspace`/`split`, mobile, focus, loading, empty, forbidden y error están certificados.

### Fase UI-3: enriquecimiento autorizado

- [ ] Definir y aprobar read model enriquecido para owner, lifecycle, empresa/rol y actividad.
- [ ] Añadir filtros tenant-aware y sincronizados con URL después de aprobar el query contract.
- [ ] Añadir capabilities `contacts.export`, `contacts.bulk_edit` y sus endpoints.
- [ ] Añadir segmentos rápidos solo cuando cada segmento tenga query server-side.
- [ ] Añadir exportación y acciones masivas con auditoría.

### Fase UI-4: detalle y Customer 360

- [ ] Crear `/sales-crm/contacts/:id` con `workspace`.
- [ ] Añadir previsualización `split` si el flujo lista + detalle lo requiere.
- [ ] Implementar `ContactDetailPanel`, timeline, notas, relaciones y duplicate review.

## 8. Criterios de aceptación para aprobar UI-1

- [ ] La ruta renderiza dentro de `SalesCrmShell` y `SuiteCanvas mode="data"`.
- [ ] No existen mocks ni acceso directo del navegador a Supabase.
- [ ] La búsqueda actualiza `q` sin recargar la suite y conserva el estado al navegar.
- [ ] La lista usa cursor real y no presenta paginación numérica ficticia.
- [ ] La tabla representa exclusivamente campos presentes en el contrato vigente.
- [ ] La selección no ofrece acciones que todavía no tienen API/capability.
- [ ] Loading, empty, error y forbidden tienen representación accesible.
- [ ] La vista mobile no genera overflow horizontal del shell y transforma filas semánticamente.
- [ ] Las acciones respetan `crm.read` y `crm.manage` server-side.
- [ ] Tests cubren query, estados, selección, responsive y errores 403/409 cuando aplique.
- [ ] Typecheck, tests focalizados, build y `git diff --check` pasan.

## 9. Aprobaciones y relación con el handoff backend

Este documento es el handoff de implementación UI y complementa
`CRM_CONTACT_IMPLEMENTATION_HANDOFF.md`, que certifica el slice backend-first. No reemplaza el
contrato de Contact ni autoriza cambios de schema sin actualizar el impact assessment.

Antes de comenzar UI-1 deben aprobarse explícitamente:

- ruta `/sales-crm/contacts`;
- alcance reducido de columnas basado en el API actual;
- cursor en lugar de paginación numérica;
- exclusión temporal de exportación, bulk actions, segmentos y lifecycle stage;
- estrategia de organización activa y permisos;
- comportamiento mobile de `ResponsiveTable`.
