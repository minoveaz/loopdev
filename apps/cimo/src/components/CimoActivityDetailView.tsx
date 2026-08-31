import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData, type ChatMessage } from '@loopdev/public-blocks';
import { CimoMapPreviewCard } from './CimoMapPreviewCard';
import { CimoActivitySeoHead } from './CimoActivitySeoHead';

export interface CimoActivityDetailViewProps {
  activity: ActivityCardData;
  chatMessages: ChatMessage[];
  onBack: () => void;
  onJoin: (id: string) => void;
  onSendMessage: (activityId: string, text: string) => void;
  onNavigateToProfile?: (athleteId: string) => void;
}

export const CimoActivityDetailView: React.FC<CimoActivityDetailViewProps> = ({
  activity,
  chatMessages,
  onBack,
  onJoin,
  onSendMessage,
  onNavigateToProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [inputText, setInputText] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const isJoined = Boolean(activity.isJoined);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activity.id, inputText.trim());
    setInputText('');
  };

  const city = activity.location.split(',')[1]?.trim() || 'Madrid';

  return (
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-[#1F4E5F]">
      {/* 🧭 SEO Head & Breadcrumbs */}
      <CimoActivitySeoHead activity={activity} />

      {/* Top Bar with Breadcrumbs & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F4E5F]/10">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors cursor-pointer mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Explorar</span>
          </button>
          <span className="text-[#1F4E5F]/30">•</span>
          <nav aria-label="Migas de pan" className="flex items-center gap-1 text-[11px] font-bold text-[#1F4E5F]/60 flex-wrap">
            <span className="hover:text-[#1F4E5F] cursor-pointer" onClick={onBack}>CIMO</span>
            <span>›</span>
            <span>{city}</span>
            <span>›</span>
            <span className="capitalize text-[#7FB77E]">{activity.sport}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Compartir entreno"
            className="px-3 py-1.5 rounded-full bg-[#F7F7F7] hover:bg-[#7FB77E]/15 text-[#1F4E5F] transition-colors flex items-center gap-1.5 text-xs font-black cursor-pointer border border-[#1F4E5F]/10"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-[#7FB77E]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
          <button
            type="button"
            aria-label="Guardar en favoritos"
            className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors cursor-pointer border border-[#1F4E5F]/10"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panoramic Cover */}
      <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-3xl overflow-hidden bg-[#1F4E5F]/5 shadow-sm">
        {activity.image ? (
          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#1F4E5F] text-white flex items-center justify-center font-black">
            CIMO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/95 via-[#1F4E5F]/20 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs uppercase">
            {activity.sport}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1F4E5F]/90 text-white backdrop-blur-md">
            {activity.level}
          </span>
        </div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h1 className="text-xl sm:text-2xl font-black drop-shadow-xs">{activity.title}</h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 mt-1.5">
            <MapPin className="w-4 h-4 text-[#7FB77E] shrink-0" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Detalles del Entreno vs Chat del Crew */}
      <div className="flex items-center gap-2 border-b border-[#1F4E5F]/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 ${
            activeTab === 'details'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/50 hover:text-[#1F4E5F]'
          }`}
        >
          Información del Plan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/50 hover:text-[#1F4E5F]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat del Crew ({chatMessages.length})</span>
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="flex flex-col gap-6">
          {/* Captain Card */}
          <div className="p-4 bg-[#F7F7F7] rounded-3xl border border-[#1F4E5F]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {activity.captain.avatarUrl ? (
                <img
                  src={activity.captain.avatarUrl}
                  alt={activity.captain.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#1F4E5F]/20 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1F4E5F] text-white font-black text-lg flex items-center justify-center">
                  {activity.captain.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#1F4E5F]">
                    {activity.captain.name}
                  </span>
                  <span className="text-xs font-extrabold bg-[#7FB77E]/20 text-[#1F4E5F] px-2 py-0.5 rounded-full">
                    Capitán
                  </span>
                </div>
                <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                  {activity.captain.bio ?? 'Organizador activo en CIMO. Apasionado por entrenar en grupo y con buen rollo.'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1 text-xs font-bold text-[#1F4E5F]">
                <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1 text-xs text-[#1F4E5F]/70 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{activity.time} h</span>
              </div>
            </div>
          </div>

          {/* Captain Instructions (if present) */}
          {activity.instructions && (
            <div className="p-4 bg-[#7FB77E]/10 border border-[#7FB77E]/20 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#7FB77E] text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                  Instrucciones del Capitán ({activity.captain.name})
                </span>
                <p className="text-xs text-[#1F4E5F] font-bold leading-relaxed">
                  "{activity.instructions}"
                </p>
              </div>
            </div>
          )}

          {/* Technical Details & Itinerary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                Ritmo & Requisitos
              </span>
              <p className="text-xs font-bold text-[#1F4E5F]">
                ⚡ {activity.paceOrDetails ?? 'Ritmo cómodo adaptado al nivel de grupo.'}
              </p>
              <p className="text-[11px] text-[#1F4E5F]/70 mt-1">
                Llevar calzado adecuado y ropa cómoda. Se recomienda llegar 5 minutos antes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                Itinerario Previsto
              </span>
              <ul className="text-[11px] text-[#1F4E5F]/80 flex flex-col gap-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#7FB77E] font-black">1.</span>
                  <span>Encuentro en {activity.location}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#7FB77E] font-black">2.</span>
                  <span>Calentamiento y presentación (5 min)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#7FB77E] font-black">3.</span>
                  <span>Entrenamiento principal en grupo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#7FB77E] font-black">4.</span>
                  <span>{activity.thirdHalf?.enabled ? 'Estiramientos y Tercer Tiempo social' : 'Estiramientos y cierre deportivo'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ☕ Tercer Tiempo Post-Entreno (Optional Social Experience) */}
          {activity.thirdHalf?.enabled ? (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  {activity.thirdHalf.type === 'beer'
                    ? '🍻'
                    : activity.thirdHalf.type === 'smoothie'
                    ? '🥤'
                    : activity.thirdHalf.type === 'picnic'
                    ? '🌿'
                    : '☕'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                      Tercer Tiempo Organizado
                    </span>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded-full">
                      Social
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#1F4E5F] mt-0.5">
                    {activity.thirdHalf.venue || 'Cafetería cercana'}
                  </h4>
                  <p className="text-xs text-[#1F4E5F]/75 font-medium mt-1 leading-relaxed">
                    {activity.thirdHalf.notes || 'Espacio para charlar, rehidratarnos y comentar el entreno tras estirar.'}
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-white/80 border border-amber-500/20 text-[11px] font-bold text-amber-900 shrink-0 shadow-2xs">
                ☕ Post-Entreno (~30-40 min)
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-2xl flex items-center gap-2.5 text-xs text-[#1F4E5F]/70 font-medium">
              <span className="text-base">⚡</span>
              <span>
                <strong>Plan Deportivo Puro:</strong> Este entreno está enfocado 100% en la sesión física sin tercer tiempo posterior organizado.
              </span>
            </div>
          )}

          {/* Map Preview & GPS Navigation Button */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
              Punto de encuentro y navegación GPS
            </span>
            <CimoMapPreviewCard
              location={activity.location}
              city={activity.location.includes('Barcelona') ? 'Barcelona' : activity.location.includes('Valencia') ? 'Valencia' : 'Madrid'}
              postalCode={activity.postalCode}
            />
          </div>

          {/* Attendees / The Crew */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                El Crew ({activity.currentMembers.length} de {activity.maxMembers} plazas ocupadas)
              </span>
              <span className="text-xs font-bold text-[#7FB77E]">
                {activity.maxMembers - activity.currentMembers.length} plazas disponibles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activity.currentMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigateToProfile?.(m.id)}
                  className="p-3 bg-[#F7F7F7] hover:bg-[#7FB77E]/10 rounded-2xl border border-[#1F4E5F]/5 hover:border-[#7FB77E]/30 flex items-center gap-2.5 transition-all cursor-pointer group"
                >
                  {m.avatarUrl ? (
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#1F4E5F]/15 shrink-0 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-black text-xs flex items-center justify-center shrink-0">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-xs font-bold text-[#1F4E5F] block truncate group-hover:text-[#7FB77E] transition-colors">{m.name}</span>
                    <span className="text-[9px] text-[#7FB77E] font-black uppercase block">
                      {m.isCaptain ? 'Capitán' : 'Miembro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Embedded Crew Chat */
        <div className="flex flex-col h-96 bg-[#F7F7F7] rounded-3xl p-4 border border-[#1F4E5F]/5">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#1F4E5F]/50">
                Aún no hay mensajes en este Crew. ¡Sé el primero en saludar!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-[#1F4E5F]/10 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 bg-white p-3 rounded-2xl shadow-2xs border border-[#1F4E5F]/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-[#1F4E5F]">{msg.senderName}</span>
                      <span className="text-[10px] text-[#1F4E5F]/40">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#1F4E5F]/90 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="pt-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje al Crew..."
              className="flex-1 px-4 py-2 bg-white rounded-full text-xs font-medium text-[#1F4E5F] border border-[#1F4E5F]/15 focus:border-[#7FB77E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-full bg-[#7FB77E] hover:bg-[#6ea26d] disabled:opacity-40 text-white text-xs font-black flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Sticky Bottom Action CTA */}
      <div className="pt-4 border-t border-[#1F4E5F]/10 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#1F4E5F] block">
            {activity.date} a las {activity.time}h
          </span>
          <span className="text-[11px] text-[#7FB77E] font-bold">
            {activity.currentMembers.length}/{activity.maxMembers} plazas ocupadas
          </span>
        </div>

        <button
          type="button"
          disabled={isFull && !isJoined}
          onClick={() => onJoin(activity.id)}
          className={`px-7 py-3 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer ${
            isJoined
              ? 'bg-[#7FB77E] text-white shadow-xs'
              : isFull
              ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
              : 'bg-[#7FB77E] hover:bg-[#6ea26d] text-white active:scale-95'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>You're In</span>
            </>
          ) : isFull ? (
            <span>Crew Completo</span>
          ) : (
            <>
              <span>Unirme al Crew</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
