import React from 'react';
import {
  Award,
  Calendar,
  ChevronRight,
  Edit3,
  Flame,
  MapPin,
  Plus,
  ShieldCheck,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export interface CimoAthleteProfileCardProps {
  user: {
    name: string;
    handle?: string;
    avatarUrl?: string;
    city?: string;
    neighborhood?: string;
    completedWorkouts?: number;
    sports?: string[] | Array<{ sport: string; level?: string; pace?: string }>;
    weeklySchedule?: Record<string, string[]>;
  };
  onCreateClick?: () => void;
  onProfileClick?: () => void;
}

const weeklyDays = [
  { id: 'Lunes', short: 'L', active: true },
  { id: 'Martes', short: 'M', active: false },
  { id: 'Miércoles', short: 'X', active: true },
  { id: 'Jueves', short: 'J', active: true },
  { id: 'Viernes', short: 'V', active: false },
  { id: 'Sábado', short: 'S', active: true },
  { id: 'Domingo', short: 'D', active: true },
];

export const CimoAthleteProfileCard: React.FC<CimoAthleteProfileCardProps> = ({
  user,
  onCreateClick,
  onProfileClick,
}) => {
  const sportsArray = Array.isArray(user.sports)
    ? user.sports.map((s) => (typeof s === 'string' ? { sport: s, pace: '' } : s))
    : [
        { sport: 'Running', pace: '5:15 min/km' },
        { sport: 'Pádel', pace: 'Nivel 3.5' },
        { sport: 'Hiking', pace: '10-15 km' },
      ];

  return (
    <aside
      aria-label="Centro de Control del Atleta"
      className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-[#1F4E5F] w-full"
    >
      {/* 1. Header Profile Info */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3 cursor-pointer" onClick={onProfileClick}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-3 border-[#00B894] shadow-md bg-white"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1F4E5F] text-white font-black text-2xl flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00B894] border-2 border-white flex items-center justify-center text-[10px] text-white font-black shadow-xs"
            title="Capitán Verificado CIMO"
          >
            ✓
          </span>
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          <h3
            onClick={onProfileClick}
            className="text-base font-black text-[#1F4E5F] hover:text-[#00B894] transition-colors cursor-pointer"
          >
            {user.name}
          </h3>
          {user.handle && (
            <span className="text-xs font-bold text-[#1F4E5F]/50">
              {user.handle}
            </span>
          )}
        </div>

        <p className="text-xs text-[#1F4E5F]/70 flex items-center gap-1 mt-0.5 font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#00B894]" />
          <span>{user.city ?? 'Madrid, España'}</span>
          {user.neighborhood && <span className="opacity-80">({user.neighborhood})</span>}
        </p>

        {/* Action button to view profile */}
        <button
          type="button"
          onClick={onProfileClick}
          className="mt-2.5 px-3 py-1 bg-[#F7F7F7] hover:bg-[#1F4E5F]/5 border border-[#1F4E5F]/10 rounded-full text-[11px] font-black text-[#1F4E5F] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-[#00B894]" />
          <span>Ver mi Pasaporte Deportivo</span>
        </button>
      </div>

      {/* 2. Your Sports & Paces Quick Summary */}
      <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Tus Deportes & Ritmos
          </span>
          <span className="text-[10px] font-black text-[#00B894]">Activo</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {sportsArray.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs font-bold text-[#1F4E5F] bg-white p-2 rounded-xl border border-[#1F4E5F]/5 shadow-2xs"
            >
              <span>{s.sport}</span>
              <span className="text-[11px] font-black text-[#00B894]">
                {s.pace || 'Intermedio'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Integrated Weekly Constancy Sub-block */}
      <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Constancia Semanal
          </span>
          <span className="text-[11px] font-black text-[#00B894]">4 entrenos</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weeklyDays.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-extrabold text-[#1F4E5F]/50">{d.short}</span>
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

      {/* 4. CTA: Publicar Entreno como Capitán */}
      <div className="p-4 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-2xl text-white shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-[#00B894] text-[11px] font-black uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          ¿Tienes una ruta o partida en mente? Crea tu entreno y reúne a tu microgrupo.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2.5 rounded-xl bg-[#00B894] hover:bg-[#009678] text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>
    </aside>
  );
};
