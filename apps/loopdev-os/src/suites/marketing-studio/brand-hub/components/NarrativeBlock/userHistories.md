# User Histories: NarrativeBlock

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Usa Azul (`primary`) para delimitar las áreas de Verdad Semántica.
2. **Sintaxis `{ }`:** El bloque es el contenedor principal (`{ IDENTITY_ROOT }`) de la narrativa.
3. **Technical Canvas:** Usa una estructura de stack vertical con espaciado industrial (`gap-8`) para separar Mission de Vision.
4. **Surface Soul:** Card de nivel superior con borde técnico y fondo `surface`.

## 📚 Historias de Usuario
1. **[VIEW] Structural Clarity**
   - **HU:** Como usuario, quiero ver la Misión, Visión y Valores en una sección unificada pero claramente diferenciada para entender el ADN de la marca de un vistazo.
2. **[EDIT] Orchestrated Editing**
   - **HU:** Cuando la marca está en modo Draft, quiero que todos los campos del bloque pasen a modo edición simultáneamente.
3. **[STRESS] Long Narrative**
   - **HU:** Si la misión es un párrafo largo y la visión es una página, el bloque debe permitir el scroll interno o crecer sin deformarse.

## 📐 Criterios de Aceptación Técnicos
- [ ] Ensamblado mediante múltiples `StructuredTextField`.
- [ ] Reactividad al estado `mode` del layout.
- [ ] Soporte para la lista de `Values` (title + description).
