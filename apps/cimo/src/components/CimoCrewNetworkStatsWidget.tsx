import React from 'react';
import {
  Activity,
  Calendar,
  Compass,
  Plus,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

export const CimoCrewNetworkStatsWidget: React.FC = () => {
  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Estadísticas de Red"
    >
      {/* 1. Cabecera de Red Deportiva */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Mi Red Deportiva
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
          Madrid Centro
        </span>
      </div>

      {/* 2. Métricas del Círculo Íntimo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border-[#1F4E5F]/8 shadow-2xs rounded-2xl border bg-white p-3 text-center">
          <span className="text-xl font-black text-[#1F4E5F]">7</span>
          <p className="mt-0.5 text-[10px] font-black uppercase text-[#1F4E5F]/60">
            Círculo Íntimo
          </p>
        </div>
        <div className="border-[#1F4E5F]/8 shadow-2xs rounded-2xl border bg-white p-3 text-center">
          <span className="text-xl font-black text-[#7FB77E]">3</span>
          <p className="mt-0.5 text-[10px] font-black uppercase text-[#1F4E5F]/60">
            Squads Activos
          </p>
        </div>
      </div>

      {/* 3. Deportes & Afinidades */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          Afinidad de Deportes
        </span>
        <div className="flex flex-col gap-1.5">
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#1F4E5F]">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-[#7FB77E]" /> Running
              </span>
              <span className="font-black text-[#7FB77E]">65%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
              <div className="h-full rounded-full bg-[#7FB77E]" style={{ width: '65%' }} />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#1F4E5F]">
              <span className="flex items-center gap-1.5">
                <Target className="h-3 w-3 text-[#7FB77E]" /> Pádel
              </span>
              <span className="font-black text-[#7FB77E]">25%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
              <div className="h-full rounded-full bg-[#7FB77E]" style={{ width: '25%' }} />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#1F4E5F]">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-[#7FB77E]" /> Hiking
              </span>
              <span className="font-black text-[#7FB77E]">10%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
              <div className="h-full rounded-full bg-[#7FB77E]" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Agenda Rápida de tus Squads */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Próximas Sesiones de Squad
          </span>
          <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="border-[#1F4E5F]/6 rounded-xl border bg-[#EEF2F2]/50 p-2 text-xs">
            <div className="flex items-center justify-between font-black text-[#1F4E5F]">
              <span>Retiro Morning Runners</span>
              <span className="text-[10px] text-[#7FB77E]">Mañana 07:30</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-bold text-[#1F4E5F]/60">
              3/5 confirmados • Puerta de Alcalá
            </span>
          </div>

          <div className="border-[#1F4E5F]/6 rounded-xl border bg-[#EEF2F2]/50 p-2 text-xs">
            <div className="flex items-center justify-between font-black text-[#1F4E5F]">
              <span>Cuarteto Pádel</span>
              <span className="text-[10px] text-[#7FB77E]">Viernes 19:00</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-bold text-[#1F4E5F]/60">
              3/4 confirmados • Club Chamartín
            </span>
          </div>
        </div>
      </div>

      {/* 5. Acciones Rápidas */}
      <div className="shadow-xs mt-auto flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-[#1F4E5F] to-[#163a47] p-3.5 text-white">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Gestionar Comunidad</span>
        </div>
        <p className="text-[11px] font-medium leading-snug text-white/90">
          Crea un nuevo micro-equipo o invita a tus amigos a tu círculo íntimo.
        </p>
        <button
          type="button"
          className="active:scale-98 flex min-h-[36px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#7FB77E] py-2 text-xs font-black text-[#1F4E5F] shadow-md transition-all hover:bg-[#6ea26d]"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Crear Nuevo Squad</span>
        </button>
      </div>
    </aside>
  );
};
