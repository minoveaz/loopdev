import React from 'react';
import {
  Activity,
  MapPin,
  Sparkles,
  Target,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';

export interface CimoSuggestedAthletesWidgetProps {
  onNavigateToProfile?: (athleteId: string) => void;
}

const SUGGESTED_ATHLETES = [
  {
    id: 'ath_sug_1',
    name: 'Marcos Herrera',
    sport: 'Running 5:10',
    location: 'Retiro, Madrid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    mutual: 'Amigo de Sofía Díaz',
  },
  {
    id: 'ath_sug_2',
    name: 'Carla Montero',
    sport: 'Pádel Nivel 3.5',
    location: 'Chamartín, Madrid',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    mutual: 'En Squad Pádel 28036',
  },
];

export const CimoSuggestedAthletesWidget: React.FC<CimoSuggestedAthletesWidgetProps> = ({
  onNavigateToProfile,
}) => {
  return (
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Atletas Recomendados">
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Afinidad Deportiva
          </span>
          <span className="text-[10px] font-bold text-[#1F4E5F]/60">Tu Zona</span>
        </div>

        <div className="flex flex-col gap-3">
          {SUGGESTED_ATHLETES.map((ath) => (
            <div
              key={ath.id}
              className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 flex items-center justify-between gap-3 hover:border-[#7FB77E]/50 transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => onNavigateToProfile?.(ath.id)}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#1F4E5F]/10">
                  <img src={ath.avatar} alt={ath.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs text-[#1F4E5F] truncate">{ath.name}</h4>
                  <p className="text-[10px] font-bold text-[#7FB77E] truncate">{ath.sport}</p>
                  <p className="text-[9px] font-medium text-[#1F4E5F]/60 truncate">{ath.mutual}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToProfile?.(ath.id)}
                aria-label={`Ver pasaporte de ${ath.name}`}
                className="p-2 rounded-xl bg-[#7FB77E]/15 hover:bg-[#7FB77E] text-[#1F4E5F] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
