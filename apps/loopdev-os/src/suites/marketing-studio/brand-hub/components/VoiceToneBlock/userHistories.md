# User Histories: VoiceToneBlock

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Utiliza verde y rojo en las cards hijas para guiar el comportamiento.
2. **Sintaxis `{ }`:** El bloque es el contenedor `{ VOICE_ORACLE }` que rige la expresión de la marca.
3. **Technical Canvas:** Grid responsiva de cards de tono.
4. **Surface Soul:** Cards con `hover` activo que disparan el Inspector de impacto.

## 📚 Historias de Usuario
1. **[VIEW] Multi-profile Awareness**
   - **HU:** Como usuario, quiero ver los diferentes perfiles de tono (Profesional, Divertido) en una grilla para elegir el adecuado según el canal.
2. **[NAV] Impact Analysis**
   - **HU:** Al hacer clic en un perfil, quiero que el Inspector me muestre en qué canales (Email, Slack, Web) es obligatorio usar ese tono.
3. **[STRESS] Massive Profiles**
   - **HU:** Si la marca tiene 6 perfiles de tono, la grilla debe ajustarse para no saturar la pantalla.

## 📐 Criterios de Aceptación Técnicos
- [ ] Orquestador de múltiples `ToneProfileCard`.
- [ ] Soporte para estados de carga parcial.
- [ ] Integración con el `useBrandHub` context para selección.
