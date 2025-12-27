# Accessibility Standard (Baseline)

Estándar mínimo para todos los componentes.

## Focus
- Siempre debe haber **focus visible**.
- No remover outlines sin reemplazo equivalente.

## Keyboard
- Todos los componentes interactivos deben ser operables con teclado.
- `Enter`/`Space` donde aplique, `Esc` para cerrar overlays (Dialog/Popover).

## Semantics
- Usar elementos nativos (`button`, `a`, `input`) siempre que sea posible.
- Si se requiere ARIA, documentar qué y por qué en la doc del componente.

## Labels
- Inputs siempre con label accesible (visible o aria-label justificable).

## Disabled / Loading
- Disabled debe ser semántico.
- Loading no debe bloquear lector de pantalla; usar `aria-busy` donde aplique.
