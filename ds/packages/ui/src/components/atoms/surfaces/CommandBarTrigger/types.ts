/**
 * @file types.ts
 * @description Contratos de tipado para el disparador de la paleta de comandos.
 */

export type CommandBarTriggerMode = 'full' | 'icon';

export interface CommandBarTriggerProps {
  /** Texto del placeholder (ej: Search or type a command...) */
  placeholder?: string;
  /** Atajo de teclado a mostrar (ej: ⌘K) */
  shortcut?: string;
  /** Modo de visualización */
  mode?: CommandBarTriggerMode;
  /** Callback para abrir la paleta de comandos */
  onOpen: () => void;
  /** Clase CSS adicional */
  className?: string;
}
