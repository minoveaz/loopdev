# 🎨 Guía de Uso de Design Tokens — loop.dev

> **Versión:** 1.0 (Lab Standard)
> **Objetivo:** Estandarizar el consumo de tokens visuales para garantizar coherencia multi-tenant y soporte total de temas (Light/Dark).

---

## 1. Estrategia de Temas: "Zero Prefixes"

A partir de la versión v3.9, LoopDev OS favorece el uso de **Variables Semánticas Dinámicas**. En lugar de usar prefijos condicionales de Tailwind (`dark:bg-black`), los componentes deben consumir tokens que cambian su valor automáticamente en el CSS raíz.

### Tokens de Chasis (Shell)
| Token | Variable CSS | Uso |
| :--- | :--- | :--- |
| `bg-shell-canvas` | `--lpd-shell-canvas` | Fondo base para Sidebar y Header. |
| `bg-shell-surface` | `--lpd-shell-surface` | Fondo para tarjetas y secciones del shell. |
| `border-border-technical` | `--lpd-color-border-technical` | Borde de 0.5px para alta definición. |

---

## 2. Superficies de Alta Fidelidad (Elevación)

Para componentes que deben destacar sobre el fondo (como Dropdowns y Modales), se debe usar la escala de superficie elevada:

- **Token:** `bg-surface-elevated`
- **Valor (Dark):** `#181b21` (Gris Carbón Premium)
- **Efecto:** Sólido por defecto para maximizar el contraste.

```tsx
// ✅ Correcto (Industrial Standard)
<div className="bg-surface-elevated border-border-technical shadow-2xl">
  Contenido Elevado
</div>
```

---

## 3. Tipografía de Precisión (Densidad)

El sistema utiliza niveles de densidad específicos para interfaces de herramientas:

| Nivel | Clase Tailwind | Tamaño | Uso |
| :--- | :--- | :--- | :--- |
| **Technical** | `text-technical` | 10px | Descripciones densas, títulos de grupo. |
| **Micro** | `text-micro` | 9px | Timestamps, metadatos, estados. |
| **Nano** | `text-nano` | 8px | Brackets, etiquetas extremas. |

---

## 4. Colores de Innovación (IA)

Cualquier funcionalidad potenciada por Inteligencia Artificial debe usar la familia de innovación:

- **Primary:** `bg-innovation-purple` (#9333EA)
- **Soft:** `bg-innovation-soft-purple` (Opacidad 10%)
- **Momentum:** `StatusPulse variant="innovation"`

---

## 5. Reglas de Oro para Desarrolladores

1.  **Nunca usar Hexadecimales:** Si un color no está en un token, solicítalo al equipo de arquitectura.
2.  **Bordes de 0.5px:** Usa siempre `border-border-technical` para separadores internos.
3.  **Fuentes Mono:** Usa `font-mono` (JetBrains) solo para datos técnicos (IDs, Fechas, Comandos).
4.  **Inert Mode:** Los componentes del header deben responder a la prop `isInert` reduciendo su feedback visual.

---
*Gobernanza de Frontend - LoopDev Engineering Board*