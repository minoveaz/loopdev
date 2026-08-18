# TechnicalCard

`TechnicalCard` es una composición fina de `TechnicalSurface` para contenido
agrupado. No crea una segunda superficie ni expresa estados de negocio.

## Variantes

- `flat`: contenedor estático.
- `interactive`: affordance visual compartida por `TechnicalSurface`; la acción
  y su semántica de teclado pertenecen al control consumidor.
- `warning`: conserva la composición de superficie sin añadir color de estado.
  El significado de warning pertenece al componente semántico que lo consume.
- `disabled`: declara `aria-disabled="true"`; no sustituye el contrato disabled
  del control accionable contenido.

## Uso

```tsx
<TechnicalCard variant="flat" className="p-4">
  Contenido agrupado
</TechnicalCard>
```

`TechnicalCard` debe usarse dentro de una composición cuyo canvas pertenezca a
`SuiteCanvas`. Las recipes no deben envolverlo en otra superficie ni añadir
sombras, bordes o colores de tema locales.