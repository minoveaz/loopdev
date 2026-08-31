import React from 'react';
import {
  Award,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Star,
  Sun,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCaptainBadgeInspectorProps {
  activity: ActivityCardData;
  onNavigateToProfile?: (athleteId: string) => void;
}

export const CimoCaptainBadgeInspector: React.FC<CimoCaptainBadgeInspectorProps> = ({
  activity,
  onNavigateToProfile,
}) => {
  const captain = activity.captain;

  return (
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Información del Capitán">
      {/* 1. Tarjeta del Capitán */}
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Capitán Verificado
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-black">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>4.9</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigateToProfile?.(captain.id)}
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#7FB77E]/40 shrink-0 cursor-pointer hover:border-[#1F4E5F] transition-all hover:scale-105"
          >
            <img
              src={captain.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={captain.name}
              className="w-full h-full object-cover"
            />
          </button>
          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onNavigateToProfile?.(captain.id)}
              className="font-black text-base text-[#1F4E5F] truncate cursor-pointer hover:text-[#7FB77E] transition-colors"
            >
              {captain.name}
            </h3>
            <p className="text-xs font-bold text-[#1F4E5F]/70 truncate">
              Organizador del Crew
            </p>
            <p className="text-[11px] font-medium text-[#1F4E5F]/60 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#7FB77E]" />
              {activity.location}
            </p>
          </div>
        </div>

        {/* Stats del Capitán */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1F4E5F]/8">
          <div className="bg-white p-2.5 rounded-xl border border-[#1F4E5F]/8 text-center">
            <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Entrenos</span>
            <span className="text-sm font-black text-[#1F4E5F]">28 liderados</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-[#1F4E5F]/8 text-center">
            <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Asistencia</span>
            <span className="text-sm font-black text-[#7FB77E]">100% puntual</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToProfile?.(captain.id)}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#1F4E5F] text-[#1F4E5F] hover:text-white border border-[#1F4E5F]/15 font-black text-xs transition-all text-center cursor-pointer active:scale-98"
        >
          Ver Pasaporte Deportivo
        </button>
      </div>

      {/* 2. Clima y Condiciones Previstas */}
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          Condiciones Previstas
        </span>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-[#1F4E5F]">21°C</span>
            <p className="text-xs font-bold text-[#1F4E5F]/70">Despejado • Brisa suave</p>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] text-xs font-black">
            Condición Óptima
          </div>
        </div>
        <p className="text-[11px] font-medium text-[#1F4E5F]/70 bg-white p-2.5 rounded-xl border border-[#1F4E5F]/8">
          💡 <strong>Consejo del Capitán:</strong> Hidratación recomendada de 500ml y calzado para asfalto/tierra compacta.
        </p>
      </div>
    </aside>
  );
};
