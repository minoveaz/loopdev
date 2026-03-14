# Input (Primitive)

**Description:** Sensor de datos industrial con validación, iconos y soporte multi-tenant. Es la base de la capa de entrada de datos (Phase 3: Forms) de la plataforma LoopDev, diseñado para resistir escenarios de estrés visual y funcional.

## 🎨 Adaptabilidad & Dynamic Theming
El componente es 100% agnóstico al color, consumiendo exclusivamente variables de CSS del sistema de tokens. Esto garantiza el **Aislamiento de Marca (Branding Isolation)** en entornos multi-tenant.

### Variables de Componente (CSS Tokens)
- `--lpd-color-brand-primary`: Color de foco y spinner (mapeado a la DB del tenant).
- `--lpd-color-error`: Color para estados de validación fallida y mensajes de error.
- Fondo dinámico según variante y modo (Light/Dark).

## ✨ Características
- **Variantes:** `outline` (Default), `filled` (Buscadores), `ghost` (Baja prioridad).
- **ADN Visual:** Feedback de carga con sintaxis técnica mediante brackets `{ }` y spinner industrial.
- **Seguridad:** Soporte nativo para campos de contraseña con toggle de visibilidad integrado.
- **Composición:** Soporte para iconos de inicio (`startIcon`) y fin (`endIcon`).
- **Accesibilidad:** Vinculación semántica completa (`htmlFor`, `aria-describedby`, `aria-invalid`).
- **Resiliencia:** Probado contra desbordamientos de texto (Narrative Overload).

## 🚀 Uso Profesional
```tsx
import { Input } from '@loopdev/ui';

// Buscador Industrial (Variante Filled)
<Input 
  variant="filled"
  placeholder="Buscar sensor..." 
  startIcon={<Search size={18} />} 
/>

// Campo de Seguridad con Error
<Input 
  label="Contraseña"
  type="password"
  error="Contraseña demasiado débil"
  helperText="Mínimo 8 caracteres"
/>

// Estado de Carga (Validación Asíncrona)
<Input 
  label="Username" 
  isLoading 
  defaultValue="admin_root" 
/>
```

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `label` | `string` | - | Etiqueta descriptiva superior. |
| `variant` | `'outline'\|'filled'\|'ghost'` | `'outline'` | Estilo visual del campo. |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Escala del componente. |
| `startIcon` | `ReactNode` | - | Icono al inicio del input. |
| `endIcon` | `ReactNode` | - | Icono al final del input. |
| `isLoading` | `boolean` | `false` | Muestra el spinner técnico `{ progress_activity }`. |
| `error` | `string | { message: string }` | - | Mensaje de error (activa estado rojo). |
| `helperText` | `string` | - | Texto informativo inferior. |
| `fullWidth` | `boolean` | `true` | Expande al 100% del contenedor. |

## 🛡️ Certificación & Calidad
### Estatus: **Front_Certified 🔵** | **Infra_Certified 🔵**
Este componente ha superado las auditorías de gobernanza v1.2 y v1.1.

### Testing (Vitest)
Suite automatizada que valida:
- US-01 a US-05 (Accesibilidad, Feedback, Composición, Variantes y Branding).
- Limpieza de props para evitar fugas al DOM.
- Sincronización con contratos de error de la API.

---
*Certificado para Fase 3 — Producción LoopSaaS*
