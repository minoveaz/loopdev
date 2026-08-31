import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  Compass,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export const CimoCrewNetworkStatsWidget: React.FC = () => {
  return (
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Estadísticas de Red">
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Mi Red Deportiva
          </span>
          <span className="text-xs font-black text-[#1F4E5F]">Madrid Centro</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 text-center">
            <span className="text-xl font-black text-[#1F4E5F]">7</span>
            <p className="text-[10px] font-black text-[#1F4E5F]/60 uppercase mt-0.5">Círculo Íntimo</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 text-center">
            <span className="text-xl font-black text-[#7FB77E]">3</span>
            <p className="text-[10px] font-black text-[#1F4E5F]/60 uppercase mt-0.5">Squads Activos</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/70 tracking-wide">
            Deportes Compartidos
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#7FB77E]/15 text-[#1F4E5F] text-[11px] font-black flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#7FB77E]" />
              Running (65%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#7FB77E]/15 text-[#1F4E5F] text-[11px] font-black flex items-center gap-1">
              <Target className="w-3 h-3 text-[#7FB77E]" />
              Pádel (25%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#7FB77E]/15 text-[#1F4E5F] text-[11px] font-black flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#7FB77E]" />
              Hiking (10%)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
