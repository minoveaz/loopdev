# User Histories: ClaimList

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Usa Rojo (`critical`) para palabras prohibidas y Amarillo (`warning`) para claims regulados que requieren atención.
2. **Sintaxis `{ }`:** Se usa en las etiquetas de los items para enfatizar el carácter de "Regla de Negocio".
3. **Technical Canvas:** Estructura de lista densa, optimizada para escaneo rápido de múltiples riesgos.
4. **Surface Soul:** Cada claim es una superficie interactiva con `backdrop-blur` sutil (en variantes glass).

## 📚 Historias de Usuario
1. **[VIEW] Risk Hierarchy**
   - **HU:** Como oficial de cumplimiento, quiero ver las palabras prohibidas agrupadas y resaltadas en rojo para identificar riesgos inmediatos.
2. **[VIEW] Jurisdiction Context**
   - **HU:** Quiero ver a qué región (EU, UK) aplica cada claim regulado directamente en la lista.
3. **[STRESS] Massive Claims**
   - **HU:** Si la marca tiene 50 palabras prohibidas, la lista debe envolverse (wrap) correctamente sin desbordar el contenedor.

## 📐 Criterios de Aceptación Técnicos
- [ ] Soporte para dos modos: `forbidden` (tags) y `regulated` (cards).
- [ ] Integración de `TechnicalStatusBadge` para severidad.
- [ ] Click handler granular por item.
