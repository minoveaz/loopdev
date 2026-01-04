import { EngineeringSealProps, EngineeringSealStatus } from './types';

/**
 * @hook useEngineeringSeal
 * @description Lógica de negocio para el mapeo de estados y clases del sello.
 */
export const useEngineeringSeal = (props: EngineeringSealProps) => {
  const { status = 'ready', className = '' } = props;

  // Mapeo semántico de colores basado en tokens de LoopDev
  const statusConfig: Record<EngineeringSealStatus, { bg: string; text: string; label: string }> = {
    ready: {
      bg: 'bg-primary',
      text: 'text-white',
      label: 'CERTIFIED_READY'
    },
    audit: {
      bg: 'bg-energy-yellow',
      text: 'text-slate-900',
      label: 'ENGINEERING_AUDIT'
    },
    lab: {
      bg: 'bg-purple-600',
      text: 'text-white',
      label: 'LAB_BLUEPRINT'
    }
  };

  const currentConfig = statusConfig[status];

  // Composición de clases para el contenedor principal
  const containerClasses = `inline-flex items-center gap-0 bg-surface-dark border border-white/10 rounded-md overflow-hidden shadow-xl origin-top-left ${className}`;

  // Clases para el bloque de identidad (LOOPDEV.LAB)
  const identityClasses = `px-2.5 py-1 text-[10px] font-black tracking-tight ${currentConfig.bg} ${currentConfig.text}`;

  // Clases para el bloque de versión
  const versionClasses = `px-2.5 py-1 text-[10px] font-mono font-bold text-energy-yellow bg-black/40 border-l border-white/5`;

  return {
    label: 'LOOPDEV.LAB',
    containerClasses,
    identityClasses,
    versionClasses
  };
};
