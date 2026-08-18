# TechnicalCanvas

`TechnicalCanvas` es la capa decorativa canónica para grids técnicos. Es una
capa transparente, no interactiva y `aria-hidden`; no debe usarse para crear
una superficie, controlar layout ni expresar estados de negocio.

El color se resuelve mediante `--grid-line-color` con `currentColor` como
fallback. La intensidad, el tamaño y la subgrilla son configuración del
primitive, mientras que el consumidor decide si el contexto permite una
decoración técnica.
