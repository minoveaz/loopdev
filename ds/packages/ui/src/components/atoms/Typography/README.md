# Typography Primitives

Encapsula la lógica tipográfica de `loop.dev` (v3.8).

## Componentes
- `<Heading />`: Titulares (H1-H6) con Inter Black.
- `<Text />`: Cuerpo de texto y labels con control de tamaño y peso.
- `<Code />`: Bloques de código inline o técnicos con JetBrains Mono.

## Reglas de Uso
1. **Titulares:** Siempre usar `Heading` para consistencia de tracking.
2. **Datos:** Todo dato generado por sistema o IDs debe usar `variant="mono"`.
3. **Labels:** Micro-labels de 10px deben usar `weight="black"` y uppercase.
