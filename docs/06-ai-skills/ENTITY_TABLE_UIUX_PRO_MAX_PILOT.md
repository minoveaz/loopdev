# UI UX Pro Max Pilot: EntityTable

**Fecha:** 2026-08-16
**Componente:** `apps/loopdev-os/src/components/composites/data-tables/EntityTable.tsx`
**Estado:** exploración, no certificación

## Objetivo

Evaluar si UI UX Pro Max puede mejorar las decisiones de UI/UX de `EntityTable`
sin sustituir los tokens, contratos, ownership ni gates de certificación de
LoopDev.

## Ejecución

Se ejecutó una copia temporal fijada desde el repositorio upstream con Python 3:

```bash
python3 src/ui-ux-pro-max/scripts/search.py \
  "CRM SaaS operational customer records dense dashboard table" \
  --design-system \
  --project-name "LoopDev EntityTable" \
  --format markdown
```

También se probaron los dominios `product` y `ux`, y la guía de stack `nextjs`,
con estas consultas:

- `CRM SaaS customer records operational dashboard`
- `dense responsive data table filters selection`
- `accessible table focus keyboard reduced motion compact labels`

## Señales útiles

### Producto

La búsqueda de CRM recomendó:

- `Flat Design` y `Minimalism & Swiss Style`;
- un dashboard orientado a inteligencia comercial;
- una interfaz densa, operativa y con contraste de etapas/estados.

Esto coincide parcialmente con el contrato actual de `EntityTable`: identidad
primero, densidad legible, separadores técnicos y color semántico para estados.

La recomendación generada de patrón de landing (`Product Demo + Features`) no
aplica a una tabla de producto autenticada. La salida confirma que el resultado
debe filtrarse por contexto de pantalla, no copiarse directamente.

### UX

La consulta de tabla devolvió reglas aplicables:

- las tablas móviles deben usar scroll horizontal acotado o una representación
  tipo card/lista;
- las acciones masivas deben apoyarse en selección múltiple y una barra de
  acciones contextual;
- reduced motion debe respetarse;
- los controles compactos necesitan semántica nativa, nombre accesible, estado
  expuesto y foco visible;
- los botones de icono deben tener nombre accesible.

`EntityTable` ya implementa parte de estas reglas mediante `renderMobileRow`,
selección controlada, `Checkbox`, foco visible y test Axe. La salida sirve como
checklist de revisión, no como motivo suficiente para cambiar la composición.

### Stack

La guía `nextjs` devolvió recomendaciones de Server Components y `Image fill`,
pero no reglas específicas de tablas. No se adoptan para este piloto porque
`EntityTable` es un componente cliente de interacción y no contiene imágenes.

## Traducción al sistema LoopDev

| Recomendación | Decisión para `EntityTable` |
| --- | --- |
| Flat/minimal para CRM | Adoptar como dirección, usando tokens LoopDev existentes |
| Dashboard denso | Adoptar con densidad legible y geometría estable |
| Paleta azul/verde generada | No copiar; mapear a tokens semánticos de estado y acción |
| Nueva tipografía Google Fonts | Rechazar; conservar el contrato tipográfico LoopDev |
| Scroll o lista móvil | Mantener la lista móvil identity-first ya definida |
| Selección y bulk actions | Mantener selección controlada y validar barra contextual |
| Contraste 4.5:1 | Adoptar como criterio de evidencia |
| Foco y nombres accesibles | Adoptar; comprobar también acciones de fila y filtros |
| Reduced motion | Adoptar; ya existe una política global, falta evidencia visual |
| Chips compactos | Revisar filtros, estado `aria-*`, wrapping y foco |
| Landing-page pattern | Rechazar como falso positivo de contexto |

## Resultado

La skill es viable como **motor de exploración y checklist** para `EntityTable`.
No debe generar ni modificar directamente la implementación. La salida útil se
traduce primero a la `UI_UX_SPEC.md` del componente y después pasa por:

1. `component-development` para reutilización, ownership y composición.
2. `ui-ux-component-certification` para interacción, accesibilidad y responsive.
3. `pnpm front:check` y tests focalizados.
4. Evidencia Playwright desktop, mobile y mobile-compact.

## Próximo experimento

Para completar el piloto, revisar en la implementación real:

- wrapping y nombre accesible de filtros activos;
- foco y cierre por teclado del panel de filtros avanzados;
- estado y acción contextual tras seleccionar filas;
- ancho mínimo y lectura de la fila móvil a 375px;
- contraste de estado `Paused` y acciones ghost en modo claro;
- comportamiento con `prefers-reduced-motion` en transiciones de filtros y filas.

Estos puntos son preguntas de validación derivadas de la skill. No constituyen
hallazgos confirmados hasta ejecutar los tests y la revisión visual definidos por
LoopDev.