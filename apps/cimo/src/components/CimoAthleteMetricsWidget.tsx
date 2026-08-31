import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type { ExtendedUserProfileData } from './CimoEditProfileView';

export interface CimoAthleteMetricsWidgetProps {
  user: ExtendedUserProfileData;
  isOwnProfile?: boolean;
}

export const CimoAthleteMetricsWidget: React.FC<CimoAthleteMetricsWidgetProps> = ({
  user,
}) => {
  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Métricas del Atleta">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Pasaporte Atlético Verificado
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          Nivel Oro
        </span>
      </div>

      {/* 2. Nivel Atlético & Reputación */}
      <div className="flex flex-col gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Constancia</span>
              <span className="text-xs font-black text-[#1F4E5F]">Nivel Oro (4+ días/sem)</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#7FB77E]">Top 5%</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Valoración Media</span>
              <span className="text-xs font-black text-[#1F4E5F]">4.9 ★ (28 reseñas)</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-amber-600">Excelente</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Asistencia</span>
              <span className="text-xs font-black text-[#1F4E5F]">100% Palabra de Honor</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-blue-600">0 Faltas</span>
        </div>
      </div>

      {/* 3. Marcas & Ritmos de Referencia */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
          Marcas de Referencia
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-center">
          <div className="p-2 bg-[#EEF2F2]/50 rounded-xl border border-[#1F4E5F]/6">
            <span className="text-xs font-black text-[#1F4E5F]">5:15 /km</span>
            <p className="text-[9px] font-bold text-[#1F4E5F]/60 uppercase mt-0.5">Ritmo Rodaje</p>
          </div>
          <div className="p-2 bg-[#EEF2F2]/50 rounded-xl border border-[#1F4E5F]/6">
            <span className="text-xs font-black text-[#7FB77E]">Nivel 3.5</span>
            <p className="text-[9px] font-bold text-[#1F4E5F]/60 uppercase mt-0.5">Pádel Playtomic</p>
          </div>
        </div>
      </div>

      {/* 4. Resumen de Comunidad */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7FB77E]" />
          <div>
            <span className="text-[10px] font-black text-[#1F4E5F]/60 uppercase block">Comunidad Activa</span>
            <span className="text-xs font-black text-[#1F4E5F]">3 Squads • 24 Atletas</span>
          </div>
        </div>
        <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.5 rounded-full">
          Activo
        </span>
      </div>
    </aside>
  );
};
