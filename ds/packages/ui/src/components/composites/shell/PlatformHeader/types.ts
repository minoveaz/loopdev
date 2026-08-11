import type { ReactNode } from 'react';
import type { LayoutContext } from '@loopdev/contracts';

export interface PlatformHeaderProps {
  /** Identidad estable de LoopDev y acceso al Launchpad. */
  identitySlot: ReactNode;
  /** Organización, proyecto o workspace activo. */
  contextSlot?: ReactNode;
  /** Entorno, rama y estado operativo. */
  environmentSlot?: ReactNode;
  /** Acción global primaria, como conectar o desplegar. */
  primaryActionSlot?: ReactNode;
  /** Búsqueda y command bar global. */
  searchSlot?: ReactNode;
  /** Ayuda, notificaciones y preferencias generales. */
  controlsSlot?: ReactNode;
  /** Perfil y menú de cuenta. */
  profileSlot?: ReactNode;
  /** Contexto visual del shell. */
  context?: LayoutContext;
  /** Desactiva interacción mientras existe un overlay bloqueante. */
  isInert?: boolean;
  /** Clase adicional para integraciones controladas. */
  className?: string;
}
