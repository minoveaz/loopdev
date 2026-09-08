import React from 'react';
import { MapPin, ShieldCheck, Star, Sun } from 'lucide-react';
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
    <aside
      className="flex h-full flex-col gap-3.5 overflow-y-auto pr-0.5 text-[#1F4E5F]"
      aria-label="Información del Capitán"
    >
      {/* 1. Tarjeta del Capitán */}
      <div className="border-[#1F4E5F]/12 flex flex-col gap-4 rounded-3xl border bg-[#FCFDFD] p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Capitán Verificado
          </span>
          <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-800">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>4.9</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigateToProfile?.(captain.id)}
            className="h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-[#7FB77E]/40 transition-all hover:scale-105 hover:border-[#1F4E5F]"
          >
            <img
              src={
                captain.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
              }
              alt={captain.name}
              className="h-full w-full object-cover"
            />
          </button>
          <div className="min-w-0 flex-1">
            <h3
              onClick={() => onNavigateToProfile?.(captain.id)}
              className="cursor-pointer truncate text-base font-black text-[#1F4E5F] transition-colors hover:text-[#7FB77E]"
            >
              {captain.name}
            </h3>
            <p className="truncate text-xs font-bold text-[#1F4E5F]/70">Organizador del Crew</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#1F4E5F]/60">
              <MapPin className="h-3 w-3 text-[#7FB77E]" />
              {activity.location}
            </p>
          </div>
        </div>

        {/* Stats del Capitán */}
        <div className="border-[#1F4E5F]/8 grid grid-cols-2 gap-2 border-t pt-3">
          <div className="border-[#1F4E5F]/8 rounded-xl border bg-white p-2.5 text-center">
            <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
              Entrenos
            </span>
            <span className="text-sm font-black text-[#1F4E5F]">28 liderados</span>
          </div>
          <div className="border-[#1F4E5F]/8 rounded-xl border bg-white p-2.5 text-center">
            <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
              Asistencia
            </span>
            <span className="text-sm font-black text-[#7FB77E]">100% puntual</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToProfile?.(captain.id)}
          className="active:scale-98 w-full cursor-pointer rounded-xl border border-[#1F4E5F]/15 bg-white px-3 py-2 text-center text-xs font-black text-[#1F4E5F] transition-all hover:bg-[#1F4E5F] hover:text-white"
        >
          Ver Pasaporte Deportivo
        </button>
      </div>

      {/* 2. Clima y Condiciones Previstas */}
      <div className="border-[#1F4E5F]/12 flex flex-col gap-3 rounded-3xl border bg-[#FCFDFD] p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          Condiciones Previstas
        </span>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-[#1F4E5F]">21°C</span>
            <p className="text-xs font-bold text-[#1F4E5F]/70">Despejado • Brisa suave</p>
          </div>
          <div className="rounded-xl bg-[#7FB77E]/15 px-2.5 py-1 text-xs font-black text-[#1F4E5F]">
            Condición Óptima
          </div>
        </div>
        <p className="border-[#1F4E5F]/8 rounded-xl border bg-white p-2.5 text-[11px] font-medium text-[#1F4E5F]/70">
          💡 <strong>Consejo del Capitán:</strong> Hidratación recomendada de 500ml y calzado para
          asfalto/tierra compacta.
        </p>
      </div>
    </aside>
  );
};
