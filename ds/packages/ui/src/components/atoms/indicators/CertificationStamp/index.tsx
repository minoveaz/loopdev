'use client';

import React, { useMemo } from 'react';
import { CertificationStampProps, StampStatus } from './types';

/**
 * @component CertificationStamp
 * @description Sello visual dinámico que certifica el ciclo de vida de un componente.
 */
export const CertificationStamp: React.FC<CertificationStampProps> = ({
  status = 'certified',
  version = 'v1.0',
  phase = '1',
  date = new Date().toLocaleDateString(),
  className = ''
}) => {
  
  const statusConfig = useMemo(() => {
    const configs: Record<StampStatus, { label: string; color: string; bg: string }> = {
      certified: { 
        label: 'Certified_Ready', 
        color: 'var(--lpd-color-brand-primary)', 
        bg: 'bg-primary' 
      },
      beta: { 
        label: 'Engineering_Audit', 
        color: 'var(--lpd-color-brand-energy)', 
        bg: 'bg-energy' 
      },
      experimental: { 
        label: 'Lab_Blueprint', 
        color: 'var(--lpd-color-innovation-purple)', 
        bg: 'bg-innovation-purple' 
      }
    };
    return configs[status];
  }, [status]);

  return (
    <div className={`inline-flex flex-col relative overflow-hidden border border-primary/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl ${className}`}>
      
      {/* 1. Micro-Grilla de Fondo Dinámica */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(${statusConfig.color} 0.5px, transparent 0.5px)`, 
             backgroundSize: '4px 4px' 
           }} 
      />

      {/* 2. Barra Lateral de Estado */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bg}`} />

      {/* 3. Contenido Técnico */}
      <div className="relative z-10 p-3 pl-4 flex flex-col gap-2">
        
        <div className="flex items-center justify-between gap-6">
          <div className={`${statusConfig.bg} px-1.5 py-0.5 rounded-sm shadow-sm`}>
            <span className={`text-[8px] font-black font-mono uppercase tracking-widest ${status === 'beta' ? 'text-slate-900' : 'text-white'}`}>
              Loopdev.lab
            </span>
          </div>
          
          <div className="font-mono text-[9px] font-bold text-slate-600 dark:text-slate-300">
            <span className="text-energy">{"{"}</span>
            <span className="mx-1">{version}</span>
            <span className="text-energy">{"}"}</span>
          </div>
        </div>

        <div className="space-y-0.5 border-l border-primary/10 pl-2 ml-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Status:</span>
            <span className="text-[9px] font-black font-mono text-slate-900 dark:text-white uppercase tracking-tighter">
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Phase:</span>
            <span className="text-[9px] font-bold font-mono text-primary">
              0{phase}
            </span>
          </div>
        </div>

        <div className="mt-1 pt-2 border-t border-primary/5 flex justify-between items-center gap-8">
           <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest">
             Industrial_Standard
           </span>
           <span className="text-[7px] font-mono text-slate-500 font-bold">
             {date}
           </span>
        </div>
      </div>

      <div className="absolute -bottom-2 -right-1 opacity-10 text-primary font-black text-2xl select-none">
        {"}"}
      </div>
    </div>
  );
};
