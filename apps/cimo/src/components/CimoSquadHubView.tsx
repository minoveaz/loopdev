import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Copy,
  Flame,
  Globe,
  HelpCircle,
  MapPin,
  MessageSquare,
  Mountain,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import type { SportsSquad } from '../data/mockCrewNetwork';
import { INITIAL_SPORTS_SQUADS } from '../data/mockCrewNetwork';

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
  const squad = INITIAL_SPORTS_SQUADS.find((s) => s.id === squadId) ?? INITIAL_SPORTS_SQUADS[0];
  const [activeTab, setActiveTab] = useState<'convocatorias' | 'members' | 'chat'>('convocatorias');
  const [shareCopied, setShareCopied] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Sofía Díaz', text: '¡Mañana rodaje suave por El Retiro a las 07:30h!', time: '18:40', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { id: '2', sender: 'Marco Rossi', text: 'Allí estaré. Llevo bidón de isotónico.', time: '19:05', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
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
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16 text-[#1F4E5F]">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToCrew}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1F4E5F]/70 hover:text-[#1F4E5F] bg-white border border-[#1F4E5F]/10 hover:border-[#1F4E5F]/30 px-3.5 py-2 rounded-2xl transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mi Crew</span>
        </button>

        <button
          type="button"
          onClick={handleShareSquad}
          className="inline-flex items-center gap-2 text-xs font-bold bg-[#1F4E5F] text-white hover:bg-[#1F4E5F]/90 px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-2xs"
        >
          {shareCopied ? <Check className="w-4 h-4 text-[#7FB77E]" /> : <Share2 className="w-4 h-4" />}
          <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir Squad (WhatsApp)'}</span>
        </button>
      </div>

      {/* Squad Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1F4E5F] text-white border border-[#1F4E5F]/20 p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7FB77E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#7FB77E] text-[#1F4E5F] flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
              {squad.badgeEmoji}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#7FB77E] px-2.5 py-1 rounded-full">
                  Squad Habitual CIMO
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" /> {squad.location}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white mt-1.5 tracking-tight">
                {squad.name}
              </h1>

              <p className="text-xs text-white/80 font-medium mt-1">
                Frecuencia: <strong className="text-white">{squad.recurringSchedule}</strong> • Ritmo: <strong className="text-[#7FB77E]">{squad.typicalPaceOrLevel}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCreateWorkout}
              className="inline-flex items-center gap-2 bg-[#7FB77E] text-[#1F4E5F] hover:bg-[#7FB77E]/90 text-xs font-black px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
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
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'convocatorias'
              ? 'bg-[#1F4E5F] text-white shadow-xs'
              : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-white'
          }`}
        >
          📅 Convocatorias Activas
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#1F4E5F] text-white shadow-xs'
              : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-white'
          }`}
        >
          👥 Miembros del Squad ({squad.members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#1F4E5F] text-white shadow-xs'
              : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-white'
          }`}
        >
          💬 Chat del Squad ({messages.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'convocatorias' && (
        <div className="flex flex-col gap-4">
          {squad.activeCallout ? (
            <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#7FB77E]/15 text-[#7FB77E] px-2.5 py-0.5 rounded-full">
                  Próxima Sesión Oficial
                </span>
                <span className="text-xs font-bold text-[#1F4E5F]">
                  {squad.activeCallout.attendingMembers.length}/{squad.activeCallout.maxCapacity} confirmados
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#1F4E5F]">{squad.activeCallout.title}</h3>
                <p className="text-xs text-[#1F4E5F]/70 mt-1 flex items-center gap-2">
                  <span>📅 {squad.activeCallout.date} a las {squad.activeCallout.time}</span>
                  <span>•</span>
                  <span>📍 {squad.activeCallout.meetingPoint}</span>
                </p>
              </div>

              {squad.activeCallout.hasThirdHalf && (
                <div className="p-3 bg-[#FFFBEB] border border-amber-200/60 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 font-bold">
                  <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Tercer Tiempo: {squad.activeCallout.thirdHalfVenue}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-[#1F4E5F]/10">
                <div className="flex items-center -space-x-2">
                  {squad.activeCallout.attendingMembers.map((m) => (
                    <img
                      key={m.id}
                      src={m.avatarUrl}
                      alt={m.name}
                      onClick={() => onNavigateToProfile(m.id)}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 transition-transform"
                      title={m.name}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectActivity('act_1')}
                  className="text-xs font-black bg-[#1F4E5F] text-white hover:bg-[#1F4E5F]/90 px-4 py-2 rounded-2xl transition-all cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {squad.members.map((member) => (
            <div
              key={member.id}
              onClick={() => onNavigateToProfile(member.id)}
              className="bg-white border border-[#1F4E5F]/10 hover:border-[#7FB77E]/40 p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-[#1F4E5F]/10 group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#1F4E5F]">{member.name}</h4>
                    {member.isCaptain && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-[#7FB77E]/15 text-[#7FB77E] px-1.5 py-0.5 rounded-md">
                        Capitán
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#1F4E5F]/60 font-medium">Miembro habitual</span>
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
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col gap-3 min-h-[220px] max-h-[360px] overflow-y-auto pr-1">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5">
                <img src={m.avatar} alt={m.sender} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="bg-[#F7F7F7] border border-[#1F4E5F]/5 p-3 rounded-2xl max-w-lg">
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <strong className="text-[#1F4E5F] font-black">{m.sender}</strong>
                    <span className="text-[#1F4E5F]/40">{m.time}</span>
                  </div>
                  <p className="text-xs text-[#1F4E5F] mt-1 font-medium">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-[#1F4E5F]/10">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Escribe un mensaje para ${squad.name}...`}
              className="flex-1 bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-2xl px-4 py-2.5 text-xs text-[#1F4E5F] focus:outline-none focus:border-[#7FB77E]"
            />
            <button
              type="submit"
              className="bg-[#7FB77E] text-[#1F4E5F] hover:bg-[#7FB77E]/90 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
