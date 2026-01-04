# Scripts Utilities

Herramientas de automatización y validación para el monorepo LoopDev.

---

## 📋 Scripts Disponibles

### `validate-tokens-sync.js`

**Propósito:** Validar que los Design Tokens tipográficos estén sincronizados en todos los puntos del sistema.

**Uso:**
```bash
# Desde la raíz del monorepo
pnpm validate:tokens

# Directamente
node scripts/validate-tokens-sync.js
```

**Validaciones:**
1. ✅ CSS Variables están definidas en `typography.css`
2. ✅ Tailwind fontSize config incluye todos los tokens
3. ✅ Tailwind safelist protege todas las clases
4. ✅ tailwind-merge reconoce las clases personalizadas
5. ✅ TypeScript types reflejan todos los tamaños

**Salida:**
- ✅ Exit code 0 si todo está sincronizado
- ❌ Exit code 1 si hay desincronización (bloquea commits)

**Ejemplo:**
```
🔍 Validando sincronización de tokens tipográficos...

📦 Source of Truth (typography.css):
   2xl, 3xl, 4xl, 5xl, 6xl, 7xl, base, lg, nano, sm, xl, xs

✅ Tailwind fontSize: Sincronizado
✅ Tailwind safelist: Sincronizado
✅ cn.ts classGroups: Sincronizado
✅ TypeScript types: Sincronizado

✅ Todos los tokens están sincronizados correctamente
```

---

## 🔧 Configuración de CI/CD

### Pre-commit Hook

Añadir en `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validar tokens antes de commit
pnpm validate:tokens || {
  echo "❌ Token validation failed. Fix sync issues before committing."
  exit 1
}
```

### GitHub Actions

```yaml
name: Validate Design System

on: [push, pull_request]

jobs:
  validate-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Validate tokens sync
        run: pnpm validate:tokens
```

---

## 📚 Documentación Relacionada

- [DESIGN_TOKENS_USAGE.md](../docs/02-frontend/DESIGN_TOKENS_USAGE.md) - Guía de uso de tokens
- [COMPONENT_COMPOSITION_PROTOCOL.md](../docs/02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md) - Protocolo de composición

---

## 🚀 Crear Nuevo Script

### Template básico

```javascript
#!/usr/bin/env node

/**
 * Script Name
 * ===========
 * 
 * Descripción breve del propósito
 * 
 * Uso:
 *   node scripts/nombre-script.js [args]
 *   pnpm script:nombre
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Lógica del script
function main() {
  console.log(chalk.cyan('🚀 Iniciando script...'));
  
  try {
    // Tu código aquí
    console.log(chalk.green('✅ Script completado'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

main();
```

### Añadir al package.json

```json
{
  "scripts": {
    "script:nombre": "node scripts/nombre-script.js"
  }
}
```

---

**Mantenedor:** Design Systems Team  
**Última actualización:** Enero 4, 2026
