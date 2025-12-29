import { Box, Stack, Inline } from '@loopdev/ui';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Code2, Eye } from 'lucide-react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
}

export const SplitPane = ({ 
  left, 
  right, 
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
          </Inline>
        </Box>
        <div className="flex-1 overflow-auto p-8 flex items-start justify-center custom-scrollbar-thin">
          <div className="w-full max-w-3xl shadow-2xl rounded-2xl border border-white bg-white/80 min-h-[500px] p-1">
             <div className="w-full h-full rounded-[calc(1rem-1px)] border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center">
                {left}
             </div>
          </div>
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
