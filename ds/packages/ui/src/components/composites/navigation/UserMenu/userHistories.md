# Historias de Usuario: UserMenu

Este componente compuesto es el centro de gestión de identidad personal y sesión del usuario. Permite acceder a la configuración de la cuenta y realizar la desconexión del sistema de forma segura.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** 
   - Acento `danger` (Rojo) para la acción de Logout.
   - Brackets en `primary-light` (Azul) para envolver el Rol técnico.
2. **Sintaxis Loop:** Uso obligatorio de llaves para metadatos de usuario (ej: { ADMIN }).
3. **Technical Canvas:** Alineación de precisión en la Cápsula Derecha del Header.
4. **Surface Soul:** Menú de cristal con z-index prioritario.

## Historias de Usuario
- **Historia 1 (Identidad Visible):** Como usuario, quiero ver mi nombre y mi rol técnico al abrir el menú para confirmar mis privilegios en la plataforma.
- **Historia 2 (Gestión de Sesión):** Como usuario, quiero poder cerrar mi sesión de forma inmediata y clara para proteger mi cuenta.
- **Historia 3 (Navegación Personal):** Como usuario, quiero tener accesos directos a mi Perfil, Ajustes y Facturación desde un solo punto.
- **Historia 4 (Conciencia de Rol):** El menú debe destacar mi rol (Admin, Editor, Viewer) mediante una etiqueta técnica estilizada.

## Casos de Estrés
- **Emails Muy Largos:** Si el identificador del usuario es un email largo, el componente debe truncarlo elegantemente.
- **Transición de Tema:** El avatar y las etiquetas del menú deben mantener su nitidez al alternar entre modo claro y oscuro.
