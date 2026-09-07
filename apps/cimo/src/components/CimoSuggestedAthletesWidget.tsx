import React from 'react';
import {
  Flame,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export interface CimoSuggestedAthletesWidgetProps {
  onNavigateToProfile?: (athleteId: string) => void;
}

const SUGGESTED_ATHLETES = [
  {
    id: 'ath_sug_1',
    name: 'Marcos Herrera',
    sport: 'Running 5:10 min/km',
    location: 'Retiro, Madrid',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    mutual: 'Amigo de Sofía Díaz',
  },
  {
    id: 'ath_sug_2',
    name: 'Carla Montero',
    sport: 'Pádel Nivel 3.5',
    location: 'Chamartín, Madrid',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    mutual: 'En Squad Pádel 28036',
  },
  {
    id: 'ath_sug_3',
    name: 'David Ramos',
    sport: 'Running 4:45 min/km',
    location: 'Chamberí, Madrid',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    mutual: '12 entrenos completados',
  },
  {
    id: 'ath_sug_4',
    name: 'Laura Valls',
    sport: 'Hiking Sierra 14K',
    location: 'Guadarrama, Madrid',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    mutual: 'Capitana en CIMO',
  },
];

const FREQUENT_TEAMMATES = [
  {
    id: 'capt_1',
    name: 'Sofía Díaz',
    sport: 'Running',
    workouts: 14,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'usr_2',
    name: 'Marco',
    sport: 'Running',
    workouts: 9,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'usr_3',
    name: 'Elena',
    sport: 'Hiking',
    workouts: 7,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  },
];

export const CimoSuggestedAthletesWidget: React.FC<CimoSuggestedAthletesWidgetProps> = ({
  onNavigateToProfile,
}) => {
  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Atletas Recomendados"
    >
      {/* 1. Atletas Sugeridos por Afinidad */}
      <div className="flex flex-col gap-2">
        <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Afinidad Deportiva
            </span>
          </div>
          <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
            Tu Zona
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {SUGGESTED_ATHLETES.map((ath) => (
            <div
              key={ath.id}
              className="border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between gap-2.5 rounded-2xl border bg-white p-2.5 transition-all hover:border-[#7FB77E]/50"
            >
              <button
                type="button"
                onClick={() => onNavigateToProfile?.(ath.id)}
                className="flex min-w-0 cursor-pointer items-center gap-2 text-left"
              >
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-[#1F4E5F]/10">
                  <img src={ath.avatar} alt={ath.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-black text-[#1F4E5F]">{ath.name}</h4>
                  <p className="truncate text-[9px] font-bold text-[#7FB77E]">{ath.sport}</p>
                  <p className="truncate text-[8px] font-medium text-[#1F4E5F]/60">{ath.mutual}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToProfile?.(ath.id)}
                aria-label={`Ver pasaporte de ${ath.name}`}
                className="shrink-0 cursor-pointer rounded-lg bg-[#7FB77E]/15 p-1.5 text-[#1F4E5F] transition-colors hover:bg-[#7FB77E] hover:text-white"
              >
                <UserPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Compañeros más Frecuentes */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Compañeros Frecuentes
          </span>
          <Flame className="h-3.5 w-3.5 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          {FREQUENT_TEAMMATES.map((tm) => (
            <div
              key={tm.id}
              onClick={() => onNavigateToProfile?.(tm.id)}
              className="flex cursor-pointer items-center justify-between rounded-xl bg-[#EEF2F2]/50 p-1.5 transition-all hover:bg-[#7FB77E]/10"
            >
              <div className="flex items-center gap-2">
                <img src={tm.avatar} alt={tm.name} className="h-6 w-6 rounded-full object-cover" />
                <span className="text-xs font-black text-[#1F4E5F]">{tm.name}</span>
              </div>
              <span className="text-[10px] font-bold text-[#7FB77E]">{tm.workouts} entrenos</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Garantía de Respeto CIMO */}
      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7FB77E]" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Compromiso & Respeto</h4>
          <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Entrenamientos seguros, grupos con ritmo compatible y puntualidad garantizada en cada
            sesión.
          </p>
        </div>
      </div>
    </aside>
  );
};
