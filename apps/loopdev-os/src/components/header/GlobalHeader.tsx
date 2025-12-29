import { 
  TopBar, 
  TopBarLeft, 
  TopBarCenter, 
  TopBarRight, 
  Inline, 
  Box, 
  useLayout 
} from '@loopdev/ui';
import { 
  Infinity, 
  Search, 
  Activity, 
  Command, 
  Sun, 
  Moon,
  Bell
} from 'lucide-react';
import { useState } from 'react';

/**
 * @component GlobalHeader
 * @description Official Nivel 1 Header based on the Designer's Landing Page architecture.
 */
export const GlobalHeader = () => {
  const { isRightSidebarOpen, toggleRightSidebar } = useLayout();
  const [isDark, setIsDark] = useState(false);

  return (
    <TopBar className="bg-white/90 backdrop-blur-md border-b-slate-200/60 h-16">
      
      {/* SECCIÓN IZQUIERDA: Identity (Exact Specs from Landing) */}
      <TopBarLeft>
        <Inline gap={3} align="center" className="text-slate-900">
          <div className="flex size-8 items-center justify-center rounded bg-[#135BEC] text-white shadow-lg shadow-blue-500/20">
            <Infinity size={20} />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">loop.dev</h2>
        </Inline>
        
        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
        
        <Inline gap={2} align="center" className="hidden md:flex">
          <span className="text-[10px] font-[var(--lpd-font-weight-black)] tracking-[var(--lpd-tracking-widest)] text-slate-400 uppercase font-[var(--lpd-font-mono)]">Architect</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-[var(--lpd-font-weight-black)] text-emerald-700 uppercase tracking-[var(--lpd-tracking-tighter)] font-[var(--lpd-font-mono)]">Live</span>
          </div>
        </Inline>
      </TopBarLeft>

      {/* SECCIÓN CENTRAL: Omni-Search */}
      <TopBarCenter>
        <Box className="w-96 relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search blueprints..." 
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-100/50 border-none text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-mono text-slate-400 shadow-sm">
            <Command size={10} /> K
          </div>
        </Box>
      </TopBarCenter>

      {/* SECCIÓN DERECHA: Actions (Mix of Landing & Admin context) */}
      <TopBarRight>
        <Inline gap={3} align="center">
          {/* Theme Toggle from Designer */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Architect Intelligence Toggle */}
          <button 
            onClick={toggleRightSidebar}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isRightSidebarOpen 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Activity size={18} />
          </button>

          <div className="h-8 w-px bg-slate-200 mx-1" />

          <button className="flex h-9 items-center justify-center rounded bg-[#135BEC] px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            Start Migration
          </button>
        </Inline>
      </TopBarRight>

    </TopBar>
  );
};
