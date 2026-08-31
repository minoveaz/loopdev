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
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Métricas del Atleta">
      {/* 1. Nivel Atlético & Reputación */}
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Pasaporte Atlético Verificado
        </span>

        <div className="flex flex-col gap-3">
          <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Constancia</span>
                <span className="text-xs font-black text-[#1F4E5F]">Nivel Oro (4+ días/sem)</span>
              </div>
            </div>
            <span className="text-xs font-black text-[#7FB77E]">Top 5%</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Valoración Media</span>
                <span className="text-xs font-black text-[#1F4E5F]">4.9 ★ (28 reseñas)</span>
              </div>
            </div>
            <span className="text-xs font-black text-amber-600">Excelente</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Asistencia</span>
                <span className="text-xs font-black text-[#1F4E5F]">100% Palabra de Honor</span>
              </div>
            </div>
            <span className="text-xs font-black text-blue-600">0 Faltas</span>
          </div>
        </div>
      </div>

      {/* 2. Resumen de Conexiones */}
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#7FB77E]" />
          Comunidad Activa
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded-xl border border-[#1F4E5F]/8 text-center">
            <span className="text-lg font-black text-[#1F4E5F]">3</span>
            <p className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase">Squads Activos</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#1F4E5F]/8 text-center">
            <span className="text-lg font-black text-[#7FB77E]">24</span>
            <p className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase">Compañeros</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
