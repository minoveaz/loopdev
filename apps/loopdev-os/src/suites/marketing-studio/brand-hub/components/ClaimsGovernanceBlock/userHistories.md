# User Histories: ClaimsGovernanceBlock

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Amarillo (`warning`) y Rojo (`critical`) predominan para señalar riesgo y restricción.
2. **Sintaxis `{ }`:** Se usa en los badges de severidad (`{ BLOCK }`) para enfatizar la naturaleza binaria de la regla.
3. **Technical Canvas:** Layout de dos columnas: una para lo prohibido (densidad de tags) y otra para lo regulado (densidad de cards).
4. **Surface Soul:** Superficies que invitan a la auditoría (Inspector).

## 📚 Historias de Usuario
1. **[VIEW] Compliance Guardrails**
   - **HU:** Como responsable legal, quiero ver en un solo bloque qué palabras no podemos usar y qué frases requieren cuidado para garantizar la seguridad de marca.
2. **[INSPECT] Why and Who**
   - **HU:** Al hacer clic en un claim bloqueado, quiero que el Inspector me diga qué ley o política (ej: EU Regulation) está forzando esa regla.
3. **[STRESS] Legal Overload**
   - **HU:** Si la marca tiene 20 claims regulados, la lista debe permitir scroll sin romper el bloque de palabras prohibidas de al lado.

## 📐 Criterios de Aceptación Técnicos
- [ ] Orquestador de múltiples `ClaimList`.
- [ ] Implementación de `Error Boundaries` a nivel de bloque.
- [ ] Integración con el `useBrandHub` context.
