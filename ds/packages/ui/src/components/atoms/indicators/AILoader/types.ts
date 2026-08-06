/**
 * @file types.ts
 * @description Contratos para el componente AILoader.
 */

export interface AILoaderProps {
  /** Array de mensajes que rotarán secuencialmente. Si es uno solo, se queda fijo al terminar de escribir. */
  messages?: string[];
  /** Velocidad de escritura */
  speed?: 'fast' | 'normal' | 'slow';
  /** Si debe mostrar el cursor parpadeante al finalizar */
  showCursor?: boolean;
  /** Clase para el contenedor */
  className?: string;
}

export type TypingState = 'typing' | 'deleting' | 'waiting';
