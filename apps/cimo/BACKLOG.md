# CIMO • Backlog de Issues y Mejoras Técnicas

Documento de seguimiento de especificaciones técnicas y mejoras planificadas para próximas iteraciones del ecosistema CIMO.

---

## 📌 Índice de Issues

1. [ISSUE-CIMO-001: Ciclo de Vida y Políticas de Archivador de Chats Efímeros](#issue-cimo-001-ciclo-de-vida-y-políticas-de-archivador-de-chats-efímeros)
2. [ISSUE-CIMO-002: Geocodificación Inversa y Arrastre de Pin GPS en Mapas](#issue-cimo-002-geocodificación-inversa-y-arrastre-de-pin-gps-en-mapas)
3. [ISSUE-CIMO-003: Autoguardado de Borrador de Convocatoria (Draft Autosave)](#issue-cimo-003-autoguardado-de-borrador-de-convocatoria-draft-autosave)

---

## ISSUE-CIMO-001: Ciclo de Vida y Políticas de Archivador de Chats Efímeros

* **Identificador:** `#CIMO-CHAT-LIFECYCLE`
* **Prioridad:** Media-Alta
* **Estado:** Planificada para Fase 2 (Regla predefinida activa: 24h)
* **Área:** Mensajería / Privacidad comunitaria / Retención de datos

### Contexto & Objetivo
En las aplicaciones deportivas comunitarias, los grupos que se quedan abiertos indefinidamente generan sobrecarga cognitiva, notificaciones fuera de lugar y grupos "zombis". Actualmente, la aplicación aplica una política automática predefinida de **archivado a las 24h** tras el entreno.

### Historias de Usuario & Criterios de Aceptación:
1. **Extensión Inteligente por Contenido:**
   * Si en el chat se comparten fotos del entreno o rutas GPX tras la quedada, ampliar automáticamente la ventana activa a 48h.
2. **Notificación Preventiva al Capitán y Participantes:**
   * Emitir un aviso discreto en el canal: *"⏳ Este chat se archivará automáticamente en 2 horas"*.
3. **Historial de Solo Lectura:**
   * Los participantes confirmados podrán seguir consultando los mensajes y las fotos en la pestaña *Archivados*, pero el canal quedará bloqueado contra nuevos envíos.
4. **Exportación / Resumen de Grupo:**
   * Opción para que el capitán descargue las fotos compartidas en lote antes del cierre definitivo.

---

## ISSUE-CIMO-002: Geocodificación Inversa y Arrastre de Pin GPS en Mapas

* **Identificador:** `#CIMO-GEO-REVERSE`
* **Prioridad:** Media
* **Estado:** Planificada
* **Área:** Mapas / Georreferenciación (`CimoMapPreviewCard.tsx`, Encuentro & Tercer Tiempo)

### Contexto & Objetivo
Permitir a los organizadores ajustar con precisión milimétrica el punto exacto de reunión (ej. "Entrada Puerta de Alcalá", "Fuente del Ángel Caído") moviendo manualmente el marcador sobre el mapa satélite o callejero.

### Historias de Usuario & Criterios de Aceptación:
1. **Arrastre de Marcador (`Draggable Marker`):**
   * El usuario puede arrastrar el pin rojo sobre el mapa interactivo.
2. **Geocodificación Inversa (`Reverse Geocoding`):**
   * Al soltar el pin, actualizar el campo de texto con la dirección o punto de interés más cercano obtenido vía API de geolocalización.
3. **Sincronización Bidireccional:**
   * Si el usuario escribe en el autocompletado, el pin se desplaza al nuevo punto; si mueve el pin, el texto y las coordenadas GPS se actualizan instantáneamente.

---

## ISSUE-CIMO-003: Autoguardado de Borrador de Convocatoria (Draft Autosave)

* **Identificador:** `#CIMO-DRAFT-AUTOSAVE`
* **Prioridad:** Media
* **Estado:** Planificada
* **Área:** Formulario de Creación (`CimoCreatePlanView.tsx`)

### Contexto & Objetivo
Si el usuario sale accidentalmente del formulario (o refresca la pestaña) mientras redacta las notas o configura el tercer tiempo, no debe perder los datos que ya introdujo.

### Historias de Usuario & Criterios de Aceptación:
1. **Persistencia en `localStorage`:**
   * Guardar automáticamente los cambios de cada bloque bajo la clave `cimo_create_plan_draft_v1`.
2. **Banner de Recuperación:**
   * Al volver a abrir `/app/create`, si existe un borrador guardado en las últimas 24 horas, mostrar un aviso: *"Tienes un borrador pendiente de tu quedada de Running en Retiro. [Recuperar] [Descartar]"*.
3. **Limpieza tras Publicación:**
   * Al hacer clic en *Publicar Convocatoria Grupal*, el borrador se purga automáticamente de `localStorage`.
