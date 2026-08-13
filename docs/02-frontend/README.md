# 02-Frontend Documentation Index

Documentación técnica para el desarrollo frontend en el ecosistema LoopDev.

---

## 📚 Documentos Principales

### 🎯 Composición y Arquitectura

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| [COMPONENT_COMPOSITION_PROTOCOL.md](./COMPONENT_COMPOSITION_PROTOCOL.md) | Protocolo único para construir componentes (DoR/DoD) | ✅ Activo |
| [COMPONENT_WORKFLOW.md](./COMPONENT_WORKFLOW.md) | Gestión ágil y persistencia de datos | ✅ Activo |
| [LAYOUT_SYSTEM.md](./LAYOUT_SYSTEM.md) | Sistema de layouts y composición espacial | ✅ Activo |

### 🎨 Design System

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| **[DESIGN_TOKENS_USAGE.md](./DESIGN_TOKENS_USAGE.md)** | **Guía completa de uso de tokens (REQUERIDO)** | ✅ Activo |
| [VISUAL_COMPOSITION_SYSTEM.md](../01-foundations/VISUAL_COMPOSITION_SYSTEM.md) | Fundamentos visuales v3.8 | ✅ Activo |

### 🧪 Calidad y Testing

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| [COMPONENT_TESTING_PROTOCOL.md](./COMPONENT_TESTING_PROTOCOL.md) | Suite de pruebas con Vitest y RTL | ✅ Activo |
| [UI_COMPLEX_READINESS_CHECKLIST.md](./UI_COMPLEX_READINESS_CHECKLIST.md) | Checklist de componentes complejos | ✅ Activo |

### Registro canónico

El registro global de componentes frontend se mantiene en
[docs/registries/frontend-components.json](../registries/frontend-components.json).
Este directorio ya no debe crear un registro paralelo.

---

## 🚦 Flujo de Trabajo: Nueva Página

Para crear una nueva página en el ecosistema, sigue este orden:

### 1. **Leer Fundamentos** ⚠️ OBLIGATORIO

1. [VISUAL_COMPOSITION_SYSTEM.md](../01-foundations/VISUAL_COMPOSITION_SYSTEM.md) - Principios visuales
2. **[DESIGN_TOKENS_USAGE.md](./DESIGN_TOKENS_USAGE.md) - Uso correcto de tokens**

### 2. **Desarrollo**

1. Crear estructura de componentes siguiendo [COMPONENT_COMPOSITION_PROTOCOL.md](./COMPONENT_COMPOSITION_PROTOCOL.md)
2. Usar tokens según [DESIGN_TOKENS_USAGE.md](./DESIGN_TOKENS_USAGE.md)
3. Aplicar layout según [LAYOUT_SYSTEM.md](./LAYOUT_SYSTEM.md)

### 3. **Validación**

```bash
# Validar que los tokens están correctos
pnpm validate:tokens

# Ejecutar tests
pnpm test

# Verificar tipos
pnpm typecheck
```

### 4. **Certificación**

Seguir [UI_COMPLEX_READINESS_CHECKLIST.md](./UI_COMPLEX_READINESS_CHECKLIST.md) si el componente es complejo.

---

## 🎯 Quick Reference: Composición de Páginas

### ✅ Checklist Básica

Antes de considerar una página "completa":

- [ ] Importa componentes de `@loopdev/ui` (Text, Heading, Button, etc.)
- [ ] Usa props `size` en lugar de clases `text-*` nativas
- [ ] Todos los colores vienen de tokens (`text-primary`, `bg-surface-dark`)
- [ ] Espaciados usan `p-lpd-space-*` o `m-lpd-space-*`
- [ ] Border radius usa `rounded-lpd-*`
- [ ] **NO** hay valores hex hardcodeados (`#135bec`)
- [ ] **NO** hay valores px hardcodeados (`text-[24px]`)
- [ ] Ejecutó `pnpm validate:tokens` sin errores

### 🎨 Tokens Más Usados

#### Tipografía
```tsx
import { Text, Heading } from '@loopdev/ui';

<Heading size="2xl" weight="bold">
<Text size="sm" weight="normal" className="text-text-muted">
```

#### Colores
```tsx
className="text-primary bg-surface-dark border-border-subtle"
```

#### Espaciado
```tsx
className="p-lpd-space-6 gap-lpd-space-4"
```

---

## 📦 Herramientas y Scripts

### Validación Automática

```bash
# Validar sincronización de tokens
pnpm validate:tokens

# Ver errores de compilación
pnpm typecheck

# Ejecutar tests
pnpm test
```

### Storybook (Design System)

```bash
# Iniciar Storybook
pnpm ds:dev

# Ver en: http://localhost:6006
```

---

## 🔗 Enlaces Externos

- [Storybook Local](http://localhost:6006) - Explorar componentes
- [Figma Design System](https://figma.com/loopdev) - Diseños fuente
- [GitHub Monorepo](https://github.com/minoveaz/loopdev)

---

## 📖 Documentación Relacionada

### Otras Secciones

- [01-foundations/](../01-foundations/) - Arquitectura y fundamentos
- [03-platform/](../03-platform/) - Infraestructura y APIs
- [04-governance/](../04-governance/) - Auditorías y certificación
- [05-operations/](../05-operations/) - Operaciones y deployment
- [06-product/](../06-product/) - Especificaciones de producto

---

**Mantenedor:** Frontend Platform Team  
**Última actualización:** Enero 4, 2026  
**Próxima revisión:** Marzo 2026
