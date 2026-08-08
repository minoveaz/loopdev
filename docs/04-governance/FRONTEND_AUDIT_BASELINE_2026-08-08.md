# Frontend Audit Baseline — 2026-08-08

## Estado

- **Modo:** informativo, no bloqueante.
- **Comando:** `pnpm front:audit`.
- **Script:** `scripts/front-audit.mjs`.
- **Ramas:** `feature/loopdev-frontend-work`.
- **Alcance:** `apps/loopdev-os/src`, `ds/packages/ui/src` y `modules`.
- **Exclusiones:** `node_modules`, `.next`, `dist` y `coverage`.

## Resultado inicial

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
| Tab underline collision review | 1 |
| Low contrast outline action review | 2 |
| **Total** | **23** |

## Interpretación

Este resultado es una línea base heurística. No significa que los 20 casos sean incumplimientos confirmados. El objetivo de esta ejecución es localizar zonas de deuda y medir el tamaño del problema antes de endurecer el gate.

Prioridades iniciales:

1. Reducir falsos positivos en la regla de tipografía.
2. Separar iconos funcionales de ilustraciones y visualizaciones legítimas.
3. Identificar botones que realmente deben migrar a `Button` o `IconButton`.
4. Confirmar cada color hardcodeado y sustituirlo por tokens cuando corresponda.
5. Eliminar el control de tema desde layouts de suite.

## Reglas actuales

| Regla | Detección | Estado |
|---|---|---|
| `typography` | headings con clases locales, mono/telemetría e inline typography, excluyendo hooks y componentes técnicos reconocidos | Informativa |
| `hardcodedColor` | HEX en clases o código fuente, excluyendo tests y fallbacks `var(--token, #fallback)` | Informativa |
| `forcedTheme` | manipulación local de `dark`/`light` fuera del owner oficial `ThemeToggle` | Informativa |
| `themeIsolation` | mutación de clases globales o variables `--lpd-color` desde una suite; los owners del sistema quedan explícitamente excluidos | Informativa |
| `iconography` | SVG fuera de ubicaciones reconocidas; el primitive `Icon` de `@loopdev/ui` queda aceptado | Informativa |
| `approvedInteractivePrimitive` | botones nativos de consumidores de producto fuera de componentes aprobados, excluyendo tests y la implementación interna de `@loopdev/ui`, como lista de migración/revisión | Informativa |
| `tabUnderlineCollision` | contenedores de navegación con `border-b` combinado con botones activos que usan `border-b-2` | Informativa |
| `lowContrastOutlineAction` | acciones `outline` con utilidades de texto/borde de bajo contraste dentro de superficies oscuras | Informativa |

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

## Siguiente paso

Antes de bloquear código, revisar una muestra representativa de cada categoría y ajustar el auditor para:

- aceptar excepciones explícitas;
- reconocer primitives certificados;
- distinguir archivos de laboratorio y visualización;
- producir baseline por archivo y regla;
- fallar solo por hallazgos introducidos en cambios nuevos.
