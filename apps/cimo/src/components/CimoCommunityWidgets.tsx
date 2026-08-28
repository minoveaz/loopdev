import React from 'react';
import { Calendar, CheckCircle2, ChevronRight, MessageSquare, ShieldCheck, Sparkles, Users } from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';

export interface CimoCommunityWidgetsProps {
  joinedActivities: ActivityCardData[];
  chats: Record<string, ChatMessage[]>;
  onSelectActivity: (id: string) => void;
  onOpenChatTab?: () => void;
}

const verifiedCaptains = [
  { id: 'c1', name: 'Sofía Díaz', sport: 'Running 8K', rating: '5.0', workouts: 24, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'c2', name: 'Javier Chamartín', sport: 'Pádel Nivel 3.5', rating: '4.9', workouts: 18, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 'c3', name: 'Marta Soler', sport: 'Hiking Sierra', rating: '5.0', workouts: 32, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
];

export const CimoCommunityWidgets: React.FC<CimoCommunityWidgetsProps> = ({
  joinedActivities,
  chats,
  onSelectActivity,
  onOpenChatTab,
}) => {
  return (
    <aside aria-label="Comunidad y entrenos activos" className="flex flex-col gap-4 text-[#1F4E5F] sticky top-20">
      {/* Widget 1: Mis Crews Activos / Próximos Entrenos */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]">
              Tus Próximos Entrenos
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-[#7FB77E]/20 text-[#1F4E5F] px-2 py-0.5 rounded-full">
            {joinedActivities.length}
          </span>
        </div>

        {joinedActivities.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#1F4E5F]/50">
            No tienes entrenos confirmados todavía. Dale a "Unirme" a cualquier plan para reservar tu plaza.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {joinedActivities.map((act) => {
              const msgs = chats[act.id] ?? [];
              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act.id)}
                  className="p-3 bg-[#F7F7F7] hover:bg-[#1F4E5F]/5 rounded-2xl border border-[#1F4E5F]/5 transition-all cursor-pointer flex items-center justify-between gap-2.5"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-[#7FB77E]">{act.sport}</span>
                      <span className="text-[10px] text-[#1F4E5F]/50">•</span>
                      <span className="text-[10px] font-bold text-[#1F4E5F]">{act.date} {act.time}h</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-[#1F4E5F] truncate mt-0.5">{act.title}</h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-[#00B894]">
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
            className="text-xs font-extrabold text-[#00B894] hover:underline flex items-center justify-center gap-1 pt-1 cursor-pointer"
          >
            <span>Abrir todos los chats de mis Crews</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Widget 2: Capitanes Destacados en Madrid */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]">
            Capitanes de la Comunidad
          </span>
          <ShieldCheck className="w-4 h-4 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-2.5">
          {verifiedCaptains.map((capt) => (
            <div key={capt.id} className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={capt.avatarUrl}
                  alt={capt.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#1F4E5F]/15 shrink-0"
                />
                <div className="truncate">
                  <span className="text-xs font-bold text-[#1F4E5F] block truncate">{capt.name}</span>
                  <span className="text-[10px] text-[#1F4E5F]/60 block truncate">{capt.sport}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-[#1F4E5F] block">★ {capt.rating}</span>
                <span className="text-[9px] text-[#7FB77E] font-bold block">{capt.workouts} planes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Filosofía & Garantía CIMO */}
      <div className="p-4 bg-[#7FB77E]/10 border border-[#7FB77E]/20 rounded-3xl text-[#1F4E5F] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#7FB77E] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-extrabold block">Garantía CIMO</span>
          <p className="text-[11px] text-[#1F4E5F]/80 mt-0.5 leading-relaxed">
            Planes 100% deportivos en microgrupos de 4 a 6 personas. Sin citas, sin swipes.
          </p>
        </div>
      </div>
    </aside>
  );
};
