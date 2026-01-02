# 🏗️ Module: Architect (`mod-architect`)

> **DesignOps tool** para auditar y migrar componentes heredados (Blueprints) hacia el LoopDev Design System.

## 🎯 Propósito
Este módulo permite a los ingenieros de LoopDev visualizar componentes provenientes de maquetas o código antiguo (`mock-loopdev`) en un entorno aislado y compararlos contra los estándares del Design System.

## 🏗️ Arquitectura (Workbench Pattern)
Este módulo sigue estrictamente el patrón de tres capas definido en el `IMPLEMENTATION_GUIDE.md`:

1.  **Shell (`ArchitectShell`):** Provee el fondo técnico (`TechnicalBackground`) y la atmósfera de ingeniería.
2.  **Coordinator (`ArchitectDashboard`):** Orquesta los hooks de datos y distribuye la información.
3.  **Domain Components:** 
    - `ArchitectHeader`: Identidad y estado del sistema.
    - `ArchitectStats`: KPIs de progreso de migración.
    - `BlueprintCanvas`: Sandbox aislado mediante Iframes para visualización.
    - `AuditReportView`: Reporte detallado de discrepancias técnicas.

## 🛠️ Desarrollo

### Brain (Hooks)
- `useArchitectRegistry`: Gestiona el inventario de componentes disponibles.
- `useArchitectAudit`: Ejecuta la lógica de análisis sobre un componente específico.

### Body (UI)
Los componentes viven en `src/components/` y son puramente visuales, consumiendo `@loopdev/ui`.

## 📋 Roadmap del Módulo
- [x] Refactorización a Workbench Pattern.
- [ ] Implementación de `BlueprintIndexer` (lectura dinámica de mocks).
- [ ] Motor de transformación asistido por IA.
- [ ] Exportación automática a paquetes de la Capa 1.
