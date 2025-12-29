import { Box, Stack, Inline } from '@loopdev/ui';
import clsx from 'clsx';
import { ReactNode } from 'react';
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
  leftTitle = 'Legacy Blueprint', 
  rightTitle = 'Design System Target'
}: SplitPaneProps) => {
  return (
    <Box 
      className="h-full grid grid-cols-2 divide-x divide-[var(--lpd-color-border-subtle)]"
      background="subtle"
    >
      {/* Columna Izquierda: El Origen */}
      <Stack gap={0} className="h-full overflow-hidden bg-slate-50/50">
        <Box 
          paddingX={4} 
          paddingY={2}
          background="base"
          className="shrink-0 border-b border-[var(--lpd-color-border-subtle)]"
        >
          <Inline justify="between" align="center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Eye size={12} /> {leftTitle}
            </span>
          </Inline>
        </Box>
        <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
          <div className="w-full max-w-2xl shadow-sm rounded-xl border border-dashed border-slate-300 bg-white min-h-[400px]">
            {left}
          </div>
        </div>
      </Stack>

      {/* Columna Derecha: El Destino (Código Transformado) */}
      <Stack gap={0} className="h-full overflow-hidden">
        <Box 
          paddingX={4} 
          paddingY={2}
          background="base"
          className="shrink-0 border-b border-[var(--lpd-color-border-subtle)]"
        >
          <Inline justify="between" align="center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--lpd-color-brand-primary)] flex items-center gap-2">
              <Code2 size={12} /> {rightTitle}
            </span>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </Inline>
        </Box>
        <div className="flex-1 overflow-auto p-6 bg-white">
          {right}
        </div>
      </Stack>
    </Box>
  );
};