# Typography Primitives

Encapsula la lógica tipográfica de `loop.dev` (v3.8).

## Componentes

- `<Heading />`: Titulares (H1-H6) con Inter Semibold por defecto; usa pesos mayores solo cuando el contexto lo requiera.
- `<Text />`: Cuerpo de texto y labels con control de tamaño y peso.
- `<TechnicalText />`: IDs, estados, timestamps y labels operativos en JetBrains Mono.
- `<Code />`: Bloques de código inline o técnicos con JetBrains Mono.

## Reglas de Uso

1. **Titulares:** Siempre usar `Heading` para consistencia de escala, peso y tracking.
2. **Datos:** Todo dato generado por sistema o IDs debe usar `TechnicalText`.
3. **Labels:** Micro-labels de 10px deben usar `weight="black"` y uppercase.
