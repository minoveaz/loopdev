# Especificación: System Notice Rail (v1.0)

## 1. Propósito
El `SystemNoticeRail` es un componente de infraestructura diseñado para la **Gobernanza Operativa**. Proporciona avisos accionables y no bloqueantes sobre el estado del sistema, límites de uso o necesidades de mantenimiento.

## 2. Anatomía Visual (Industrial Grade)
- **Altura Base:** 40px (Compact Mode).
- **Contenedor:**
    - Fondo con Alpha (6-10%) para permitir visibilidad de la grilla inferior.
    - Borde técnico de 0.5px (`border-border-technical`).
    - Esquinas: `rounded-xl`.
    - Sin sombras "soft"; solo bordes definidos y glow sutil.
- **Jerarquía Interna:**
    - `SeverityDot/Icon` → `Title` → `Description` (Opcional) → `Actions` → `Dismiss`.

## 3. Lógica de Sistema (Agnóstica)
- **Severidades:** `danger`, `warning`, `info`, `success`.
- **Ámbitos (Scope):** `system`, `suite`, `module`, `integration`.
- **Priorización:** El rail ordena automáticamente los avisos por severidad (`danger > warning > info`).
- **Visibilidad:** Máximo 1 aviso visible por defecto (expandible mediante popover/drawer).

## 4. Comportamiento e Interacción
- **Dismissible:** Configurable por aviso.
- **Persistencia:** Los avisos cerrados se guardan en el estado de sesión (o localStorage).
- **Acciones:** Cada aviso requiere un `Primary CTA` obligatorio orientado a la resolución inmediata (ej: "Reconectar", "Recargar").

## 5. Criterios de Aceptación
- [ ] Implementar el motor de ordenamiento por severidad.
- [ ] Soporte para fondo con transparencia y borde de 0.5px.
- [ ] Responsive: Adaptar el layout en móviles a una estructura más vertical o simplificada.
- [ ] API limpia: Cero lógica de dominio (ej: "Marketing") dentro del componente base.
