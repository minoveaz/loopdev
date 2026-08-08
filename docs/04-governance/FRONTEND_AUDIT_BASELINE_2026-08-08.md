# Frontend Audit Baseline — 2026-08-08

## Estado

- **Modo:** informativo, no bloqueante.
- **Comando:** `pnpm front:audit`.
- **Script:** `scripts/front-audit.mjs`.
- **Filtros:** `--file=<fragmento>` y `--rule=<regla>` para auditorías focalizadas.
- **CI opcional:** `--fail-on-findings` establece código de salida 1 si hay hallazgos.
- **Ramas:** `feature/loopdev-frontend-work`.
- **Alcance:** `apps/loopdev-os/src`, `ds/packages/ui/src` y `modules`.
- **Exclusiones:** `node_modules`, `.next`, `dist` y `coverage`.

## Resultado inicial

La tabla siguiente conserva la fotografía inicial anterior a la calibración de las
heurísticas. No debe interpretarse como el resultado actual del auditor.

| Categoría | Hallazgos |
|---|---:|
| Tipografía | 0 |
| Hardcoded colors | 14 |
| Forced theme | 0 |
| Theme isolation | 0 |
| Iconography review | 6 |
| Emoji iconography | 0 |
| Filter primitive consistency | 0 |
| Approved interactive primitive review | 0 |
| Tab underline collision review | 0 |
| Low contrast outline action review | 2 |
| Sidebar route policy review | 0 |
| Duplicate import binding review | 0 |
| **Total** | **22** |

## Interpretación

Este resultado es una línea base heurística. No significa que los 22 casos sean incumplimientos confirmados. El objetivo de esta ejecución es localizar zonas de deuda y medir el tamaño del problema antes de endurecer el gate.

## Estado actual — 2026-08-08

Tras la calibración de las heurísticas y la migración visual de las suites revisadas,
la última ejecución completa reporta **0 hallazgos** en todas las reglas. La tabla
anterior se conserva como fotografía histórica y no representa el estado actual.

Validación actual:

```text
node scripts/front-audit.mjs --json
totalFindings: 0
```

Prioridades iniciales:

1. Separar iconos funcionales de ilustraciones y visualizaciones legítimas.
2. Identificar botones que realmente deben migrar a `Button` o `IconButton`.
3. Confirmar cada color hardcodeado y sustituirlo por tokens cuando corresponda.
4. Eliminar el control de tema desde layouts de suite.

La calibración posterior excluye del recuento los SVG, colores fallback y tokens
que pertenecen al propio design system, además de los gráficos de visualización
reconocidos. También analiza el contraste por botón `outline`, respetando sus
overrides `dark:`. El resultado actual debe regenerarse con el comando reproducible
antes de actualizar esta tabla numérica.

## Reglas actuales

| Regla | Detección | Estado |
|---|---|---|
| `typography` | headings con clases locales, mono/telemetría e inline typography, excluyendo hooks y componentes técnicos reconocidos | Informativa |
| `hardcodedColor` | HEX en clases o código fuente, excluyendo tests, fallbacks `var(--token, #fallback)` y owners del design system | Informativa |
| `forcedTheme` | manipulación local de `dark`/`light` fuera del owner oficial `ThemeToggle` | Informativa |
| `themeIsolation` | mutación de clases globales o variables `--lpd-color` desde una suite; los owners del sistema quedan explícitamente excluidos | Informativa |
| `iconography` | SVG fuera de ubicaciones reconocidas; el primitive `Icon` de `@loopdev/ui`, su implementación interna y visualizaciones reconocidas quedan aceptados | Informativa |
| `approvedInteractivePrimitive` | botones nativos de consumidores de producto fuera de componentes aprobados, excluyendo tests y la implementación interna de `@loopdev/ui`, como lista de migración/revisión | Informativa |
| `tabUnderlineCollision` | contenedores de navegación con `border-b` combinado con botones activos que usan `border-b-2` | Informativa |
| `tabControlConsistency` | tabs que dependen del variant por defecto del botón en vez de declarar variante, espaciado y estado explícitos | Informativa |
| `timelineConsistency` | timelines de actividad con marcadores circulares absolutos que pueden colisionar con la línea o el contenido | Informativa |
| `implicitButtonVariant` | botones de producto que dependen del variant primario por defecto | Informativa |
| `lightModeActionContrast` | botones con texto o iconos claros sin override que garantice contraste en modo claro | Informativa |
| `iconColorConsistency` | iconos con paletas arbitrarias en vez de tokens semánticos o color heredado del control | Informativa |
| `lowContrastOutlineAction` | acciones `outline` con utilidades de texto/borde de bajo contraste; analiza cada botón y respeta overrides `dark:` | Informativa |
| `sidebarRoutePolicy` | layouts de suite deben usar `getSuiteNavMode` y declarar prefijos operativos; se rechaza inferir `rail` solo por profundidad de URL | Informativa |
| `duplicateImportBinding` | imports nombrados duplicados que provocan errores de parsing/build antes de llegar a TypeScript | Informativa |
| `tokenUsage` | utilidades de paleta directa (`slate`, `emerald`, etc.) o valores de color inline fuera de tokens semánticos; excluye el design system, owners de color y tests | Informativa |
| `shellArchitecture` | los layouts de suite deben reservar `AppShell` para el shell global y los layouts de módulo deben componer `ModuleWorkspace` directamente | Informativa |

## Uso reproducible

Reporte humano:

```bash
pnpm front:audit
```

Reporte estructurado:

```bash
node scripts/front-audit.mjs --json > /tmp/loopdev-front-audit.json
```

El modo JSON permite crear un baseline posterior y comparar únicamente regresiones nuevas.
También incluye `findingsByFile`, ordenado por cantidad, y deduplica hallazgos con
la misma combinación de archivo, línea, regla y mensaje.

Auditoría focalizada:

```bash
node scripts/front-audit.mjs --rule=tokenUsage --file=PipelineFilters.tsx
```

Modo estricto para CI:

```bash
node scripts/front-audit.mjs --fail-on-findings
```

## Siguiente paso

Antes de bloquear código, revisar una muestra representativa de cada categoría y ajustar el auditor para:

- aceptar excepciones explícitas;
- reconocer primitives certificados;
- distinguir archivos de laboratorio y visualización;
- producir baseline por archivo y regla;
- fallar solo por hallazgos introducidos en cambios nuevos.
