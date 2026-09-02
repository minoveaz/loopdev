import React from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Flame,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
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
  onOpenChatTab,
  onNavigateToProfile,
}) => {
  return (
    <aside
      aria-label="Radar Comunitario y Entrenos Activos"
      className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto"
    >
      {/* 1. Tus Próximos Entrenos Confirmados */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Tus Próximos Entrenos
            </span>
          </div>
          <span className="text-[9px] font-black bg-[#7FB77E]/15 text-[#7FB77E] px-2 py-0.2 rounded-full">
            {joinedActivities.length} activo(s)
          </span>
        </div>

        {joinedActivities.length === 0 ? (
          <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/8 text-center text-[11px] text-[#1F4E5F]/60 font-medium shadow-2xs">
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
                  className="p-2.5 bg-white hover:bg-[#7FB77E]/5 rounded-2xl border border-[#1F4E5F]/8 hover:border-[#7FB77E]/40 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
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
                    <p className="text-xs font-black text-[#1F4E5F] truncate mt-0.5">{act.title}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#1F4E5F] bg-[#EEF2F2] px-2 py-1 rounded-xl">
                      <MessageSquare className="w-3 h-3 text-[#7FB77E]" />
                      <span>{msgs.length || 3}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#1F4E5F]/40" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Desafío de la Comunidad (Gamificación Activa) */}
      <div className="p-3.5 bg-white rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Desafío Madrid 2.000 KM
            </span>
          </div>
          <span className="text-[10px] font-black text-[#7FB77E]">71%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#EEF2F2] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#7FB77E] to-[#E0A96D] h-full rounded-full transition-all duration-1000"
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
        <div className="flex items-center justify-between pb-1.5 border-b border-[#1F4E5F]/8">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Capitanes de la Comunidad
            </span>
          </div>
          <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
            Verificados
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {verifiedCaptains.map((cap) => (
            <div
              key={cap.id}
              onClick={() => onNavigateToProfile && onNavigateToProfile(cap.id)}
              className="p-2 bg-white hover:bg-[#7FB77E]/5 rounded-xl border border-[#1F4E5F]/8 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <img
                  src={cap.avatarUrl}
                  alt={cap.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#7FB77E]/60"
                />
                <div>
                  <h4 className="text-xs font-black text-[#1F4E5F] leading-tight">{cap.name}</h4>
                  <span className="text-[10px] text-[#1F4E5F]/60 font-bold block">{cap.sport}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-black text-[#1F4E5F] flex items-center gap-0.5 justify-end">
                  ★ {cap.rating}
                </span>
                <span className="text-[9px] font-bold text-[#7FB77E]">{cap.workouts} planes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hotspots Populares de Tercer Tiempo */}
      <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Hotspots Tercer Tiempo
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="px-2.5 py-1 bg-[#EEF2F2]/60 rounded-lg text-[10px] font-bold text-[#1F4E5F] border border-[#1F4E5F]/6">
            ☕ Café Murillo (Retiro)
          </span>
          <span className="px-2.5 py-1 bg-[#EEF2F2]/60 rounded-lg text-[10px] font-bold text-[#1F4E5F] border border-[#1F4E5F]/6">
            🍻 Terraza Florida Park
          </span>
        </div>
      </div>

      {/* 5. Garantía & Compromiso CIMO */}
      <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-start gap-2.5 mt-auto">
        <ShieldCheck className="w-4 h-4 text-[#7FB77E] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Garantía & Compromiso CIMO</h4>
          <p className="text-[10px] text-[#1F4E5F]/75 leading-relaxed mt-0.5 font-medium">
            Planes 100% deportivos en microgrupos de 4 a 8 personas con ritmos homogéneos y
            confirmación previa.
          </p>
        </div>
      </div>
    </aside>
  );
};
