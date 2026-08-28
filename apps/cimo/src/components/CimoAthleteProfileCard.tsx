import React from 'react';
import { Award, ChevronRight, Flame, Plus, ShieldCheck, Trophy, Users } from 'lucide-react';

export interface CimoAthleteProfileCardProps {
  user: {
    name: string;
    avatarUrl?: string;
    city?: string;
    completedWorkouts?: number;
    sports?: string[];
  };
  onCreateClick?: () => void;
  onProfileClick?: () => void;
}

const weeklyDays = [
  { day: 'L', active: true, km: '8k' },
  { day: 'M', active: false, km: '-' },
  { day: 'X', active: true, km: 'Pádel' },
  { day: 'J', active: false, km: '-' },
  { day: 'V', active: true, km: 'WOD' },
  { day: 'S', active: true, km: '12k' },
  { day: 'D', active: false, km: '-' },
];

export const CimoAthleteProfileCard: React.FC<CimoAthleteProfileCardProps> = ({
  user,
  onCreateClick,
  onProfileClick,
}) => {
  return (
    <aside aria-label="Perfil del deportista" className="flex flex-col gap-4 text-[#1F4E5F] sticky top-20">
      {/* Mini Profile Card */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center">
        <div className="relative mb-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#1F4E5F]/20 shadow-inner"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1F4E5F] text-white font-black text-2xl flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00B894] border-2 border-white flex items-center justify-center text-[10px] text-white font-black"
            title="Deportista Verificado"
          >
            ✓
          </span>
        </div>

        <h3 className="text-base font-extrabold text-[#1F4E5F]">{user.name}</h3>
        <p className="text-xs text-[#1F4E5F]/60 mt-0.5">{user.city ?? 'Madrid, España'}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 w-full pt-4 mt-4 border-t border-[#1F4E5F]/10">
          <div>
            <span className="text-[10px] font-extrabold text-[#1F4E5F]/50 uppercase block">Entrenos</span>
            <span className="text-sm font-black text-[#1F4E5F]">{user.completedWorkouts ?? 12}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#1F4E5F]/50 uppercase block">Crews</span>
            <span className="text-sm font-black text-[#1F4E5F]">3</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#1F4E5F]/50 uppercase block">Puntual</span>
            <span className="text-sm font-black text-[#7FB77E]">100%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="w-full py-2.5 px-3 rounded-2xl bg-[#F7F7F7] hover:bg-[#1F4E5F]/5 border border-[#1F4E5F]/10 text-xs font-extrabold text-[#1F4E5F] mt-4 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Ver mi perfil completo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekly Training Constancy Widget (Strava Style) */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70">
            Esta Semana
          </span>
          <span className="text-xs font-black text-[#00B894]">4 entrenos</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weeklyDays.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-[#1F4E5F]/50">{d.day}</span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-transform ${
                  d.active
                    ? 'bg-[#1F4E5F] text-white shadow-2xs scale-105'
                    : 'bg-[#F7F7F7] text-[#1F4E5F]/30 border border-[#1F4E5F]/5'
                }`}
              >
                {d.active ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Activity Callout */}
      <div className="p-5 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-3xl text-white shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#7FB77E] text-xs font-black uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          ¿Tienes un entrenamiento planeado? Publica tu Crew y corre o juega al pádel acompañado.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2.5 px-4 rounded-full bg-[#00B894] hover:bg-[#009678] text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear un nuevo plan</span>
        </button>
      </div>
    </aside>
  );
};
