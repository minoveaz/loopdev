# Estándares de Diseño & Experiencia Pública — CIMO & LoopDev

Documento de referencia para el diseño de flujos de interacción, código cromático semántico y jerarquía visual en CIMO y aplicaciones públicas de LoopDev.

---

## 1. Sistema Cromático Semántico Dual (Dual-Tone Semantic System)

Para evitar monotonía y comunicar claramente la naturaleza de cada sección, se establece un sistema de dos dimensiones visuales bien diferenciadas:

### 🟢 Dimensión Deportiva / Core (`Verde & Petróleo`)
* **Colores clave:** `#7FB77E` (Verde CIMO), `#1F4E5F` (Petróleo Profundo), `#EEF2F2` (Fondo Neutro Deportivo).
* **Significado:** Esfuerzo físico, entrenamiento, ritmo, kilómetros, desnivel, equipamiento técnico y seguridad.
* **Secciones que lo aplican:**
  * Selección de Deporte
  * Nivel & Ritmo
  * Cupo de plazas para el entreno
  * Fecha, Hora y Punto de encuentro
  * Instrucciones del Capitán y Checklist de Material

### 🔵 Dimensión Social / Comunidad (`Azul Social & Conexión`)
* **Colores clave:** `#2563EB` (Azul Eléctrico), `#3B82F6` (Azul Claro), `#EFF6FF` (Fondo Azul Suave), `#1E40AF` (Azul Marino Texto).
* **Significado:** Tercer Tiempo, relajación post-entreno, sobremesa, café de especialidad, cañas, networking, charlas y amistad.
* **Secciones que lo aplican:**
  * Bloque de Tercer Tiempo (Opcional)
  * Badges sociales de "Tercer Tiempo Incluido" en tarjetas del Feed
  * Indicadores de actividad social post-entreno en la Ficha de Detalle

---

## 2. Flujo de Creación Progresiva en 5 Bloques Lógicos

El orden de captura de información responde a la carga cognitiva natural del organizador/capitán:

1. **Bloque 1 · Definición Deportiva (🟢 Verde):**
   * ¿Qué deporte lideras? (Hiking, Running, Pádel, Ciclismo, Crossfit).
   * Nivel & Ritmo exigido (Principiante, Intermedio, Avanzado con métricas reales).
   * Cupo máximo de personas (Stepper de 2 a 16 plazas).
2. **Bloque 2 · Logística Espacio-Temporal (🟢 Verde):**
   * ¿Qué día? (Hoy, Mañana, Fin de semana, Calendario interactivo).
   * ¿A qué hora? (Digital tuner de horas y minutos).
   * Ciudad & Punto de encuentro exacto con geocodificación en vivo y mapa interactivo.
3. **Bloque 3 · Recomendaciones & Material (🟢 Verde):**
   * Instrucciones del capitán con plantillas rápidas estandarizadas con icono `+`.
   * Checklist de material recomendado amplio y legible en 2 columnas con iconos vectoriales (sin emojis OS).
4. **Bloque 4 · Dimensión Social — Tercer Tiempo (🔵 Azul):**
   * Toggle opcional.
   * Tipo de plan social (Café & Desayuno, Caña & Tapeo, Smoothie Recovery, Picnic al Aire Libre).
   * Buscador de local/cafetería/terraza con Google Maps / OSM en vivo.
   * Notas contextuales breves con chips estandarizados con icono `+`.
5. **Bloque 5 · Estudio de Portada, Título & Descripción Inteligente (✨ Cierre):**
   * 3 Variantes de título inteligentes generadas con 1 clic (Dinámica, Social, Técnica) con icono `+`.
   * Descripción autogenerada a partir de los datos introducidos + chips de enriquecimiento con `+`.
   * Galería curada de fotografías deportivas reales de alta resolución por deporte + subida de foto propia.
   * Botón de acción principal de publicación: **`Publicar Convocatoria Grupal`**.

---

## 3. Principio de Vista Previa Asimétrica (Split-Sticky Preview)

* **Cero redundancia:** En desktop, el formulario ocupa la columna principal izquierda (8 cols) y la tarjeta Live Preview se sitúa fija/sticky a la derecha (4 cols). No se duplica la tarjeta al final del formulario.
* **Reactividad en tiempo real:** Cualquier cambio en el formulario (deporte, fecha, ubicación, título, foto de portada o tercer tiempo) se refleja de inmediato en la tarjeta de la derecha.
* **Iconografía estándar:** Todos los chips de sugerencias rápidas utilizan exclusivamente el componente `<Plus className="w-3.5 h-3.5" />` de Lucide.
