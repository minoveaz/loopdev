import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  ChevronRight,
  Edit3,
  Flame,
  MapPin,
  Mountain,
  Plus,
  ShieldCheck,
  Target,
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

function getSportVector(sport: string) {
  const norm = sport.toLowerCase();
  if (norm.includes('run')) return <Activity className="w-3.5 h-3.5 text-[#7FB77E]" />;
  if (norm.includes('pad') || norm.includes('pádel')) return <Target className="w-3.5 h-3.5 text-[#7FB77E]" />;
  if (norm.includes('hik') || norm.includes('trek')) return <Mountain className="w-3.5 h-3.5 text-[#7FB77E]" />;
  return <Flame className="w-3.5 h-3.5 text-[#7FB77E]" />;
}

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
      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-[#1F4E5F] w-full"
    >
      {/* 1. Header Profile Info */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3 cursor-pointer" onClick={onProfileClick}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#7FB77E] shadow-md bg-white"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1F4E5F] text-white font-black text-2xl flex items-center justify-center ring-4 ring-[#7FB77E]">
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#7FB77E] border-2 border-white flex items-center justify-center text-[10px] text-white font-black shadow-xs"
            title="Capitán Verificado CIMO"
          >
            ✓
          </span>
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          <h3
            onClick={onProfileClick}
            className="text-base font-black text-[#1F4E5F] hover:text-[#7FB77E] transition-colors cursor-pointer"
          >
            {user.name}
          </h3>
          {user.handle && (
            <span className="text-xs font-bold text-slate-400">
              {user.handle}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span>{user.city ?? 'Madrid, España'}</span>
          {user.neighborhood && <span className="opacity-80">({user.neighborhood})</span>}
        </p>

        {/* Action button to view profile */}
        <button
          type="button"
          onClick={onProfileClick}
          className="mt-3 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[11px] font-black text-[#1F4E5F] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 min-h-[32px]"
        >
          <Edit3 className="w-3 h-3 text-[#7FB77E]" />
          <span>Ver mi Pasaporte Deportivo</span>
        </button>
      </div>

      {/* 2. Your Sports & Paces Quick Summary */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Tus Deportes & Ritmos
          </span>
          <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
            Activo
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {sportsArray.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs font-bold text-[#1F4E5F] bg-white px-3 py-2 rounded-xl border border-slate-200/70 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                {getSportVector(s.sport)}
                <span>{s.sport}</span>
              </div>
              <span className="text-[11px] font-black text-[#7FB77E]">
                {s.pace || 'Intermedio'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Integrated Weekly Constancy Sub-block (Ley de Fitts: Botones táctiles de min 40px) */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Constancia Semanal
          </span>
          <span className="text-xs font-black text-[#7FB77E] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-[#7FB77E]" />
            5 días
          </span>
        </div>

        {/* 7-Day interactive dots with accessible target area (min 40px) */}
        <div className="grid grid-cols-7 gap-1.5">
          {weeklyDays.map((d) => (
            <div
              key={d.id}
              title={`${d.id}: ${d.active ? 'Día activo de entreno' : 'Descanso'}`}
              className={`h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-default ${
                d.active
                  ? 'bg-[#1F4E5F] text-white shadow-2xs'
                  : 'bg-white text-slate-400 border border-slate-200/60'
              }`}
            >
              {d.short}
            </div>
          ))}
        </div>
      </div>

      {/* 4. CTA: Publicar Entreno como Capitán */}
      <div className="p-4 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-2xl text-white shadow-xs flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[#7FB77E] text-[11px] font-black uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          ¿Tienes una ruta o partida en mente? Convoca a tu microgrupo deportivo.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2.5 rounded-xl bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[44px] mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>
    </aside>
  );
};
