# Especificación: TechnicalStatusBadge (v1.0)

## 1. Propósito
El `TechnicalStatusBadge` es la firma oficial de estado del sistema. Su misión es encapsular información de salud y operatividad bajo la sintaxis técnica de corchetes `{ }`, proporcionando una validación visual de alta fidelidad.

## 2. Anatomía Visual (High-Precision)
- **Sintaxis:** Siempre envuelto en `{ LABEL }`.
- **Tipografía:** `Inter Bold` o `JetBrains Mono`.
- **Tamaño:** `9px` (`text-micro`).
- **Densidad:** `tracking-widest` (0.1em o 0.2em).
- **Contenedor:**
    - Variante `glass`: Fondo translúcido (alpha 5-10%) con `backdrop-blur`.
    - Borde: 0.5px técnico.
    - Esquinas: `rounded-md` (radio pequeño para look industrial).

## 3. Lógica Reactiva (Severidades)
El componente debe reaccionar cromáticamente a la severidad:
- **`info` / `primary`**: Azul industrial. `{ SYSTEM_ACTIVE }`.
- **`warning`**: Amarillo energía. `{ DEGRADED_STATE }`.
- **`danger`**: Rojo peligro. `{ SYSTEM_CRITICAL }`.
- **`success` / `operational`**: Esmeralda. `{ FULLY_SYNCED }`.
- **`neutral`**: Gris pizarra. `{ STANDBY }`.

## 4. Comportamiento Dinámico
- **`withPulse`**: Opción para incluir un `StatusPulse` interno a la izquierda del texto.
- **Micro-interacción:** Animación de barrido (shimmer) sutil cada 5-10 segundos para indicar que el sensor está activo.

## 5. Criterios de Aceptación
- [ ] Renderizado perfecto de los corchetes `{ }`.
- [ ] Soporte multi-tema (Light/Dark).
- [ ] Reactividad total a los tokens de severidad.
- [ ] Exportado como átomo oficial en `atoms/indicators`.
