# Especificación: Suite Home System (v2.1)

## 1. Concepto: El Chasis de Activación
`SuiteHomeLayout` no es una landing, es un **Panel de Control Arquitectónico**. Su diseño se basa en la separación de:
- **Columna Principal (8-9 cols):** Trabajo y Acción.
- **Columna Secundaria (3-4 cols):** Conciencia del Sistema y Memoria.

## 2. Grid Lógico y Responsividad
- **Desktop XL (≥1440px):** 12 columnas. Columna principal + Lateral derecha (Timeline).
- **Desktop/Tablet (1024px - 1439px):** 12/8 columnas. Timeline se mueve al final (bloque horizontal).
- **Mobile (<1024px):** 1 columna. Command List style. Timeline en modo Accordion.

## 3. Bloques del Layout (Jerarquía Visual)

### [A] Hero (Orientación) - 96px a 120px
- Saludo industrial, isotipo de suite y línea de contexto dinámica.
- **Visual:** Aireado, sin ruido, `BlueprintBackground` sutil.

### [B] System Notices (Gobernanza)
- Barra delgada de alertas críticas entre el Hero y la Acción.

### [C] Activation Layer (Acción y Control)
- **QuickStart:** Fila de tarjetas pequeñas, bordes 0.5px, alta clicabilidad.
- **Insights:** Métricas grandes con `StatusPulse` integrado para mostrar "vida".

### [D] Module Grid (Navegación)
- Tarjetas medianas con **CTA Explícito** (Continuar | Abrir | Configurar) y telemetría de estado.

### [E] Activity Timeline (Memoria)
- Tipografía `JetBrains Mono`, ultra-compacto.
- Tres modos de renderizado según breakpoint (Lateral | Final | Accordion).

## 4. Criterios de Aceptación
- [ ] Implementar Grid System 12/8/1.
- [ ] Timeline con lógica de reposicionamiento dinámico.
- [ ] Cards de QuickStart con efecto hover "Glow Azul".
- [ ] 100% de cumplimiento con el ADN v3.9 (Gris carbón #181b21, Bordes 0.5px).
