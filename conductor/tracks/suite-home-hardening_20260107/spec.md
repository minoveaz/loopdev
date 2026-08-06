# Especificación: Suite Home Hardening (v3.9)

## 1. El Concepto: "Mission Control Chassis"
`SuiteHomeLayout` evoluciona de ser una "página" a un **motor de activación agnóstico**. Su misión es orquestar la entrada a cualquier suite (Marketing, CRM, Finance) bajo una jerarquía inmutable:
`Orientación → Acción → Estado → Navegación → Memoria`

## 2. Los Nuevos Cimientos (Átomos)

### [A] TechnicalCard
- **Propósito:** Contenedor universal para toda la suite.
- **ADN:** `rounded-2xl`, borde 0.5px (`border-border-technical`), fondo `bg-surface-elevated`.
- **Interacción:** Variante `interactive` con efecto "Glow Azul" y `scale(1.01)` en hover.

### [B] TechnicalIsotype
- **Propósito:** Ancla visual de identidad de cada suite.
- **Visual:** Icono lineal envuelto en un doble anillo técnico (círculos concéntricos ultra-finos).

## 3. Refactor de Bloques Estructurales

### [Hero] Orientación & Identidad
- **Refactor:** Título en `Inter Medium` + `TechnicalIsotype` a la izquierda.
- **Contexto:** Línea `// Working on: X` forzada en `JetBrains Mono`.

### [Notices] Gobernanza Suave
- **Propósito:** Alertas no intrusivas sobre límites de sistema (Créditos, Assets).
- **Visual:** Barra delgada entre Hero y el contenido de acción.

### [QuickStart] La Zona de Acción (Launcher)
- **Refactor:** Tarjetas compactas (`64-80px`), cuadrados técnicos con iconos protagonistas.
- **Acción:** Acceso directo a flujos de creación (arranque en frío).

### [Insights] Telemetría Ejecutiva
- **Refactor:** Métricas con look de instrumento de medida.
- **Datos:** Tags de estado (`[ LIVE ]`, `[ STALE ]`) y tendencias coloreadas.

### [Activity] Memoria Operativa
- **Propósito:** Registrar eventos recientes sin interferir con la acción (background awareness).
- **Visual:** Alta densidad, bajo contraste, tipografía monoespaciada (`JetBrains Mono`).
- **Rol:** Permitir continuidad ("retomar donde lo dejé").

## 4. Estados Soportados del SuiteHomeLayout
El layout debe adaptarse visual y funcionalmente a cada estado:
- **`empty`**: Suite recién creada (priorizar onboarding/CTA).
- **`active`**: Uso normal.
- **`degraded`**: Límites alcanzados o errores parciales.
- **`read-only`**: Restricción de permisos.
- **`loading`**: Telemetría asíncrona en proceso.

## 5. Criterios de Aceptación
- [ ] 100% de las cajas del layout usan `TechnicalCard`.
- [ ] Los iconos de suite usan `TechnicalIsotype`.
- [ ] El grid respeta la jerarquía 8/4 (XL) y 12/8 (Std).
- [ ] El layout cambia su renderizado según el estado global definido en el contrato.