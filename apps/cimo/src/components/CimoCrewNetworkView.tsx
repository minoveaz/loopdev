import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  ExternalLink,
  Flame,
  HelpCircle,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { CrewConnection, SportsSquad } from '../data/mockCrewNetwork';
import { INITIAL_CREW_CONNECTIONS, INITIAL_SPORTS_SQUADS } from '../data/mockCrewNetwork';
import { getSportEmoji } from '../data/sportsCatalog';

export interface CimoCrewNetworkViewProps {
  onBackToExplore: () => void;
  onNavigateToProfile?: (athleteId: string) => void;
  onOpenChat?: (chatId?: string) => void;
  onCreateWorkout?: () => void;
}

export const CimoCrewNetworkView: React.FC<CimoCrewNetworkViewProps> = ({
  onBackToExplore,
  onNavigateToProfile,
  onOpenChat,
  onCreateWorkout,
}) => {
  const [squads, setSquads] = useState<SportsSquad[]>(INITIAL_SPORTS_SQUADS);
  const [connections, setConnections] = useState<CrewConnection[]>(INITIAL_CREW_CONNECTIONS);
  const [selectedSportFilter, setSelectedSportFilter] = useState<'all' | 'running' | 'padel' | 'hiking'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Meetup Proposal Modal State
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposeTarget, setProposeTarget] = useState<{ type: 'squad' | 'athlete'; name: string; sport: string } | null>(null);
  const [proposeDay, setProposeDay] = useState('Mañana');
  const [proposeTime, setProposeTime] = useState('19:30');
  const [proposeNote, setProposeNote] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // RSVP Segmented Control Handler
  const handleRsvpChange = (squadId: string, newRsvp: 'going' | 'declined' | 'maybe') => {
    setSquads((prev) =>
      prev.map((sq) => {
        if (sq.id === squadId && sq.activeCallout) {
          const myMember = sq.members.find((m) => m.id === 'usr_me') ?? sq.members[0];
          let updatedAttending = [...sq.activeCallout.attendingMembers];

          if (newRsvp === 'going') {
            if (!updatedAttending.some((m) => m.id === 'usr_me')) {
              updatedAttending.push(myMember);
            }
          } else {
            updatedAttending = updatedAttending.filter((m) => m.id !== 'usr_me');
          }

          return {
            ...sq,
            activeCallout: {
              ...sq.activeCallout,
              myRsvp: newRsvp,
              attendingMembers: updatedAttending,
            },
          };
        }
        return sq;
      }),
    );

    const rsvpFeedbacks = {
      going: '✨ ¡Asistencia confirmada! Nos vemos en el entreno y el 3er tiempo.',
      declined: '🔴 Asistencia declinada. Te avisaremos para el siguiente entreno.',
      maybe: '🟡 Te avisaremos 2h antes de la quedada para confirmar.',
    };
    showToast(rsvpFeedbacks[newRsvp]);
  };

  const handleOpenPropose = (type: 'squad' | 'athlete', name: string, sport: string) => {
    setProposeTarget({ type, name, sport });
    setProposeNote('');
    setIsProposeModalOpen(true);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeTarget) return;

    showToast(`⚡ ¡Convocatoria enviada a "${proposeTarget.name}" para ${proposeDay} a las ${proposeTime}!`);
    setIsProposeModalOpen(false);
  };

  const filteredSquads = squads.filter((sq) => {
    if (selectedSportFilter === 'all') return true;
    return sq.sport === selectedSportFilter;
  });

  const filteredConnections = connections.filter((conn) => {
    if (selectedSportFilter === 'all') return true;
    return conn.sports.some((s) => s.sport === selectedSportFilter);
  });

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-150 text-[#1F4E5F] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F4E5F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-150 border border-[#00B894]/40">
          <Sparkles className="w-4 h-4 text-[#00B894] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 🌟 1. Compact Header Bar */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#1F4E5F] tracking-tight">
                Mi Red de Crew
              </h1>
              <span className="text-xs font-black bg-[#00B894]/10 text-[#00B894] px-2.5 py-0.5 rounded-full">
                {squads.length} squads • {connections.length} compañeros
              </span>
            </div>
            <p className="text-xs text-[#1F4E5F]/65 font-medium mt-0.5">
              Tus micro-equipos habituales y tu círculo cercano para entrenar y compartir tercer tiempo.
            </p>
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-full border border-[#1F4E5F]/5 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'all' ? 'bg-[#1F4E5F] text-white shadow-2xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('running')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'running' ? 'bg-[#1F4E5F] text-white shadow-2xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🏃 Running
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('padel')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'padel' ? 'bg-[#1F4E5F] text-white shadow-2xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🎾 Pádel
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('hiking')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'hiking' ? 'bg-[#1F4E5F] text-white shadow-2xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🥾 Hiking
          </button>
        </div>
      </div>

      {/* 📦 BLOQUE 1: MIS SQUADS DEPORTIVOS (Simplified, Clean & High Contrast) */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B894]" />
            <h2 className="text-sm sm:text-base font-black text-[#1F4E5F] tracking-tight uppercase">
              Tus Squads Habituales
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleOpenPropose('squad', 'Nuevo Squad', 'running')}
            className="text-xs font-black text-[#00B894] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Crear nuevo Squad</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredSquads.map((sq) => {
            const callout = sq.activeCallout;
            const myRsvp = callout?.myRsvp ?? 'none';
            const isDeclined = myRsvp === 'declined';

            return (
              <div
                key={sq.id}
                className={`bg-white border border-[#1F4E5F]/15 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col gap-4 ${
                  isDeclined ? 'opacity-75' : ''
                }`}
              >
                {/* 1. Header Row (Squad Identity & Meta) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F4E5F]/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-[#F7F7F7] border border-[#1F4E5F]/5 shrink-0">
                      {sq.badgeEmoji}
                    </span>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-[#1F4E5F]">
                        {sq.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1F4E5F]/5 text-[#1F4E5F] border border-[#1F4E5F]/10">
                        {sq.typicalPaceOrLevel}
                      </span>
                      <span className="text-xs text-[#1F4E5F]/55 font-medium hidden md:inline">
                        • {sq.recurringSchedule}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Members */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                    <div className="flex items-center -space-x-2">
                      {sq.members.map((mem) => (
                        <img
                          key={mem.id}
                          src={mem.avatarUrl}
                          alt={mem.name}
                          title={mem.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-2xs"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenChat?.(sq.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#F7F7F7] hover:bg-[#1F4E5F] text-[#1F4E5F] hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPropose('squad', sq.name, sq.sport)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#00B894] hover:bg-[#00B894]/10 border border-[#00B894]/30 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Convocatoria</span>
                    </button>
                  </div>
                </div>

                {/* 2. Active Convocatoria Section */}
                {callout ? (
                  <div className="flex flex-col gap-3">
                    {/* Hero Convocatoria Date & Title */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-900 border border-amber-500/25 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
                        <span>Próximo Entreno</span>
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#1F4E5F]">
                        📅 {callout.date}, {callout.time} — <span className="font-extrabold text-[#1F4E5F]/85">{callout.title}</span>
                      </span>
                    </div>

                    {/* Split-Cards (2 Columns): Punto de Encuentro vs. Tercer Tiempo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Left: Meeting Point */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-200/60 text-[#1F4E5F] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#00B894]" />
                        </div>
                        <div className="truncate">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                            📍 Punto de Encuentro
                          </span>
                          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block">
                            {callout.meetingPoint}
                          </span>
                        </div>
                      </div>

                      {/* Right: Tercer Tiempo Social (Distinct Warm Amber Identity) */}
                      {callout.hasThirdHalf && callout.thirdHalfVenue ? (
                        <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-3 shadow-2xs">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-base">
                            {callout.thirdHalfType === 'beer' ? '🍺' : callout.thirdHalfType === 'picnic' ? '🌿' : '☕'}
                          </div>
                          <div className="truncate">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                              {callout.thirdHalfType === 'beer' ? '🍺 Caña & Tapeo Post-Entreno' : callout.thirdHalfType === 'picnic' ? '🌿 Picnic al Aire Libre' : '☕ Café & Desayuno Post-Entreno'}
                            </span>
                            <span className="text-xs font-extrabold text-[#78350F] truncate block">
                              {callout.thirdHalfVenue}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3 text-slate-500 text-xs">
                          <span>🏃 Plan 100% deportivo (sin tercer tiempo agendado)</span>
                        </div>
                      )}
                    </div>

                    {/* 3. Bottom Attendance Bar with Segmented Control */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F4E5F]/75">
                          Asistencia ({callout.attendingMembers.length}/{callout.maxCapacity} confirmados):
                        </span>
                        <div className="flex items-center -space-x-1.5">
                          {callout.attendingMembers.map((m) => (
                            <img
                              key={m.id}
                              src={m.avatarUrl}
                              alt={m.name}
                              title={m.name}
                              className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Tactile Segmented Control */}
                      <div className="flex items-center p-1 bg-[#F1F5F9] rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'going')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            myRsvp === 'going'
                              ? 'bg-[#00B894] text-white shadow-xs scale-102'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Voy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'maybe')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            myRsvp === 'maybe'
                              ? 'bg-amber-500 text-white shadow-xs scale-102'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Duda</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'declined')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            myRsvp === 'declined'
                              ? 'bg-rose-500 text-white shadow-xs scale-102'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>No</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-300 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Sin convocatoria activa para los próximos días.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenPropose('squad', sq.name, sq.sport)}
                      className="px-3 py-1.5 rounded-xl bg-[#00B894] text-white text-xs font-black cursor-pointer hover:bg-[#009678]"
                    >
                      + Proponer Entreno al Squad
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 👥 BLOQUE 2: MI CÍRCULO ÍNTIMO (Streamlined & Clean Rows) */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F4E5F]" />
            <h2 className="text-sm sm:text-base font-black text-[#1F4E5F] tracking-tight uppercase">
              Tu Círculo Íntimo de Compañeros
            </h2>
          </div>
          <span className="text-xs text-[#1F4E5F]/50 font-bold">
            {filteredConnections.length} deportistas
          </span>
        </div>

        {/* Clean, spacious rows */}
        <div className="bg-white border border-[#1F4E5F]/12 rounded-3xl divide-y divide-[#1F4E5F]/8 shadow-2xs overflow-hidden">
          {filteredConnections.map((conn) => {
            const thirdHalfEmoji = conn.preferredThirdHalf === 'beer' ? '🍺' : conn.preferredThirdHalf === 'picnic' ? '🌿' : '☕';
            const primarySport = conn.sports[0];

            return (
              <div
                key={conn.id}
                className="p-4 sm:p-4.5 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
              >
                {/* Left: Avatar + Identity + Mutual history */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={conn.athlete.avatarUrl}
                      alt={conn.athlete.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-2xs"
                    />
                    {conn.athlete.isCaptain && (
                      <span
                        title="Capitán CIMO"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00B894] text-white flex items-center justify-center text-[9px] border border-white"
                      >
                        ⭐
                      </span>
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-sm font-black text-[#1F4E5F] hover:text-[#00B894] transition-colors cursor-pointer truncate"
                        onClick={() => onNavigateToProfile?.(conn.athlete.id)}
                      >
                        {conn.athlete.name}
                      </h3>
                      <span className="text-[11px] text-[#1F4E5F]/50 font-bold">
                        • {conn.athlete.zone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#1F4E5F]/65 font-medium">
                      <span className="font-extrabold text-[#00B894]">
                        🟢 {conn.stats.sharedWorkoutsCount} entrenos en común
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[#1F4E5F]/50">Último: {conn.stats.lastWorkoutDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Consolidated Metric Chip & Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  {/* Consolidated Sports & 3er T Chip */}
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs font-bold text-[#1F4E5F]/85">
                    <span>{getSportEmoji(primarySport?.sport ?? 'running')}</span>
                    <span>{primarySport?.paceOrMetric}</span>
                    <span className="text-slate-300">•</span>
                    <span>{thirdHalfEmoji}</span>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPropose('athlete', conn.athlete.name, primarySport?.sport ?? 'running')}
                      className="px-3 py-1.5 rounded-xl border border-[#00B894] text-[#00B894] hover:bg-[#00B894] hover:text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Proponer Entreno</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChat?.(conn.athlete.id)}
                      className="p-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#1F4E5F] text-[#1F4E5F] hover:text-white transition-colors cursor-pointer"
                      title="Abrir conversación"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ⚡ MINIMAL MODAL: PROPOSE QUICK MEETUP */}
      {isProposeModalOpen && proposeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F4E5F]/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsProposeModalOpen(false)}
        >
          <div
            className="bg-white border border-[#1F4E5F]/15 rounded-3xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-4 relative animate-in zoom-in-95 duration-150 text-[#1F4E5F]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#1F4E5F]">
                    Proponer Quedada Rápida
                  </h3>
                  <p className="text-[11px] text-[#1F4E5F]/60 font-medium">
                    Para: <span className="font-bold text-[#1F4E5F]">{proposeTarget.name}</span> ({getSportEmoji(proposeTarget.sport)} {proposeTarget.sport})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1 rounded-full text-[#1F4E5F]/40 hover:text-[#1F4E5F] hover:bg-[#F7F7F7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    ¿Cuándo?
                  </label>
                  <select
                    value={proposeDay}
                    onChange={(e) => setProposeDay(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F7F7] rounded-xl border border-[#1F4E5F]/15 text-xs font-bold text-[#1F4E5F] outline-none"
                  >
                    <option value="Hoy">🔥 Hoy</option>
                    <option value="Mañana">⚡ Mañana</option>
                    <option value="Este Jueves">Jueves</option>
                    <option value="Este Viernes">Viernes</option>
                    <option value="Este Sábado">Sábado</option>
                    <option value="Este Domingo">Domingo</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Hora estimada
                  </label>
                  <input
                    type="time"
                    value={proposeTime}
                    onChange={(e) => setProposeTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F7F7] rounded-xl border border-[#1F4E5F]/15 text-xs font-bold text-[#1F4E5F] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                  Mensaje o plan de tercer tiempo (Opcional)
                </label>
                <input
                  type="text"
                  value={proposeNote}
                  onChange={(e) => setProposeNote(e.target.value)}
                  placeholder="Ej: ¿Rodaje suave 8K y luego café?"
                  className="w-full px-3 py-2 bg-[#F7F7F7] focus:bg-white rounded-xl border border-[#1F4E5F]/15 text-xs font-medium text-[#1F4E5F] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1F4E5F]/10">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#1F4E5F]/60 hover:text-[#1F4E5F] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00B894] hover:bg-[#009678] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Convocatoria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
