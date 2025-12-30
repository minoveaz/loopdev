import { Box, Stack, Inline } from '@loopdev/ui';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Code2, Eye, ExternalLink } from 'lucide-react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  componentName?: string;
  leftTitle?: string;
  rightTitle?: string;
}

export const SplitPane = ({ 
  left, 
  right, 
  componentName,
  leftTitle = 'Source Blueprint', 
  rightTitle = 'System Output'
}: SplitPaneProps) => {
  return (
    <Box 
      className="h-full grid grid-cols-2 divide-x divide-slate-100"
      background="base"
    >
      {/* Panel Izquierdo: El Diseño (Mock) */}
      <Stack gap={0} className="h-full overflow-hidden bg-slate-50/30">
        <Box 
          paddingX={5} 
          paddingY={3}
          className="shrink-0 border-b border-slate-100 bg-white/50 backdrop-blur-sm"
        >
          <Inline justify="between" align="center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Eye size={14} className="text-slate-300" /> {leftTitle}
            </span>
            {/* Botón para abrir el preview en una ventana independiente */}
            {componentName && (
              <button 
                onClick={() => window.open(`/admin/preview/${componentName}`, '_blank')}
                className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Open in new window"
              >
                <ExternalLink size={14} />
              </button>
            )}
          </Inline>
        </Box>
        {/* El Canvas ahora ocupa todo el espacio sin márgenes ni tarjetas */}
        <div className="flex-1 relative bg-slate-100/20">
          {left}
        </div>
      </Stack>

      {/* Panel Derecho: El Código Atómico */}
      <Stack gap={0} className="h-full overflow-hidden">
        <Box 
          paddingX={5} 
          paddingY={3}
          className="shrink-0 border-b border-slate-100 bg-white"
        >
          <Inline justify="between" align="center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
              <Code2 size={14} /> {rightTitle}
            </span>
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
            </div>
          </Inline>
        </Box>
        <div className="flex-1 overflow-auto p-0 bg-white custom-scrollbar-thin">
          {right}
        </div>
      </Stack>
    </Box>
  );
};
