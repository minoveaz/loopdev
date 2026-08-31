import React from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Flame,
  MapPin,
  Mountain,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
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
      className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto"
    >
      {/* 1. Header Profile Info */}
      <div className="flex flex-col items-center text-center pb-2 border-b border-[#1F4E5F]/8">
        <div className="relative mb-2.5 cursor-pointer" onClick={onProfileClick}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-3 ring-[#7FB77E] shadow-sm bg-white"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#1F4E5F] text-white font-black text-xl flex items-center justify-center ring-3 ring-[#7FB77E]">
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#7FB77E] border-2 border-white flex items-center justify-center text-[9px] text-white font-black shadow-2xs"
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
            <span className="text-xs font-bold text-[#1F4E5F]/60">
              {user.handle}
            </span>
          )}
        </div>

        <p className="text-[11px] text-[#1F4E5F]/70 flex items-center gap-1 mt-0.5 font-medium">
          <MapPin className="w-3 h-3 text-[#7FB77E]" />
          <span>{user.city ?? 'Madrid, España'}</span>
          {user.neighborhood && <span className="opacity-80">({user.neighborhood})</span>}
        </p>

        <button
          type="button"
          onClick={onProfileClick}
          className="mt-2.5 px-3 py-1 bg-white hover:bg-[#7FB77E]/10 border border-[#1F4E5F]/15 rounded-full text-[11px] font-black text-[#1F4E5F] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 min-h-[30px]"
        >
          <Edit3 className="w-3 h-3 text-[#7FB77E]" />
          <span>Ver mi Pasaporte Deportivo</span>
        </button>
      </div>

      {/* 2. Your Sports & Paces Quick Summary */}
      <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/8 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Tus Deportes & Ritmos
          </span>
          <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/15 px-2 py-0.2 rounded-full">
            Activo
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {sportsArray.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs font-bold text-[#1F4E5F] bg-[#EEF2F2]/50 px-2.5 py-1.5 rounded-xl border border-[#1F4E5F]/6"
            >
              <div className="flex items-center gap-2">
                {getSportVector(s.sport)}
                <span className="text-xs">{s.sport}</span>
              </div>
              <span className="text-[11px] font-black text-[#7FB77E]">
                {s.pace || 'Intermedio'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Constancia Semanal */}
      <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/8 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Constancia Semanal
          </span>
          <span className="text-xs font-black text-[#7FB77E] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-[#7FB77E]" />
            5 días
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeklyDays.map((d) => (
            <div
              key={d.id}
              title={`${d.id}: ${d.active ? 'Día activo de entreno' : 'Descanso'}`}
              className={`h-8 rounded-lg flex items-center justify-center text-[11px] font-black transition-all cursor-default ${
                d.active
                  ? 'bg-[#1F4E5F] text-white shadow-2xs'
                  : 'bg-[#EEF2F2]/60 text-[#1F4E5F]/40 border border-[#1F4E5F]/6'
              }`}
            >
              {d.short}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Mi Círculo & Squads */}
      <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
            <Users className="w-4 h-4 text-[#1F4E5F]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#1F4E5F]/60 block uppercase">Mi Red</span>
            <span className="text-xs font-black text-[#1F4E5F]">7 Atletas • 3 Squads</span>
          </div>
        </div>
        <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/15 px-2 py-0.5 rounded-full">
          Nivel Oro
        </span>
      </div>

      {/* 5. CTA: Publicar Entreno como Capitán */}
      <div className="p-3.5 bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-2xl text-white shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[#7FB77E] text-[10px] font-black uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-[11px] text-white/90 leading-snug font-medium">
          ¿Tienes una ruta o partida en mente? Convoca a tu microgrupo deportivo.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2 rounded-xl bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[38px] mt-1"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>

      {/* 6. Mini Footer & Enlaces de Comunidad */}
      <div className="pt-2 border-t border-[#1F4E5F]/8 flex flex-col gap-1 text-center mt-auto">
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#1F4E5F]/60">
          <button type="button" onClick={onProfileClick} className="hover:text-[#1F4E5F] transition-colors cursor-pointer">Mi Pasaporte</button>
          <span>•</span>
          <span className="hover:text-[#1F4E5F] cursor-pointer">Soporte</span>
          <span>•</span>
          <span className="hover:text-[#1F4E5F] cursor-pointer">Privacidad</span>
        </div>
        <p className="text-[9px] text-[#1F4E5F]/50 font-medium">
          © 2026 CIMO Sport & Social • Madrid
        </p>
      </div>
    </aside>
  );
};
