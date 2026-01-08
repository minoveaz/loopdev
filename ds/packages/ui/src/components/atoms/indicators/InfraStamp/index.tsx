'use client';

import React, { useMemo } from 'react';

export type InfraStampStatus = 'certified' | 'audit' | 'lab';

export interface InfraStampProps {
  status?: InfraStampStatus;
  version?: string;
  security?: string; // Ej: RLS_OK, SECURE_V1
  date?: string;
  className?: string;
}

/**
 * @component InfraStamp
 * @description Sello de certificación de infraestructura. 
 * Avala la seguridad, multi-tenancy y estabilidad de la capa de datos.
 */
export const InfraStamp: React.FC<InfraStampProps> = ({
  status = 'certified',
  version = 'v1.0',
  security = 'RLS_SECURED',
  date = new Date().toLocaleDateString(),
  className = ''
}) => {
  
  const statusConfig = useMemo(() => {
    const configs: Record<InfraStampStatus, { label: string; color: string; bg: string }> = {
      certified: { 
        label: 'Infra_Certified', 
        color: 'var(--lpd-color-brand-energy)', 
        bg: 'bg-accent' 
      },
      audit: { 
        label: 'Security_Review', 
        color: 'var(--lpd-color-brand-primary)', 
        bg: 'bg-primary' 
      },
      lab: { 
        label: 'Infra_Blueprint', 
        color: 'var(--lpd-color-innovation-purple)', 
        bg: 'bg-innovation-purple' 
      }
    };
    return configs[status];
  }, [status]);

  return (
    <div className={`inline-flex flex-col relative overflow-hidden border border-accent/20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-2xl ${className}`}>
      
      {/* 1. Neural Grid Background - High Intensity */}
      <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.35] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(var(--lpd-color-innovation-purple) 1.2px, transparent 1.2px)`, 
             backgroundSize: '10px 10px' 
           }} 
      />

      {/* 2. Barra Lateral de Motor (Amarilla) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bg}`} />

      {/* 3. Contenido Técnico */}
      <div className="relative z-10 p-3 pl-4 flex flex-col gap-2">
        
        <div className="flex items-center justify-between gap-6">
          <div className={`${statusConfig.bg} px-1.5 py-0.5 rounded-sm shadow-sm`}>
            <span className="text-[8px] font-black font-mono uppercase tracking-widest text-slate-950">
              Loopdev.infra
            </span>
          </div>
          
          <div className="font-mono text-[9px] font-bold text-slate-600 dark:text-slate-300">
            <span className="text-primary">{"{"}</span>
            <span className="mx-1">{version}</span>
            <span className="text-primary">{"}"}</span>
          </div>
        </div>

        <div className="space-y-0.5 border-l border-accent/20 pl-2 ml-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Status:</span>
            <span className="text-[9px] font-black font-mono text-slate-900 dark:text-white uppercase tracking-tighter">
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Security:</span>
            <span className="text-[9px] font-bold font-mono text-accent">
              {security}
            </span>
          </div>
        </div>

        <div className="mt-1 pt-2 border-t border-primary/5 flex justify-between items-center gap-8">
           <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest">
             Cloud_Scale_Ready
           </span>
           <span className="text-[7px] font-mono text-slate-500 font-bold">
             {date}
           </span>
        </div>
      </div>

      <div className="absolute -bottom-2 -right-1 opacity-10 text-accent font-black text-2xl select-none">
        {"}"}
      </div>
    </div>
  );
};