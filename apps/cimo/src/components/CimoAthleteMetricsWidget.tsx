import React from 'react';
import {
  CheckCircle2,
  Flame,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import type { ExtendedUserProfileData } from './CimoEditProfileView';

export interface CimoAthleteMetricsWidgetProps {
  user: ExtendedUserProfileData;
  isOwnProfile?: boolean;
}

export const CimoAthleteMetricsWidget: React.FC<CimoAthleteMetricsWidgetProps> = () => {
  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Métricas del Atleta"
    >
      {/* 1. Cabecera */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Pasaporte Atlético Verificado
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
          Nivel Oro
        </span>
      </div>

      {/* 2. Nivel Atlético & Reputación */}
      <div className="flex flex-col gap-2">
        <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between rounded-2xl border bg-white p-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-[#7FB77E]/15 p-2 text-[#1F4E5F]">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
                Constancia
              </span>
              <span className="text-xs font-black text-[#1F4E5F]">Nivel Oro (4+ días/sem)</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#7FB77E]">Top 5%</span>
        </div>

        <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between rounded-2xl border bg-white p-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-500/15 p-2 text-amber-800">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
                Valoración Media
              </span>
              <span className="text-xs font-black text-[#1F4E5F]">4.9 ★ (28 reseñas)</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-amber-600">Excelente</span>
        </div>

        <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between rounded-2xl border bg-white p-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-blue-500/15 p-2 text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
                Asistencia
              </span>
              <span className="text-xs font-black text-[#1F4E5F]">100% Palabra de Honor</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-blue-600">0 Faltas</span>
        </div>
      </div>

      {/* 3. Marcas & Ritmos de Referencia */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          Marcas de Referencia
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-center">
          <div className="border-[#1F4E5F]/6 rounded-xl border bg-[#EEF2F2]/50 p-2">
            <span className="text-xs font-black text-[#1F4E5F]">5:15 /km</span>
            <p className="mt-0.5 text-[9px] font-bold uppercase text-[#1F4E5F]/60">Ritmo Rodaje</p>
          </div>
          <div className="border-[#1F4E5F]/6 rounded-xl border bg-[#EEF2F2]/50 p-2">
            <span className="text-xs font-black text-[#7FB77E]">Nivel 3.5</span>
            <p className="mt-0.5 text-[9px] font-bold uppercase text-[#1F4E5F]/60">
              Pádel Playtomic
            </p>
          </div>
        </div>
      </div>

      {/* 4. Resumen de Comunidad */}
      <div className="border-[#1F4E5F]/8 shadow-2xs mt-auto flex items-center justify-between rounded-2xl border bg-white p-3.5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#7FB77E]" />
          <div>
            <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">
              Comunidad Activa
            </span>
            <span className="text-xs font-black text-[#1F4E5F]">3 Squads • 24 Atletas</span>
          </div>
        </div>
        <span className="rounded-full bg-[#7FB77E]/10 px-2 py-0.5 text-[10px] font-black text-[#7FB77E]">
          Activo
        </span>
      </div>
    </aside>
  );
};
