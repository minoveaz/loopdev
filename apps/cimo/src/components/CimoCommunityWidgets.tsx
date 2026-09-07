import React from 'react';
import {
  Calendar,
  ChevronRight,
  Coffee,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';

export interface CimoCommunityWidgetsProps {
  joinedActivities: ActivityCardData[];
  chats: Record<string, ChatMessage[]>;
  onSelectActivity: (id: string) => void;
  onOpenChatTab?: () => void;
  onNavigateToProfile?: (athleteId: string) => void;
}

const verifiedCaptains = [
  {
    id: 'sofia-diaz',
    name: 'Sofía Díaz',
    sport: 'Running 8K',
    rating: '5.0',
    workouts: 24,
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'javier-chamartin',
    name: 'Javier Chamartín',
    sport: 'Pádel 3.5',
    rating: '4.9',
    workouts: 18,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'marta-soler',
    name: 'Marta Soler',
    sport: 'Hiking Sierra',
    rating: '5.0',
    workouts: 32,
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
];

export const CimoCommunityWidgets: React.FC<CimoCommunityWidgetsProps> = ({
  joinedActivities,
  chats,
  onSelectActivity,
  onNavigateToProfile,
}) => {
  return (
    <aside
      aria-label="Radar Comunitario y Entrenos Activos"
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
    >
      {/* 1. Tus Próximos Entrenos Confirmados */}
      <div className="flex flex-col gap-2.5">
        <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Tus Próximos Entrenos
            </span>
          </div>
          <span className="py-0.2 rounded-full bg-[#7FB77E]/15 px-2 text-[9px] font-black text-[#7FB77E]">
            {joinedActivities.length} activo(s)
          </span>
        </div>

        {joinedActivities.length === 0 ? (
          <div className="border-[#1F4E5F]/8 shadow-2xs rounded-2xl border bg-white p-3 text-center text-[11px] font-medium text-[#1F4E5F]/60">
            No te has unido a ningún entreno todavía. Pulsa{' '}
            <strong className="text-[#1F4E5F]">"Unirme"</strong> en el feed para reservar plaza.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {joinedActivities.map((act) => {
              const msgs = chats[act.id] ?? [];
              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act.id)}
                  className="border-[#1F4E5F]/8 shadow-2xs flex cursor-pointer items-center justify-between gap-2 rounded-2xl border bg-white p-2.5 transition-all hover:border-[#7FB77E]/40 hover:bg-[#7FB77E]/5"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase text-[#7FB77E]">
                        {act.sport}
                      </span>
                      <span className="text-[9px] text-[#1F4E5F]/40">•</span>
                      <span className="text-[10px] font-black text-[#1F4E5F]">
                        {act.date} {act.time}h
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-black text-[#1F4E5F]">{act.title}</p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1">
                    <div className="flex items-center gap-1 rounded-xl bg-[#EEF2F2] px-2 py-1 text-[11px] font-black text-[#1F4E5F]">
                      <MessageSquare className="h-3 w-3 text-[#7FB77E]" />
                      <span>{msgs.length || 3}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-[#1F4E5F]/40" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Desafío de la Comunidad (Gamificación Activa) */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#E0A96D]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Desafío Madrid 2.000 KM
            </span>
          </div>
          <span className="text-[10px] font-black text-[#7FB77E]">71%</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7FB77E] to-[#E0A96D] transition-all duration-1000"
            style={{ width: '71%' }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-[#1F4E5F]/60">
          <span>1.420 km sumados</span>
          <span>Meta: 2.000 km</span>
        </div>
      </div>

      {/* 3. Capitanes Top de la Comunidad */}
      <div className="flex flex-col gap-2">
        <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Capitanes de la Comunidad
            </span>
          </div>
          <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
            Verificados
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {verifiedCaptains.map((cap) => (
            <div
              key={cap.id}
              onClick={() => onNavigateToProfile && onNavigateToProfile(cap.id)}
              className="border-[#1F4E5F]/8 shadow-2xs flex cursor-pointer items-center justify-between rounded-xl border bg-white p-2 transition-all hover:bg-[#7FB77E]/5"
            >
              <div className="flex items-center gap-2">
                <img
                  src={cap.avatarUrl}
                  alt={cap.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-[#7FB77E]/60"
                />
                <div>
                  <h4 className="text-xs font-black leading-tight text-[#1F4E5F]">{cap.name}</h4>
                  <span className="block text-[10px] font-bold text-[#1F4E5F]/60">{cap.sport}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="flex items-center justify-end gap-0.5 text-[11px] font-black text-[#1F4E5F]">
                  ★ {cap.rating}
                </span>
                <span className="text-[9px] font-bold text-[#7FB77E]">{cap.workouts} planes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hotspots Populares de Tercer Tiempo */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-1.5 rounded-2xl border bg-white p-3">
        <div className="flex items-center gap-1.5">
          <Coffee className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Hotspots Tercer Tiempo
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="border-[#1F4E5F]/6 rounded-lg border bg-[#EEF2F2]/60 px-2.5 py-1 text-[10px] font-bold text-[#1F4E5F]">
            ☕ Café Murillo (Retiro)
          </span>
          <span className="border-[#1F4E5F]/6 rounded-lg border bg-[#EEF2F2]/60 px-2.5 py-1 text-[10px] font-bold text-[#1F4E5F]">
            🍻 Terraza Florida Park
          </span>
        </div>
      </div>

      {/* 5. Garantía & Compromiso CIMO */}
      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7FB77E]" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Garantía & Compromiso CIMO</h4>
          <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Planes 100% deportivos en microgrupos de 4 a 8 personas con ritmos homogéneos y
            confirmación previa.
          </p>
        </div>
      </div>
    </aside>
  );
};
