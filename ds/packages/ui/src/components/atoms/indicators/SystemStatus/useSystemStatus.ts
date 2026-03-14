import { SystemStatusProps, SystemStatusState } from './types';

/**
 * @hook useSystemStatus
 * @description Lógica para el mapeo de estados, colores y formateo de IDs.
 */
export const useSystemStatus = (props: SystemStatusProps) => {
  const { state = 'operational', id, label = 'ID', className = '' } = props;

  // Mapeo de estados a tokens de color y etiquetas
  const stateConfig: Record<SystemStatusState, { dot: string; text: string; label: string }> = {
    operational: {
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
      text: 'text-emerald-500',
      label: 'Operational'
    },
    degraded: {
      dot: 'bg-energy-yellow shadow-[0_0_8px_rgba(255,208,37,0.4)]',
      text: 'text-energy-yellow',
      label: 'Degraded'
    },
    maintenance: {
      dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
      text: 'text-blue-500',
      label: 'Maintenance'
    },
    outage: {
      dot: 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]',
      text: 'text-danger',
      label: 'Critical Outage'
    }
  };

  const currentConfig = stateConfig[state];

  // Composición de clases para el contenedor (Zero Hardcoding)
  const containerClasses = `
    inline-flex items-center gap-4 px-4 py-2 rounded-lg font-mono text-[10px] border transition-all duration-300
    bg-slate-50 dark:bg-black/40 border-black/5 dark:border-white/10
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Formateo del ID (truncado si es muy largo)
  const formattedId = id ? (id.length > 12 ? `${id.substring(0, 8)}...` : id) : null;

  return {
    currentConfig,
    containerClasses,
    formattedId,
    label
  };
};
