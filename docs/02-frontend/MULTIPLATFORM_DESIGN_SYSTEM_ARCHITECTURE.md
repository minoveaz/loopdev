# Arquitectura del Design System Multiplataforma

**Producto:** LoopDev OS
**Estado:** Propuesta adoptada para la fundación móvil
**Alcance:** Web `loopdev-os` y React Native `loopdev-mobile`

## 1. Propósito

LoopDev mantiene una única intención visual y de producto en todas sus plataformas, pero cada plataforma necesita una implementación adecuada a su runtime. La web usa DOM, Tailwind, Radix UI y `react-dom`; React Native usa `View`, `Text`, `Pressable`, `StyleSheet` y primitives nativas.

Por esta razón, el design system se comparte por contratos y tokens, no copiando componentes web dentro de la aplicación móvil.

## 2. Arquitectura objetivo

```text
ds/packages/
  design-tokens/       valores y nombres semánticos compartidos
  design-contracts/    variantes, estados y contratos visuales compartidos
  ui/                  implementación web
  ui-native/           implementación React Native

apps/loopdev-os     -> @loopdev/ui        -> design-tokens + design-contracts
apps/loopdev-mobile -> @loopdev/ui-native -> design-tokens + design-contracts
```

La introducción será incremental. `@loopdev/ui` se conserva y `loopdev-os` no cambia sus imports actuales durante la primera fase.

## 3. Responsabilidad de cada capa

### `design-tokens`

Define valores semánticos y agnósticos de plataforma:

- colores de canvas, superficies, texto, bordes y estados;
- tipografía y densidad;
- spacing basado en 4px;
- radios y tamaños de interacción;
- motion y duraciones;
- variantes de tema.

Los tokens describen roles, no componentes. Una pantalla no debe inventar un color para un caso concreto si existe un rol semántico equivalente.

### `design-contracts`

Define contratos que deben conservar el mismo significado en web y móvil:

- `BrandLogo`: `full`, `isotype`, `logotype`;
- tonos de `TechnicalIsotype`;
- estados `success`, `warning`, `danger`, `neutral`, `energy`;
- estados de superficie y controles;
- contratos de `SuiteCard`, `SystemStatus` y navegación de suite.

El contrato no prescribe si la implementación usa CSS, `StyleSheet`, Radix o componentes nativos.

### `@loopdev/ui`

Implementación web para `loopdev-os`. Puede usar Tailwind, DOM, Radix UI, `lucide-react` y APIs específicas del navegador.

### `@loopdev/ui-native`

Implementación React Native para `loopdev-mobile`. Debe usar primitives nativas, soportar touch targets, safe areas, teclado, accesibilidad y navegación móvil.

No debe importar componentes web, `react-dom`, Radix UI ni clases Tailwind diseñadas para DOM.

## 4. Mapeo de composición

| Intención | Web | React Native |
| --- | --- | --- |
| Canvas técnico | `TechnicalCanvas` / `BlueprintBackground` | `MobileTechnicalBackground` |
| Superficie | `TechnicalSurface` | `NativeSurface` |
| Identidad | `BrandLogo` | `NativeBrandMark` |
| Indicador técnico | `TechnicalIsotype` | `NativeTechnicalIsotype` |
| Suite | `SuiteCard` | `NativeSuiteCard` |
| Estado | `SystemStatus` / `StatusPulse` | `NativeSystemStatus` |
| Navegación | sidebar / tabs | stack / tabs / bottom sheet |

El nombre de la implementación puede cambiar, pero el rol y la semántica deben permanecer alineados.

## 5. Reglas de composición móvil

- Mobile no es un desktop comprimido.
- El canvas técnico es atmósfera y nunca debe competir con el contenido.
- Las superficies priorizan lectura, contraste y scroll vertical.
- Las acciones primarias deben ser alcanzables con una mano.
- Los menús complejos del desktop se convierten en sheets, drawers o pantallas de selección.
- Hover no se traduce automáticamente a móvil; se reemplaza por pressed, focus, selected o feedback táctil cuando corresponda.
- Sidebar se traduce a navegación inferior, stack, header contextual o selector de suite.
- Las cards conservan contexto, estado y acción, pero no necesariamente la misma densidad ni geometría.

## 6. Compatibilidad y migración

La migración no mueve ni renombra los imports actuales de `loopdev-os`.

```text
Fase 1  añadir paquetes de tokens y contratos
Fase 2  hacer que @loopdev/ui consuma tokens compartidos
Fase 3  crear @loopdev/ui-native
Fase 4  migrar colors.ts móvil a tokens compartidos
Fase 5  migrar componentes web gradualmente, sin cambio masivo
```

Cada fase debe validar typecheck, lint y tests del paquete afectado. La aplicación web debe seguir funcionando después de cada fase.

## 7. Criterio de aceptación

La arquitectura se considera estable cuando:

- web y móvil consumen los mismos roles semánticos;
- ningún componente móvil depende de DOM o Radix;
- `loopdev-os` mantiene sus imports públicos actuales;
- existe una implementación nativa para las primitivas usadas por Login, Launchpad y suite shell;
- el cambio de tema puede expresarse desde tokens sin editar cada pantalla;
- los contratos de identidad y estados tienen el mismo significado en ambas plataformas.
