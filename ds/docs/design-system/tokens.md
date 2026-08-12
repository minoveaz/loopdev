# Tokens del Design System

Los tokens de LoopDev deben expresar roles semánticos y poder ser consumidos por más de una plataforma. La implementación web y la implementación React Native comparten nombres y significado, aunque puedan transformar los valores a CSS variables, Tailwind o `StyleSheet`.

## Paquetes

```text
design-tokens       valores semánticos compartidos
design-contracts    estados y variantes compartidos
@loopdev/ui         implementación web
@loopdev/ui-native  implementación React Native
```

## Roles mínimos

```ts
type SemanticColorRole =
  | 'canvas'
  | 'surface'
  | 'surfaceElevated'
  | 'text'
  | 'textMuted'
  | 'primary'
  | 'energy'
  | 'success'
  | 'warning'
  | 'danger'
  | 'border'
  | 'inverse';
```

Los componentes no deben depender de nombres de componentes web ni de valores HEX locales. `primary` conserva la función de acción y foco técnico; `energy` comunica actividad, preparación o señal viva; los estados restantes comunican feedback operacional.

## Regla multiplataforma

```text
loopdev-os     -> @loopdev/ui        -> tokens/contracts
loopdev-mobile -> @loopdev/ui-native -> tokens/contracts
```

La documentación de composición y migración está en `docs/02-frontend/MULTIPLATFORM_DESIGN_SYSTEM_ARCHITECTURE.md`.
