# 🗺️ Plan Maestro de Migración: MarketingStudio -> Loopdev/DS

Este documento registra el inventario y el progreso de la migración del sistema de diseño heredado de MarketingStudio hacia la nueva infraestructura profesional de **Loopdev/DS**.

## 🎯 Objetivo
Transformar componentes estáticos y "hardcodeados" en una librería de ingeniería robusta, accesible, multi-marca y documentada.

---

## 🛠️ Estándar de Migración (Checklist)
Cada componente migrado debe cumplir:
- [ ] **Ingeniería:** Basado en CVA y Radix UI (cuando aplique).
- [ ] **Tematización:** Uso de variables CSS dinámicas (cero colores Hex fijos).
- [ ] **Polimorfismo:** Soporte para prop `asChild` (Radix Slot).
- [ ] **Storybook:** Historia completa con estados (Loading, Disabled, etc.).
- [ ] **Docs:** Archivo `.md` con API y ejemplos de uso.
- [ ] **Accesibilidad:** Cumplimiento de ratios de contraste WCAG AA.

---

## 📦 Inventario de Migración

### 1. Fundamentos & Tokens
| Componente/Activo | Estado | Notas |
| :--- | :--- | :--- |
| **Colors & Palette** | 🔄 En Progreso | Mapeo de `brand-primary` a `--primary`. |
| **Typography** | ✅ Completado | Configuración de Poppins/Inter como base. |
| **Shadows & Elevation** | ⏳ Pendiente | Traer las sombras "Glass" de MarketingStudio. |

### 2. Átomos (Primitivos)
| Componente | Estado | Prioridad |
| :--- | :--- | :--- |
| **Button** | ✅ Completado | Ya incluye Loading e Iconos. |
| **Input** | 🔄 Siguiente | Pendiente etiquetas y estados de error. |
| **Badge / Tag** | ⏳ Pendiente | Alta |
| **Switch / Checkbox** | ⏳ Pendiente | Alta |
| **Typography (System)** | ⏳ Pendiente | Media |
| **Avatar** | ⏳ Pendiente | Media |

### 3. Moléculas & Complejos
| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **DatePicker** | ⏳ Pendiente | Requiere integración Radix/Dayjs. |
| **FileUpload** | ⏳ Pendiente | Traer lógica de drag & drop. |
| **Modales / Dialogs** | ⏳ Pendiente | Base en Radix Dialog. |

### 4. Snippets (Negocio)
*Estos se migrarán una vez que los Átomos base estén sólidos.*
- [ ] **Fintech:** WalletStack, TransactionRow.
- [ ] **Insurtech:** AccidentReportCard, MedicalChatWidget.
- [ ] **Surfaces:** GlassCard, MeshHero.

---

## 🚀 Hoja de Ruta Inmediata
1. **Paso 1:** Finalizar **Input** (Atomo).
2. **Paso 2:** Migrar **Badge** y **Tag** (Atomo).
3. **Paso 3:** Traer la biblioteca de **Ilustraciones** como Snippets reutilizables.
4. **Paso 4:** Implementar el primer **Snippet Complejo** (ej: GlassCard).

---
## 🏗️ Deuda Técnica & Backlog de Ingeniería
- [x] **[Automation]** Crear script `pnpm audit-usage` para escanear automáticamente el uso de componentes en `marketingStudio` y generar el reporte de dependencias.
- [ ] **[Documentation]** Integrar importación automática de MDX desde `loopdev/ds` hacia `marketingStudio` para evitar duplicidad de texto.

---
*Última actualización: 27 de Diciembre, 2025*
