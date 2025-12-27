# Documentation Hub — Source of Truth

Esta carpeta contiene la **fuente única de verdad** (SoT) para el sistema de componentes, tokens y gobernanza.
Es la documentación normativa: define **qué existe**, **cómo se usa**, y **cómo se cambia**.

## Qué es SoT aquí
- **SoT (normativa):** `/docs` (Markdown versionado con Git)
- **SoT (ejecutable):** Storybook (`/apps/docs`) para ver componentes reales

Regla: si algo no está documentado aquí **y** no existe en Storybook/código, **no existe oficialmente**.

## Para quién es
- Desarrollo (React/Next.js)
- Diseño (UI/UX)
- Agencias externas
- IA de diseño/código (se alimenta con estos archivos)

## Estructura
- `/docs/governance/` → reglas de trabajo (workflow, DoD, versioning)
- `/docs/design-system/` → componentes, tokens, accesibilidad, reglas de contenido
- `/docs/CHANGELOG.md` → cambios del sistema (alto nivel)

## Cómo empezar (rápido)
1. Lee `/docs/governance/workflow.md`
2. Consulta el índice: `/docs/design-system/components.index.md`
3. Para añadir un componente: copia `/docs/design-system/components/_TEMPLATE.md`
