import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Coffee,
  MapPin,
  Plus,
  Send,
  Share2,
} from 'lucide-react';
import type {  } from '../data/mockCrewNetwork';
import { getSquadBySlugOrId } from '../data/mockCrewNetwork';

export interface CimoSquadHubViewProps {
  squadId: string;
  onBackToCrew: () => void;
  onNavigateToProfile: (athleteId: string) => void;
  onSelectActivity: (activityId: string) => void;
  onCreateWorkout?: () => void;
}

export const CimoSquadHubView: React.FC<CimoSquadHubViewProps> = ({
  squadId,
  onBackToCrew,
  onNavigateToProfile,
  onSelectActivity,
  onCreateWorkout,
}) => {
  const squad = getSquadBySlugOrId(squadId);
  const [activeTab, setActiveTab] = useState<'convocatorias' | 'members' | 'chat'>('convocatorias');
  const [shareCopied, setShareCopied] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Sofía Díaz',
      text: '¡Mañana rodaje suave por El Retiro a las 07:30h!',
      time: '18:40',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: '2',
      sender: 'Marco Rossi',
      text: 'Allí estaré. Llevo bidón de isotónico.',
      time: '19:05',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleShareSquad = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'Tú (Alex)',
        text: newMessage.trim(),
        time: 'Ahora',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-16 text-[#1F4E5F]">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToCrew}
          className="shadow-2xs inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#1F4E5F]/10 bg-white px-3.5 py-2 text-xs font-bold text-[#1F4E5F]/70 transition-all hover:border-[#1F4E5F]/30 hover:text-[#1F4E5F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Mi Crew</span>
        </button>

        <button
          type="button"
          onClick={handleShareSquad}
          className="shadow-2xs inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#1F4E5F] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#1F4E5F]/90"
        >
          {shareCopied ? (
            <Check className="h-4 w-4 text-[#7FB77E]" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir Squad (WhatsApp)'}</span>
        </button>
      </div>

      {/* Squad Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1F4E5F]/20 bg-[#1F4E5F] p-8 text-white shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#7FB77E]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#7FB77E] text-3xl font-black text-[#1F4E5F] shadow-md">
              {squad.badgeEmoji}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                  Squad Habitual CIMO
                </span>
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" /> {squad.location}
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-white md:text-3xl">
                {squad.name}
              </h1>

              <p className="mt-1 text-xs font-medium text-white/80">
                Frecuencia: <strong className="text-white">{squad.recurringSchedule}</strong> •
                Ritmo: <strong className="text-[#7FB77E]">{squad.typicalPaceOrLevel}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCreateWorkout}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#7FB77E] px-4 py-2.5 text-xs font-black text-[#1F4E5F] shadow-sm transition-all hover:bg-[#7FB77E]/90"
            >
              <Plus className="h-4 w-4" />
              <span>+ Convocar Entreno</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1F4E5F]/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('convocatorias')}
          className={`cursor-pointer rounded-2xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'convocatorias'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'text-[#1F4E5F]/70 hover:bg-white hover:text-[#1F4E5F]'
          }`}
        >
          📅 Convocatorias Activas
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`cursor-pointer rounded-2xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'members'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'text-[#1F4E5F]/70 hover:bg-white hover:text-[#1F4E5F]'
          }`}
        >
          👥 Miembros del Squad ({squad.members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`cursor-pointer rounded-2xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'chat'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'text-[#1F4E5F]/70 hover:bg-white hover:text-[#1F4E5F]'
          }`}
        >
          💬 Chat del Squad ({messages.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'convocatorias' && (
        <div className="flex flex-col gap-4">
          {squad.activeCallout ? (
            <div className="shadow-xs flex flex-col gap-4 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#7FB77E]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                  Próxima Sesión Oficial
                </span>
                <span className="text-xs font-bold text-[#1F4E5F]">
                  {squad.activeCallout.attendingMembers.length}/{squad.activeCallout.maxCapacity}{' '}
                  confirmados
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#1F4E5F]">{squad.activeCallout.title}</h3>
                <p className="mt-1 flex items-center gap-2 text-xs text-[#1F4E5F]/70">
                  <span>
                    📅 {squad.activeCallout.date} a las {squad.activeCallout.time}
                  </span>
                  <span>•</span>
                  <span>📍 {squad.activeCallout.meetingPoint}</span>
                </p>
              </div>

              {squad.activeCallout.hasThirdHalf && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-amber-200/60 bg-[#FFFBEB] p-3 text-xs font-bold text-amber-900">
                  <Coffee className="h-4 w-4 shrink-0 text-amber-700" />
                  <span>Tercer Tiempo: {squad.activeCallout.thirdHalfVenue}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#1F4E5F]/10 pt-2">
                <div className="flex items-center -space-x-2">
                  {squad.activeCallout.attendingMembers.map((m) => (
                    <img
                      key={m.id}
                      src={m.avatarUrl}
                      alt={m.name}
                      onClick={() => onNavigateToProfile(m.id)}
                      className="h-8 w-8 cursor-pointer rounded-full border-2 border-white object-cover transition-transform hover:scale-110"
                      title={m.name}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectActivity('act_1')}
                  className="cursor-pointer rounded-2xl bg-[#1F4E5F] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#1F4E5F]/90"
                >
                  Ver Ficha de Entreno
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#1F4E5F]/60">
              No hay convocatorias activas en este momento.
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {squad.members.map((member) => (
            <div
              key={member.id}
              onClick={() => onNavigateToProfile(member.id)}
              className="shadow-2xs group flex cursor-pointer items-center justify-between rounded-2xl border border-[#1F4E5F]/10 bg-white p-4 transition-all hover:border-[#7FB77E]/40"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-11 w-11 rounded-2xl border border-[#1F4E5F]/10 object-cover transition-transform group-hover:scale-105"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#1F4E5F]">{member.name}</h4>
                    {member.isCaptain && (
                      <span className="rounded-md bg-[#7FB77E]/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#7FB77E]">
                        Capitán
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-[#1F4E5F]/60">
                    Miembro habitual
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-[#7FB77E] group-hover:underline">
                Ver Perfil →
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="shadow-xs flex flex-col gap-4 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6">
          <div className="flex max-h-[360px] min-h-[220px] flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5">
                <img
                  src={m.avatar}
                  alt={m.sender}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <div className="max-w-lg rounded-2xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-3">
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <strong className="font-black text-[#1F4E5F]">{m.sender}</strong>
                    <span className="text-[#1F4E5F]/40">{m.time}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-[#1F4E5F]">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-[#1F4E5F]/10 pt-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Escribe un mensaje para ${squad.name}...`}
              className="flex-1 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-4 py-2.5 text-xs text-[#1F4E5F] focus:border-[#7FB77E] focus:outline-none"
            />
            <button
              type="submit"
              className="shadow-2xs flex cursor-pointer items-center gap-1.5 rounded-2xl bg-[#7FB77E] px-4 py-2.5 text-xs font-black text-[#1F4E5F] hover:bg-[#7FB77E]/90"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
