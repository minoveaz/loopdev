import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  Link,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export const CimoCrewNetworkStatsWidget: React.FC = () => {
  return (
    <aside
      className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto"
      aria-label="Estadísticas de Red"
    >
      {/* 1. Cabecera de Red Deportiva */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Mi Red Deportiva
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          Madrid Centro
        </span>
      </div>

      {/* 2. Métricas del Círculo Íntimo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 text-center shadow-2xs">
          <span className="text-xl font-black text-[#1F4E5F]">7</span>
          <p className="text-[10px] font-black text-[#1F4E5F]/60 uppercase mt-0.5">
            Círculo Íntimo
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 text-center shadow-2xs">
          <span className="text-xl font-black text-[#7FB77E]">3</span>
          <p className="text-[10px] font-black text-[#1F4E5F]/60 uppercase mt-0.5">
            Squads Activos
          </p>
        </div>
      </div>

      {/* 3. Deportes & Afinidades */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 flex flex-col gap-2 shadow-2xs">
        <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
          Afinidad de Deportes
        </span>
        <div className="flex flex-col gap-1.5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1F4E5F] mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#7FB77E]" /> Running
              </span>
              <span className="text-[#7FB77E] font-black">65%</span>
            </div>
            <div className="w-full bg-[#EEF2F2] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7FB77E] h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1F4E5F] mb-1">
              <span className="flex items-center gap-1.5">
                <Target className="w-3 h-3 text-[#7FB77E]" /> Pádel
              </span>
              <span className="text-[#7FB77E] font-black">25%</span>
            </div>
            <div className="w-full bg-[#EEF2F2] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7FB77E] h-full rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1F4E5F] mb-1">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#7FB77E]" /> Hiking
              </span>
              <span className="text-[#7FB77E] font-black">10%</span>
            </div>
            <div className="w-full bg-[#EEF2F2] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7FB77E] h-full rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Agenda Rápida de tus Squads */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Próximas Sesiones de Squad
          </span>
          <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="p-2 bg-[#EEF2F2]/50 rounded-xl border border-[#1F4E5F]/6 text-xs">
            <div className="flex items-center justify-between font-black text-[#1F4E5F]">
              <span>Retiro Morning Runners</span>
              <span className="text-[#7FB77E] text-[10px]">Mañana 07:30</span>
            </div>
            <span className="text-[10px] text-[#1F4E5F]/60 font-bold block mt-0.5">
              3/5 confirmados • Puerta de Alcalá
            </span>
          </div>

          <div className="p-2 bg-[#EEF2F2]/50 rounded-xl border border-[#1F4E5F]/6 text-xs">
            <div className="flex items-center justify-between font-black text-[#1F4E5F]">
              <span>Cuarteto Pádel</span>
              <span className="text-[#7FB77E] text-[10px]">Viernes 19:00</span>
            </div>
            <span className="text-[10px] text-[#1F4E5F]/60 font-bold block mt-0.5">
              3/4 confirmados • Club Chamartín
            </span>
          </div>
        </div>
      </div>

      {/* 5. Acciones Rápidas */}
      <div className="p-3.5 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-2xl text-white shadow-xs flex flex-col gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-[#7FB77E] text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gestionar Comunidad</span>
        </div>
        <p className="text-[11px] text-white/90 leading-snug font-medium">
          Crea un nuevo micro-equipo o invita a tus amigos a tu círculo íntimo.
        </p>
        <button
          type="button"
          className="w-full py-2 rounded-xl bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Crear Nuevo Squad</span>
        </button>
      </div>
    </aside>
  );
};
