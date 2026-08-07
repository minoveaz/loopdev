# Track: Estandarizacion del frontend de LoopDev

**Fecha:** 2026-08-07  
**Estado:** Planificado  
**Rama:** `feature/loopdev-frontend-standardization`  
**Objetivo:** elevar y estandarizar la experiencia visual de LoopDev OS sin modificar la logica de negocio, la persistencia, la autorizacion real ni la infraestructura SaaS que desarrolla el equipo de plataforma.

## Contexto y decision principal

El equipo de plataforma esta evolucionando LoopDev hacia un SaaS multiempresa. En paralelo, el equipo frontend necesita poder avanzar sobre la experiencia de usuario aunque no tenga acceso temporal a todas las organizaciones, workspaces, permisos o modulos reales.

La decision es construir una capa de preview visual dentro de `apps/loopdev-os`, reutilizando el Design System, los contratos y los componentes compartidos existentes. El preview utilizara fixtures y adaptadores mock, pero no sera una segunda aplicacion ni una copia temporal de la POC.

La UI debe poder conectarse posteriormente a repositorios server-side reales sin rehacer las pantallas. Los mocks son una implementacion provisional de los adaptadores, no una fuente alternativa de logica de negocio.

## Principios de trabajo

### Frontend primero, dominio intacto

Esta rama puede cambiar como se presenta un flujo, pero no como se autentica, autoriza, persiste o transforma la informacion.

### Reutilizacion antes que duplicacion

Los nuevos componentes deben reutilizar `@loopdev/ui`, `@loopdev/contracts` y los patrones existentes. No se copiaran el shell, las suites ni la aplicacion Vite/Express de la POC.

### Datos por adaptadores

Las pantallas dependeran de interfaces de repositorio o providers. La implementacion mock se inyectara desde el preview y podra ser sustituida por una implementacion server-side posterior.

### Produccion protegida

Las rutas reales de las suites mantienen sus providers y guards actuales. El preview no desactiva globalmente autenticacion, organizaciones o permisos.

### Cambios acotados y reversibles

Cada PR debe poder revisarse visualmente y explicar que parte pertenece a tokens, primitives, composites, layouts, paginas, responsive o accesibilidad.

## Arquitectura objetivo

```text
LoopDev OS real
    AuthProvider
        OrganizationProvider
            PermissionProvider
                SuitePermissionGuard
                    Suite real + repositorio server-side

Frontend Preview
    PreviewShell
        PreviewContext
            mock user / organization / workspace / permissions
                suite preview + mock repository
```

### Ubicacion de la capa de preview

```text
apps/loopdev-os/src/app/frontend-preview/
apps/loopdev-os/src/features/frontend-preview/
apps/loopdev-os/src/features/communications/
apps/loopdev-os/src/data/fixtures/
```

La ruta `/frontend-preview` sirve como catalogo navegable de estados y modulos. No sustituye las rutas de produccion ni debe convertirse en una segunda aplicacion.

### Capas reutilizables

1. **Tokens:** color, tipografia, espaciado, radios, bordes, sombras y estados.
2. **Primitives:** botones, inputs, badges, tabs, tooltips, dialogs, skeletons y superficies.
3. **Composites:** sidebar, headers, tablas, filtros, command bar, paneles, listas y tarjetas.
4. **Layouts:** shell, workspace, inspector, bandeja y detalle.
5. **Feature UI:** pantallas y componentes de Communications, Marketing Studio, CRM, Quant Ops y otras suites.
6. **Adaptadores:** interfaces de datos y repositorios mock intercambiables.

## Alcance funcional

### Incluido

- Crear un catalogo visual accesible desde `/frontend-preview`.
- Crear un shell de preview compuesto con componentes de `@loopdev/ui`.
- Representar usuario, organizacion, marca, workspace y permisos mediante fixtures locales.
- Estandarizar la jerarquia visual del shell y de las suites.
- Mejorar navegacion, densidad, responsive design y estados de interfaz.
- Crear pantallas de Communications dentro de `apps/loopdev-os`.
- Diseñar bandeja de conversaciones, chat y detalle de contacto.
- Crear tarjetas de adjuntos y documentos.
- Implementar estados loading, empty, error y success.
- Implementar filtros, busqueda, paginacion y modales de forma local.
- Simular acciones visuales como archivar, clasificar, guardar en ficha y descargar.
- Crear componentes reutilizables compatibles con el Design System.
- Añadir tests unitarios, de componentes, accesibilidad y responsive cuando corresponda.
- Documentar los contratos que necesitara posteriormente el backend.
- Mantener las interfaces preparadas para recibir repositorios server-side reales.

### Fuera de alcance

- Cambios en autenticacion o sesiones reales.
- Cambios en organizaciones, membresias, marcas o workspaces reales.
- Cambios en permisos, RBAC o guards de produccion.
- Persistencia real de conversaciones, contactos, documentos o acciones.
- Integracion real con Supabase, WhatsApp, CRM o servicios externos.
- Implementacion de API routes reales para Communications.
- Migracion de datos desde la POC.
- Cambios en contratos SaaS existentes salvo que sean documentales y previamente revisados.
- Cambios globales del Design System sin una PR especifica y aprobacion del equipo responsable.
- Copiar la aplicacion Vite/Express de `whatsapp-poc` dentro de LoopDev.
- Introducir tokens, claves, secretos o variables sensibles en el navegador.

## Reglas de aislamiento

Los siguientes directorios no deben modificarse en esta rama salvo autorizacion explicita del equipo de plataforma:

```text
supabase/migrations/
supabase/functions/
supabase/tests/
apps/loopdev-os/src/lib/supabase/
apps/loopdev-os/src/providers/AuthProvider.tsx
apps/loopdev-os/src/providers/OrganizationProvider.tsx
apps/loopdev-os/src/providers/PermissionProvider.tsx
apps/loopdev-os/src/components/layout/OrganizationRouteGuard.tsx
apps/loopdev-os/src/components/layout/SuitePermissionGuard.tsx
```

Los componentes del preview no deben importar Supabase ni consultar tablas directamente.

## Modelo de preview

### Contexto mock

El preview puede disponer de un contexto local con:

- usuario de demostracion;
- organizacion de demostracion;
- marca activa;
- workspace activo;
- permisos visuales por suite;
- estado de conectividad simulado;
- escenario seleccionado: success, loading, empty o error.

Este contexto solo controla la representacion visual y no modifica el modelo real de autorizacion.

### Repositorios y contratos

Las features deben depender de interfaces, no de fixtures concretas:

```ts
export interface CommunicationsRepository {
  listConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  listContacts(): Promise<Contact[]>;
  archiveConversation(id: string): Promise<void>;
}
```

El preview utilizara `mockCommunicationsRepository`. La futura implementacion server-side podra cumplir la misma interfaz sin cambiar los componentes de presentacion.

Las interfaces nuevas deben documentar:

- identificadores y relaciones esperadas;
- estados posibles;
- paginacion y filtros;
- acciones mutables;
- errores esperados;
- permisos que necesitara el backend;
- campos que no deben exponerse al cliente.

## Communications: primera vertical visual

### Navegacion prevista

```text
Communications
├── Inbox
├── Conversations
├── Contacts
├── Documents
└── Settings
```

### Superficies iniciales

- bandeja con conversaciones y filtros;
- lista de conversaciones vacia;
- detalle de conversacion con mensajes mock;
- panel de contacto;
- tarjetas de adjuntos y documentos;
- busqueda y filtrado local;
- modal de descarga o vista previa;
- indicadores de lectura, asignacion y estado;
- estados de error y reintento visual;
- responsive para desktop y mobile.

### Acciones simuladas

Las acciones solo actualizan estado local durante el preview:

- archivar;
- clasificar;
- asignar;
- guardar en ficha;
- marcar como leida;
- descargar una representacion mock.

No deben ejecutar llamadas reales ni prometer persistencia.

## Plan de ejecucion

### Fase 1: linea base y preview

- Revisar el shell y los componentes existentes.
- Crear la ruta `/frontend-preview`.
- Crear el contexto mock minimo.
- Crear navegacion de suites y escenarios.
- Verificar que el preview no dependa de Supabase.

### Fase 2: fundamentos visuales

- Auditar tokens existentes.
- Definir escala tipografica y espaciado.
- Revisar contraste y estados de foco.
- Unificar botones, inputs, badges, cards, tabs y dialogs.
- Evitar introducir una segunda fuente de verdad para tokens.

### Fase 3: shell y layouts

- Estandarizar sidebar, suite header, breadcrumbs y command bar.
- Revisar layout de workspace, inspector y paneles.
- Resolver comportamiento responsive.
- Crear estados de carga y vacio consistentes.

### Fase 4: Communications

- Crear tipos de vista y adaptador mock.
- Construir inbox y detalle de conversacion.
- Construir contactos y documentos.
- Añadir filtros, busqueda, modales y acciones locales.
- Documentar los contratos backend necesarios.

### Fase 5: expansion por suites

- Aplicar los patrones estabilizados a Marketing Studio, CRM, Quant Ops y Health OS.
- Migrar superficies existentes de forma incremental.
- Evitar refactors globales que no sean necesarios para la experiencia visual.

### Fase 6: endurecimiento

- Tests de componentes y estados.
- Accesibilidad.
- Responsive.
- Validacion visual en desktop y mobile.
- Revisión de imports para confirmar ausencia de Supabase en preview.
- Revisión de cambios para confirmar que no afectan migraciones ni logica de plataforma.

## Criterios de calidad

- La interfaz funciona sin sesion, organizacion o datos reales cuando se accede al preview.
- Las pantallas usan componentes compartidos siempre que existan.
- No hay consultas directas a Supabase desde el preview.
- Las acciones mock dejan claro su caracter local.
- Los estados loading, empty, error y success son navegables.
- Los textos y controles no se desbordan en desktop ni mobile.
- Los controles tienen foco visible y nombres accesibles.
- Los nuevos contratos estan documentados sin asumir el modelo final de datos.
- El Design System no recibe cambios globales sin revisión.
- La compilacion no cambia el comportamiento de las rutas reales.

## Validacion obligatoria

Desde la raiz del repositorio:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Para cada feature visual se deben añadir, cuando aplique:

- tests de renderizado;
- tests de interaccion local;
- tests de estados loading, empty y error;
- tests de accesibilidad;
- verificacion responsive;
- capturas o evidencia visual en la PR.

## Flujo de ramas y Pull Request

```text
develop actualizado
        |
        +--> feature/loopdev-frontend-standardization
                    |
                    +--> cambios frontend acotados
                    +--> tests locales
                    +--> Pull Request contra develop
                    +--> GitHub Actions en verde
                    +--> revisión y squash merge
```

Cada PR debe declarar:

```text
Supabase changed: no
Migrations changed: no
RLS changed: no
API changed: no
Business logic changed: no
Real persistence added: no
Mock preview added: yes/no
Shared design system changed: yes/no
```

## Definicion de terminado

El track se considerara completado cuando:

- exista un preview visual navegable;
- el preview permita revisar los modulos prioritarios sin acceso a datos reales;
- Communications tenga una primera experiencia funcional con mocks;
- existan adaptadores documentados y sustituibles;
- los estados visuales principales esten cubiertos;
- los componentes reutilizables esten integrados con el Design System;
- los tests y la validacion del monorepo esten en verde;
- no existan cambios en migraciones, RLS, Supabase o logica SaaS;
- la PR este lista para revisión del equipo de plataforma.
