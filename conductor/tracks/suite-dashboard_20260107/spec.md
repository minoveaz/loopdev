# Especificación: Suite Home System (v2.0)

## 1. Concepto: SuiteHome vs SuiteDashboard
`SuiteHomeLayout` es el chasis de Nivel 2.5. Su misión es la **activación**. No es un lugar para análisis profundo, sino para confirmar orientación, realizar acciones rápidas y dar continuidad al trabajo.

## 2. Componentes del Chasis (Agnóstico)

### [A] Hero & Notices
- **`SuiteHomeHero`**: Saludo industrial + Isotipo de Suite.
- **`SuiteHomeNotices`**: Barra de gobernanza sutil. Alertas de sistema (ej: "8 assets sin clasificar", "IA Credits: 5%").

### [B] Activation Layer (Prioridad Dinámica)
- **`SuiteHomeQuickStart`**: Fila de cards de acción. Prioridad #1 para usuarios nuevos.
- **`SuiteHomeInsights`**: Cards de métricas rápidas. Prioridad #1 para usuarios recurrentes.

### [C] Module Grid (Telemetry Driven)
- **`SuiteHomeModules`**: Entry points con:
    - Estado real: `{ OK | DEPLOYING | LOCKED }`.
    - CTA Contextual: "Continuar" vs "Configurar".

### [D] Activity Feed (Responsive Timeline)
- **`SuiteHomeActivity`**: 
    - Desktop XL: Columna derecha.
    - Desktop/Tablet: Bloque inferior.
    - Mobile: Accordion colapsable.

## 3. Arquitectura de Implementación
1. **DS Template:** `src/components/composites/workspace/SuiteHomeLayout/`
2. **Suite Config:** `apps/loopdev-os/src/suites/[suite-name]/home.config.ts`

## 4. Criterios de Aceptación
- [ ] Implementar el motor de intercambio de prioridad entre QuickStart e Insights.
- [ ] Implementar el modo 3-way de la línea de tiempo.
- [ ] La página `/marketing-studio` debe ser puramente configurativa (sin lógica de layout).