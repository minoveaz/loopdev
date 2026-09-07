import React from 'react';
import {
  Activity,
  Award,
  Edit3,
  Flame,
  MapPin,
  Mountain,
  Plus,
  Target,
  Users,
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
  if (norm.includes('run')) return <Activity className="h-3.5 w-3.5 text-[#7FB77E]" />;
  if (norm.includes('pad') || norm.includes('pádel'))
    return <Target className="h-3.5 w-3.5 text-[#7FB77E]" />;
  if (norm.includes('hik') || norm.includes('trek'))
    return <Mountain className="h-3.5 w-3.5 text-[#7FB77E]" />;
  return <Flame className="h-3.5 w-3.5 text-[#7FB77E]" />;
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
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
    >
      {/* 1. Header Profile Info */}
      <div className="border-[#1F4E5F]/8 flex flex-col items-center border-b pb-2 text-center">
        <div className="relative mb-2.5 cursor-pointer" onClick={onProfileClick}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="ring-3 h-16 w-16 rounded-full bg-white object-cover shadow-sm ring-[#7FB77E]"
            />
          ) : (
            <div className="ring-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4E5F] text-xl font-black text-white ring-[#7FB77E]">
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="shadow-2xs absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#7FB77E] text-[9px] font-black text-white"
            title="Capitán Verificado CIMO"
          >
            ✓
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <h3
            onClick={onProfileClick}
            className="cursor-pointer text-base font-black text-[#1F4E5F] transition-colors hover:text-[#7FB77E]"
          >
            {user.name}
          </h3>
          {user.handle && (
            <span className="text-xs font-bold text-[#1F4E5F]/60">{user.handle}</span>
          )}
        </div>

        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#1F4E5F]/70">
          <MapPin className="h-3 w-3 text-[#7FB77E]" />
          <span>{user.city ?? 'Madrid, España'}</span>
          {user.neighborhood && <span className="opacity-80">({user.neighborhood})</span>}
        </p>

        <button
          type="button"
          onClick={onProfileClick}
          className="shadow-2xs mt-2.5 flex min-h-[30px] cursor-pointer items-center gap-1.5 rounded-full border border-[#1F4E5F]/15 bg-white px-3 py-1 text-[11px] font-black text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/10 active:scale-95"
        >
          <Edit3 className="h-3 w-3 text-[#7FB77E]" />
          <span>Ver mi Pasaporte Deportivo</span>
        </button>
      </div>

      {/* 2. Your Sports & Paces Quick Summary */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Tus Deportes & Ritmos
          </span>
          <span className="py-0.2 rounded-full bg-[#7FB77E]/15 px-2 text-[10px] font-black text-[#7FB77E]">
            Activo
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {sportsArray.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className="border-[#1F4E5F]/6 flex items-center justify-between rounded-xl border bg-[#EEF2F2]/50 px-2.5 py-1.5 text-xs font-bold text-[#1F4E5F]"
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
      <div className="border-[#1F4E5F]/8 shadow-2xs rounded-2xl border bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Constancia Semanal
          </span>
          <span className="flex items-center gap-1 text-xs font-black text-[#7FB77E]">
            <Flame className="h-3.5 w-3.5 fill-[#7FB77E]" />5 días
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeklyDays.map((d) => (
            <div
              key={d.id}
              title={`${d.id}: ${d.active ? 'Día activo de entreno' : 'Descanso'}`}
              className={`flex h-8 cursor-default items-center justify-center rounded-lg text-[11px] font-black transition-all ${
                d.active
                  ? 'shadow-2xs bg-[#1F4E5F] text-white'
                  : 'border-[#1F4E5F]/6 border bg-[#EEF2F2]/60 text-[#1F4E5F]/40'
              }`}
            >
              {d.short}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Mi Círculo & Squads */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center justify-between rounded-2xl border bg-white p-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-[#7FB77E]/15 p-2 text-[#1F4E5F]">
            <Users className="h-4 w-4 text-[#1F4E5F]" />
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-[#1F4E5F]/60">Mi Red</span>
            <span className="text-xs font-black text-[#1F4E5F]">7 Atletas • 3 Squads</span>
          </div>
        </div>
        <span className="rounded-full bg-[#7FB77E]/15 px-2 py-0.5 text-[10px] font-black text-[#7FB77E]">
          Nivel Oro
        </span>
      </div>

      {/* 5. CTA: Publicar Entreno como Capitán */}
      <div className="shadow-xs flex flex-col gap-1.5 rounded-2xl bg-gradient-to-br from-[#1F4E5F] to-[#163a47] p-3.5 text-white">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
          <Award className="h-3.5 w-3.5" />
          <span>Sé Capitán CIMO</span>
        </div>
        <p className="text-[11px] font-medium leading-snug text-white/90">
          ¿Tienes una ruta o partida en mente? Convoca a tu microgrupo deportivo.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="active:scale-98 mt-1 flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#7FB77E] py-2 text-xs font-black text-[#1F4E5F] shadow-md transition-all hover:bg-[#6ea26d]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>

      {/* 6. Mini Footer & Enlaces de Comunidad */}
      <div className="border-[#1F4E5F]/8 mt-auto flex flex-col gap-1 border-t pt-2 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#1F4E5F]/60">
          <button
            type="button"
            onClick={onProfileClick}
            className="cursor-pointer transition-colors hover:text-[#1F4E5F]"
          >
            Mi Pasaporte
          </button>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#1F4E5F]">Soporte</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#1F4E5F]">Privacidad</span>
        </div>
        <p className="text-[9px] font-medium text-[#1F4E5F]/50">
          © 2026 CIMO Sport & Social • Madrid
        </p>
      </div>
    </aside>
  );
};
