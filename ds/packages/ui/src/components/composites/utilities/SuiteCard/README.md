# SuiteCard (Selector de Suite)

El `SuiteCard` es un componente compuesto diseñado para el **Launchpad** de LoopDev OS. Sirve como punto de entrada principal para los diferentes entornos de trabajo (Marketing, CRM, Finance).

## Características
- **Identidad Técnica:** Integra el `EngineeringSeal` para mostrar la versión y estado.
- **Textura de Ingeniería:** Fondo con micro-grilla de blueprint reactiva.
- **Multitenant Ready:** Completamente basado en tokens semánticos de LoopDev.
- **Estado de Bloqueo:** Soporte para suites en desarrollo (`isLocked`).

## Uso
```tsx
import { SuiteCard, UIKitIllustration } from '@loopdev/ui';

<SuiteCard
  title="Marketing Studio"
  description="Gestión de marca y contenido generativo."
  illustration={<UIKitIllustration />}
  version="1.0.4"
  href="/marketing-studio"
/>
```

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `title` | `string` | Nombre de la suite. |
| `description` | `string` | Texto descriptivo. |
| `illustration` | `ReactNode` | Ilustración central. |
| `version` | `string` | Versión técnica. |
| `href` | `string` | Link de destino. |
| `isLocked` | `boolean` | Deshabilita el acceso. |
