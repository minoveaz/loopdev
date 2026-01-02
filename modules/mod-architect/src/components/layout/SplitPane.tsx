import { Box, Stack, Inline } from '@loopdev/ui';
import type { ReactNode } from 'react';
import { Code2, Eye, ExternalLink, Sun, Moon, CheckCircle2 } from 'lucide-react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  center?: ReactNode; 
  componentName?: string;
  sandboxTheme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  leftTitle?: string;
  centerTitle?: string;
  rightTitle?: string;
}

export const SplitPane = ({ 
  left, 
  right, 
  center,
  componentName,
  sandboxTheme = 'dark',
  onThemeToggle,
  leftTitle = 'Source Blueprint', 
  centerTitle = 'Official Implementation',
  rightTitle = 'System Output'
}: SplitPaneProps) => {
  // Clase común para los headers para garantizar simetría total
  const headerClass = "shrink-0 border-b border-slate-100 flex items-center h-12 px-5";

  return (
    <Box 
      className={`h-full grid ${center ? 'grid-cols-[1fr_1fr_400px]' : 'grid-cols-[1fr_400px]'} divide-x divide-slate-100`}
      background="base"
    >
      {/* Panel Izquierdo: El Diseño (Mock) */}
      <Stack gap={0} className="h-full overflow-hidden bg-slate-50/30">
        <header className={`${headerClass} bg-white/50 backdrop-blur-sm`}>
          <Inline justify="between" align="center" className="w-full" wrap={false}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Eye size={14} className="text-slate-300" /> {leftTitle}
            </span>
            
            <Inline gap={1} wrap={false}>
              {onThemeToggle && (
                <button 
                  onClick={onThemeToggle}
                  className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  title={`Switch to ${sandboxTheme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {sandboxTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              )}

              {componentName && (
                <button 
                  onClick={() => window.open(`/sandbox.html?componentName=${componentName}&theme=${sandboxTheme}`, '_blank')}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </Inline>
          </Inline>
        </header>
        <div className="flex-1 relative bg-slate-100/20">
          {left}
        </div>
      </Stack>

      {/* Panel Central (Opcional): La versión oficial */}
      {center && (
        <Stack gap={0} className="h-full overflow-hidden bg-white">
          <header className={`${headerClass} bg-indigo-50/30`}>
            <Inline justify="between" align="center" className="w-full" wrap={false}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                <CheckCircle2 size={14} /> {centerTitle}
              </span>
              {/* Espaciador para compensar los botones del panel izquierdo y mantener el título centrado respecto al eje */}
              <div className="w-12" /> 
            </Inline>
          </header>
          <div className="flex-1 relative bg-white">
            {center}
          </div>
        </Stack>
      )}

      {/* Panel Derecho: El Reporte */}
      <Stack gap={0} className="h-full overflow-hidden">
        <header className={`${headerClass} bg-white`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Code2 size={14} /> {rightTitle}
          </span>
        </header>
        <div className="flex-1 overflow-auto p-0 bg-white custom-scrollbar-thin">
          {right}
        </div>
      </Stack>
    </Box>
  );
};
