# Design Tokens Usage Guide

**Version:** 1.0  
**Status:** Active / Production Ready  
**Owner:** Design Systems Team  
**Last Updated:** January 4, 2026

---

## 🎯 Propósito

Este documento establece las **reglas obligatorias** para el uso de Design Tokens en la composición de páginas y componentes en el ecosistema LoopDev.

> **Regla de Oro:** Ningún valor visual debe estar hardcodeado. Todo debe derivar de tokens del Design System.

---

## 📦 Sistema de Tokens

### Ubicación (Single Source of Truth)

```
ds/packages/tokens/src/
├── foundations/
│   ├── typography.css    ← Tamaños, pesos, familias
│   ├── color.css         ← Paleta completa
│   ├── spacing.css       ← Sistema de espaciado
│   ├── radius.css        ← Border radius
│   ├── elevation.css     ← Sombras y profundidad
│   └── motion.css        ← Duraciones y timings
└── css/
    ├── base.css          ← Tokens semánticos base
    └── theme-*.css       ← Temas específicos por cliente
```

---

## 🔤 Tokens Tipográficos

### Escala Disponible

| Token | Variable CSS | Valor | Uso Recomendado |
|-------|-------------|-------|-----------------|
| `nano` | `--lpd-font-size-nano` | 9px | Labels micro, badges industriales |
| `xs` | `--lpd-font-size-xs` | 12px | Metadata, captions, timestamps |
| `sm` | `--lpd-font-size-sm` | 14px | Body secundario, helper text |
| `base` | `--lpd-font-size-base` | 16px | Body principal, párrafos |
| `lg` | `--lpd-font-size-lg` | 18px | Body destacado, intro text |
| `xl` | `--lpd-font-size-xl` | 20px | Subtítulos pequeños |
| `2xl` | `--lpd-font-size-2xl` | 24px | Títulos de sección (h2) |
| `3xl` | `--lpd-font-size-3xl` | 30px | Títulos principales (h1) |
| `4xl` | `--lpd-font-size-4xl` | 36px | Hero headings |
| `5xl` | `--lpd-font-size-5xl` | 48px | Display grande |
| `6xl` | `--lpd-font-size-6xl` | 60px | Marketing hero |
| `7xl` | `--lpd-font-size-7xl` | 72px | Landing pages |

### Pesos Tipográficos

| Token | Variable CSS | Valor | Uso |
|-------|-------------|-------|-----|
| `normal` | `--lpd-font-weight-normal` | 400 | Texto normal |
| `medium` | `--lpd-font-weight-medium` | 500 | Énfasis suave |
| `semibold` | `--lpd-font-weight-semibold` | 600 | Labels, botones |
| `bold` | `--lpd-font-weight-bold` | 700 | Títulos, énfasis fuerte |
| `black` | `--lpd-font-weight-black` | 900 | Display, branding |

### Familias Tipográficas

```css
--lpd-font-sans: 'Inter', system-ui, sans-serif;
--lpd-font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

---

## 🎨 Tokens de Color

### Colores Estructurales

```css
/* Primarios */
--lpd-color-brand-primary: #135BEC;
--lpd-color-brand-secondary: #4b5563;
--lpd-color-brand-energy: #FFD025;

/* Superficies */
--lpd-color-bg-base: #f8f9fc;
--lpd-color-bg-surface: #ffffff;
--lpd-color-brand-surface: #181b21; /* dark mode */

/* Texto */
--lpd-color-text-base: #0f172a;
--lpd-color-text-muted: #64748b;
--lpd-color-text-on-primary: #ffffff;
```

### Estados Semánticos

```css
--lpd-color-status-success: #10B981;
--lpd-color-status-error: #EF4444;
--lpd-color-status-warning: #FFD025;
--lpd-color-status-info: #3b82f6;
```

### Borders

```css
--lpd-color-border-subtle: #e2e8f0;
--lpd-color-brand-outline: #e2e8f0;
```

---

## 📏 Tokens de Espaciado

```css
--lpd-space-1: 0.25rem;  /* 4px */
--lpd-space-2: 0.5rem;   /* 8px */
--lpd-space-3: 0.75rem;  /* 12px */
--lpd-space-4: 1rem;     /* 16px */
--lpd-space-5: 1.25rem;  /* 20px */
--lpd-space-6: 1.5rem;   /* 24px */
--lpd-space-8: 2rem;     /* 32px */
--lpd-space-10: 2.5rem;  /* 40px */
--lpd-space-12: 3rem;    /* 48px */
```

---

## 🔲 Border Radius

```css
--lpd-radius-sm: 0.25rem;   /* 4px */
--lpd-radius-md: 0.375rem;  /* 6px */
--lpd-radius-lg: 0.5rem;    /* 8px */
--lpd-radius-xl: 0.75rem;   /* 12px */
--lpd-radius-2xl: 1rem;     /* 16px */
--lpd-radius-3xl: 1.5rem;   /* 24px */
--lpd-radius-full: 9999px;
```

---

## ⚡ Uso en Componentes

### ✅ CORRECTO - Usando componentes del DS

```tsx
import { Text, Heading } from '@loopdev/ui';

export default function MyPage() {
  return (
    <div>
      <Heading size="2xl" weight="bold" className="text-white">
        Welcome to LoopDev
      </Heading>
      
      <Text size="sm" weight="normal" className="text-text-muted">
        Your industrial operating system
      </Text>
    </div>
  );
}
```

### ✅ CORRECTO - Usando clases de Tailwind con tokens

```tsx
export default function MyPage() {
  return (
    <div className="bg-surface-dark p-lpd-space-6 rounded-lpd-lg">
      <h1 className="text-lpd-2xl font-bold text-primary">
        Dashboard
      </h1>
      
      <p className="text-lpd-sm text-text-muted mt-lpd-space-2">
        Overview of your data
      </p>
    </div>
  );
}
```

### ✅ CORRECTO - Usando variables CSS directamente

```tsx
export default function CustomComponent() {
  return (
    <div style={{
      fontSize: 'var(--lpd-font-size-base)',
      color: 'var(--lpd-color-text-base)',
      padding: 'var(--lpd-space-4)',
      borderRadius: 'var(--lpd-radius-md)'
    }}>
      Custom styled element
    </div>
  );
}
```

### ❌ INCORRECTO - Valores hardcodeados

```tsx
// ❌ NO HACER ESTO
export default function BadPage() {
  return (
    <div className="bg-[#181b21] p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-[#135bec]">
        Dashboard
      </h1>
      
      <p className="text-sm text-gray-500 mt-2">
        Overview of your data
      </p>
    </div>
  );
}
```

---

## 📋 Checklist: Nueva Página

Antes de crear una página nueva, verifica:

- [ ] Importas `Text` y `Heading` de `@loopdev/ui`
- [ ] Usas `size` props en lugar de clases `text-*` nativas de Tailwind
- [ ] Los colores vienen de tokens: `text-primary`, `bg-surface-dark`, etc.
- [ ] Los espaciados usan `p-lpd-space-*` o `m-lpd-space-*`
- [ ] Los border radius usan `rounded-lpd-*`
- [ ] NO hay valores hex hardcodeados (`#135bec`)
- [ ] NO hay valores de px hardcodeados (`text-[24px]`)
- [ ] NO hay magic numbers en paddings/margins

---

## 🔧 TypeScript Support

Los componentes del DS tienen tipos estrictos:

```typescript
import type { TypographySize, TypographyWeight } from '@loopdev/ui';

// Solo acepta valores válidos
const size: TypographySize = '2xl'; // ✅
const size: TypographySize = 'xxxl'; // ❌ Error en compilación

const weight: TypographyWeight = 'bold'; // ✅
const weight: TypographyWeight = 'extra-bold'; // ❌ Error
```

---

## 🚨 Validación Automática

### Script de Validación

Ejecuta antes de cada commit:

```bash
pnpm validate:tokens
```

Este script verifica que:
1. Los tokens CSS estén definidos
2. Las clases de Tailwind coincidan
3. Los tipos de TypeScript estén sincronizados
4. No haya clases huérfanas en `cn.ts`

### Pre-commit Hook

Añade en `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm validate:tokens || {
  echo "❌ Token validation failed. Fix sync issues before committing."
  exit 1
}
```

---

## 📚 Recursos Relacionados

- [COMPONENT_COMPOSITION_PROTOCOL.md](./COMPONENT_COMPOSITION_PROTOCOL.md)
- [VISUAL_COMPOSITION_SYSTEM.md](../01-foundations/VISUAL_COMPOSITION_SYSTEM.md)
- [Storybook - Foundations/Typography](http://localhost:6006/?path=/docs/foundations-typography--docs)

---

## 🔄 Añadir Nuevos Tokens

Si necesitas añadir un nuevo tamaño tipográfico:

### 1. Actualiza `typography.css`

```css
/* ds/packages/tokens/src/foundations/typography.css */
--lpd-font-size-nuevo: 1.375rem; /* 22px */
```

### 2. Actualiza `tailwind.preset.js`

```javascript
// ds/packages/tailwind-config/tailwind.preset.js
fontSize: {
  // ... existing
  'lpd-nuevo': 'var(--lpd-font-size-nuevo)',
},
safelist: [
  // ... existing
  'text-lpd-nuevo',
]
```

### 3. Actualiza `cn.ts`

```typescript
// ds/packages/ui/src/helpers/cn.ts
classGroups: {
  'font-size': [
    // ... existing
    'text-lpd-nuevo',
  ],
}
```

### 4. Actualiza `types.ts`

```typescript
// ds/packages/ui/src/components/atoms/Typography/types.ts
export type TypographySize = 
  | 'nano'
  // ... existing
  | 'nuevo';  // 22px
```

### 5. Valida

```bash
pnpm validate:tokens
```

---

**Última actualización:** 4 de enero, 2026  
**Próxima revisión:** Trimestral o cuando se añadan nuevos tokens
