# Changelog — Design System (SoT)

Este changelog registra cambios relevantes del sistema de componentes (documentación, tokens, patrones y gobernanza).

## Unreleased

### Architecture & Engineering
- **[Migración UI Core]** Implementación de arquitectura basada en **Radix UI + shadcn/ui** en `@loopdev/ui`.
  - **Polimorfismo:** El componente `Button` ahora soporta `asChild` mediante `@radix-ui/react-slot`, permitiendo renderizado semántico flexible (ej. funcionar como `<a>` o `Link` manteniendo estilos).
  - **Gestión de Estilos:** Refactorización de la utilidad `cn()` para integrar `clsx` + `tailwind-merge`, garantizando la correcta fusión de clases de Tailwind sin conflictos de especificidad.
  - **Variantes Tipadas:** Implementación de `class-variance-authority` (CVA) para definir variantes de componentes (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) con tipado estricto.
  - **Fix Build:** Corrección de la configuración de TypeScript (`tsconfig.json`) en `apps/docs` para permitir *Hot-Reloading* directo desde el código fuente (`src`) de los paquetes sin pasos de compilación intermedios.

## v0.1.0
- Initial documentation structure created:
  - governance workflow + DoD
  - component template + index
