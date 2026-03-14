# Icon Registry (Foundation)

El `IconRegistry` es la fuente única de verdad para la iconografía permitida en `loop.dev`. Su propósito es prevenir el "Drift Sistémico" asegurando que solo se utilicen glifos aprobados y consistentes.

## 🛠️ Gobernanza
Para añadir un nuevo icono al sistema:
1. **Validación:** El icono debe pertenecer a la familia **Material Symbols Outlined**.
2. **Registro:** Añadir el nombre del glifo en el objeto `ICON_REGISTRY` dentro de la categoría correspondiente.
3. **Consumo:** Una vez registrado, el tipo `IconName` se actualizará automáticamente y podrá usarse en el componente `<Icon />`.

## ⚙️ Estructura del Registro
El registro está organizado por categorías semánticas:
- `navigation`: Iconos para menús, breadcrumbs y rutas.
- `actions`: Operadores de UI (añadir, borrar, editar).
- `status`: Señalización de estados (éxito, error, avisos).

## 🤖 Contexto para LLMs
- **Inmutabilidad:** No importar iconos directamente desde librerías externas. Siempre pasar por el registro.
- **Tipado:** El tipo `IconName` es una unión de valores constantes (`as const`).
