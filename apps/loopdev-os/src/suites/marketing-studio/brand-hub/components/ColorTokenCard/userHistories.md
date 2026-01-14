# User Histories: ColorTokenCard

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** El color del swatch es el protagonista. Los metadatos usan la escala neutral.
2. **Sintaxis `{ }`:** Se usa en el badge de contraste para denotar la validación técnica: `{ AA }`.
3. **Technical Canvas:** Card compacta con bordes técnicos (`rounded-xl`).
4. **Surface Soul:** El swatch ocupa el 60% del área visual para impacto inmediato.

## 📚 Historias de Usuario
1. **[VIEW] Instant Recognition**
   - **HU:** Como diseñador, quiero ver el color físico y su nombre semántico (ej: `brand.primary`) en una card compacta para validar la paleta rápidamente.
2. **[ACCESSIBILITY] Dynamic Guardrails**
   - **HU:** Quiero ver un badge que me diga si el color tiene buen contraste (AA/AAA) contra el fondo actual para asegurar la legibilidad del sistema.
3. **[COPY] Fast Implementation**
   - **HU:** Como desarrollador, quiero copiar el valor HEX al portapapeles haciendo clic en el código para pegarlo en mi CSS/Tailwind.

## 📐 Criterios de Aceptación Técnicos
- [ ] Renderizar el swatch con el color resuelto según el tema.
- [ ] Mostrar el nombre del token y el valor HEX.
- [ ] Calcular y mostrar el status WCAG en tiempo real.
- [ ] Soportar evento `onClick` para selección e Inspector.
