import React from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
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
}

const verifiedCaptains = [
  {
    id: 'c1',
    name: 'Sofía Díaz',
    sport: '🏃 Running 8K',
    rating: '5.0',
    workouts: 24,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'c2',
    name: 'Javier Chamartín',
    sport: '🎾 Pádel 3.5',
    rating: '4.9',
    workouts: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'c3',
    name: 'Marta Soler',
    sport: '🥾 Hiking Sierra',
    rating: '5.0',
    workouts: 32,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
];

export const CimoCommunityWidgets: React.FC<CimoCommunityWidgetsProps> = ({
  joinedActivities,
  chats,
  onSelectActivity,
  onOpenChatTab,
}) => {
  return (
    <aside
      aria-label="Radar Comunitario y Entrenos Activos"
      className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-[#1F4E5F] w-full"
    >
      {/* 1. Tus Próximos Entrenos Confirmados */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1F4E5F]/10">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#7FB77E]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Tus Próximos Entrenos
            </span>
          </div>
          <span className="text-[10px] font-black bg-[#7FB77E]/15 text-[#7FB77E] px-2 py-0.5 rounded-full">
            {joinedActivities.length} activo(s)
          </span>
        </div>

        {joinedActivities.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#1F4E5F]/60 font-medium">
            No te has unido a ningún entreno todavía. Pulsa <strong className="text-[#1F4E5F]">"Unirme"</strong> en el feed para reservar tu plaza.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {joinedActivities.map((act) => {
              const msgs = chats[act.id] ?? [];
              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act.id)}
                  className="p-3 bg-[#F7F7F7] hover:bg-[#7FB77E]/5 rounded-2xl border border-[#1F4E5F]/10 hover:border-[#7FB77E]/40 transition-all cursor-pointer flex items-center justify-between gap-2.5 shadow-2xs"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-[#7FB77E]">
                        {act.sport}
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/40">•</span>
                      <span className="text-[10px] font-black text-[#1F4E5F]">
                        {act.date} {act.time}h
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-[#1F4E5F] truncate mt-0.5">
                      {act.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-[#7FB77E] bg-white px-2 py-1 rounded-xl border border-[#1F4E5F]/5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black">{msgs.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {joinedActivities.length > 0 && (
          <button
            type="button"
            onClick={onOpenChatTab}
            className="text-xs font-black text-[#7FB77E] hover:underline flex items-center justify-center gap-1 pt-0.5 cursor-pointer"
          >
            <span>Abrir todos los chats de mis Crews</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Desafío Comunitario de la Semana */}
      <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#1F4E5F]">
            <Target className="w-4 h-4 text-amber-500" />
            <span>Desafío Semanal Madrid</span>
          </div>
          <span className="text-[10px] font-black text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full">
            71%
          </span>
        </div>

        <div className="w-full bg-[#1F4E5F]/10 h-2 rounded-full overflow-hidden">
          <div className="bg-[#7FB77E] h-full rounded-full transition-all" style={{ width: '71%' }} />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-[#1F4E5F]/70">
          <span>1.420 km sumados</span>
          <span>Meta: 2.000 km</span>
        </div>
      </div>

      {/* 3. Capitanes Destacados en Madrid */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#1F4E5F]/10">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Capitanes de la Comunidad
          </span>
          <ShieldCheck className="w-4 h-4 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-2.5">
          {verifiedCaptains.map((capt) => (
            <div
              key={capt.id}
              className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#F7F7F7] transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={capt.avatarUrl}
                  alt={capt.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#1F4E5F]/15 shrink-0"
                />
                <div className="truncate">
                  <span className="text-xs font-black text-[#1F4E5F] block truncate">
                    {capt.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#1F4E5F]/60 block truncate">
                    {capt.sport}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-[#1F4E5F] block">
                  ★ {capt.rating}
                </span>
                <span className="text-[9px] text-[#7FB77E] font-bold block">
                  {capt.workouts} planes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filosofía & Garantía CIMO */}
      <div className="p-3.5 bg-[#7FB77E]/10 border border-[#7FB77E]/20 rounded-2xl text-[#1F4E5F] flex items-start gap-2.5 mt-auto">
        <Sparkles className="w-4 h-4 text-[#7FB77E] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-black block text-[11px]">Garantía CIMO</span>
          <p className="text-[10px] text-[#1F4E5F]/80 mt-0.5 leading-relaxed font-medium">
            Planes 100% deportivos en microgrupos de 4 a 6 personas con ritmos homogéneos.
          </p>
        </div>
      </div>
    </aside>
  );
};
