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
  { day: 'L', active: true },
  { day: 'M', active: false },
  { day: 'X', active: true },
  { day: 'J', active: false },
  { day: 'V', active: true },
  { day: 'S', active: true },
  { day: 'D', active: false },
];

export const CimoAthleteProfileCard: React.FC<CimoAthleteProfileCardProps> = ({
  user,
  onCreateClick,
  onProfileClick,
}) => {
  return (
    <aside
      aria-label="Perfil del deportista"
      className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-[#1F4E5F] sticky top-20"
    >
      {/* Header Profile Info */}
      <div className="flex flex-col items-center text-center">
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
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00B894] border-2 border-white flex items-center justify-center text-[10px] text-white font-black shadow-2xs"
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
      </div>

      {/* Integrated Weekly Constancy Sub-block */}
      <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Constancia Semanal
          </span>
          <span className="text-[11px] font-black text-[#00B894]">4 entrenos</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weeklyDays.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-extrabold text-[#1F4E5F]/50">{d.day}</span>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-transform ${
                  d.active
                    ? 'bg-[#1F4E5F] text-white shadow-2xs'
                    : 'bg-white text-[#1F4E5F]/20 border border-[#1F4E5F]/5'
                }`}
              >
                {d.active ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Callout CTA: Sé Capitán */}
      <div className="p-4 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-2xl text-white shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-[#7FB77E] text-[11px] font-black uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          Publica tu propio entreno grupal de running, pádel o hiking.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2 px-3 rounded-xl bg-[#00B894] hover:bg-[#009678] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 mt-0.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Crear un nuevo plan</span>
        </button>
      </div>

      {/* Profile link */}
      <button
        type="button"
        onClick={onProfileClick}
        className="w-full py-2.5 px-3 rounded-2xl bg-[#F7F7F7] hover:bg-[#1F4E5F]/5 text-xs font-extrabold text-[#1F4E5F] transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#1F4E5F]/5"
      >
        <span>Ver mi perfil completo</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
