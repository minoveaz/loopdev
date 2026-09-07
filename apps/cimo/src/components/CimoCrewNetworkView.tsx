import React, { useState } from 'react';
import {
  Activity,
  Beer,
  Calendar,
  Check,
  Clock,
  Coffee,
  Flame,
  HelpCircle,
  Layers,
  MapPin,
  MessageSquare,
  Mountain,
  Plus,
  Send,
  Sparkles,
  Sun,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { CrewConnection, SportsSquad } from '../data/mockCrewNetwork';
import { INITIAL_CREW_CONNECTIONS, INITIAL_SPORTS_SQUADS } from '../data/mockCrewNetwork';

export interface CimoCrewNetworkViewProps {
  onBackToExplore: () => void;
  onNavigateToProfile?: (athleteId: string) => void;
  onNavigateToSquad?: (squadId: string) => void;
  onOpenChat?: (chatId?: string) => void;
  onCreateWorkout?: () => void;
}

// Design System Vector Sport Helper
export function getSportVectorIcon(sport: string, className = 'w-3.5 h-3.5') {
  const norm = sport.toLowerCase();
  if (norm.includes('run')) return <Activity className={className} />;
  if (norm.includes('pad') || norm.includes('pádel')) return <Target className={className} />;
  if (norm.includes('hik') || norm.includes('trek')) return <Mountain className={className} />;
  return <Flame className={className} />;
}

// Design System Vector Third Half Helper
export function getThirdHalfVectorIcon(type?: string, className = 'w-3.5 h-3.5') {
  switch (type) {
    case 'beer':
      return <Beer className={className} />;
    case 'picnic':
      return <Sun className={className} />;
    case 'cafe':
    default:
      return <Coffee className={className} />;
  }
}

export const CimoCrewNetworkView: React.FC<CimoCrewNetworkViewProps> = ({
  onNavigateToProfile,
  onNavigateToSquad,
  onOpenChat,
}) => {
  const [squads, setSquads] = useState<SportsSquad[]>(INITIAL_SPORTS_SQUADS);
  const [connections] = useState<CrewConnection[]>(INITIAL_CREW_CONNECTIONS);
  const [selectedSportFilter, setSelectedSportFilter] = useState<
    'all' | 'running' | 'padel' | 'hiking'
  >('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Meetup Proposal Modal State
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposeTarget, setProposeTarget] = useState<{
    type: 'squad' | 'athlete';
    name: string;
    sport: string;
  } | null>(null);
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
      going: 'Asistencia confirmada. Notificado a los miembros del Squad.',
      declined: 'Asistencia declinada para esta sesión.',
      maybe: 'Marcado en duda. Te avisaremos 2h antes de la quedada.',
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

    showToast(
      `Convocatoria enviada a "${proposeTarget.name}" (${proposeDay} a las ${proposeTime}).`,
    );
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
    <div className="animate-in fade-in flex w-full flex-col gap-6 pb-16 text-[#1F4E5F] duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="animate-in slide-in-from-bottom-4 fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-[#7FB77E]/40 bg-[#1F4E5F] px-4 py-3 text-white shadow-xl duration-150">
          <Sparkles className="h-4 w-4 shrink-0 text-[#7FB77E]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 🌟 1. Compact Header Bar (Clean Professional Design System) */}
      <div className="shadow-2xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#1F4E5F]/10 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7FB77E]/10 text-[#7FB77E]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-[#1F4E5F] sm:text-2xl">
                Mi Red de Crew
              </h1>
              <span className="rounded-full border border-[#7FB77E]/20 bg-[#7FB77E]/10 px-2.5 py-0.5 text-xs font-extrabold text-[#7FB77E]">
                {squads.length} squads • {connections.length} compañeros
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-[#1F4E5F]/65">
              Micro-equipos habituales y círculo de entrenamiento para coordinar sesiones y tercer
              tiempo.
            </p>
          </div>
        </div>

        {/* Sport Filter Tabs with Vector Icons */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-1">
          <button
            type="button"
            onClick={() => setSelectedSportFilter('all')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              selectedSportFilter === 'all'
                ? 'shadow-2xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#1F4E5F]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Todos</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('running')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              selectedSportFilter === 'running'
                ? 'shadow-2xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#1F4E5F]'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>Running</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('padel')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              selectedSportFilter === 'padel'
                ? 'shadow-2xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#1F4E5F]'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-cyan-500" />
            <span>Pádel</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('hiking')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              selectedSportFilter === 'hiking'
                ? 'shadow-2xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#1F4E5F]'
            }`}
          >
            <Mountain className="h-3.5 w-3.5 text-amber-500" />
            <span>Hiking</span>
          </button>
        </div>
      </div>

      {/* 📦 BLOQUE 1: MIS SQUADS DEPORTIVOS */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7FB77E]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/75">
              Tus Squads Habituales
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleOpenPropose('squad', 'Nuevo Squad', 'running')}
            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#7FB77E] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Crear nuevo Squad</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredSquads.map((sq) => {
            const callout = sq.activeCallout;
            const myRsvp = callout?.myRsvp ?? 'none';
            const isDeclined = myRsvp === 'declined';

            // Vector badge styling based on sport
            const sportStyle =
              sq.sport === 'running'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : sq.sport === 'padel'
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={sq.id}
                className={`shadow-xs gap-4.5 flex flex-col rounded-3xl border border-[#1F4E5F]/15 bg-white p-5 transition-all hover:shadow-sm sm:p-6 ${
                  isDeclined ? 'opacity-70' : ''
                }`}
              >
                {/* 1. Header Row (Squad Identity & Meta) */}
                <div className="border-[#1F4E5F]/8 flex flex-col justify-between gap-3 border-b pb-3.5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${sportStyle}`}
                    >
                      {getSportVectorIcon(sq.sport, 'w-5 h-5')}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          onClick={() => onNavigateToSquad?.(sq.slug || sq.id)}
                          className="cursor-pointer text-base font-black text-[#1F4E5F] transition-colors hover:text-[#7FB77E] sm:text-lg"
                        >
                          {sq.name}
                        </h3>
                        <span className="rounded-full border border-[#1F4E5F]/10 bg-[#1F4E5F]/5 px-2.5 py-0.5 text-[10px] font-bold text-[#1F4E5F]">
                          {sq.typicalPaceOrLevel}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-[#1F4E5F]/60">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sq.recurringSchedule}</span>
                        <span>•</span>
                        <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" />
                        <span>{sq.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Members */}
                  <div className="flex shrink-0 items-center justify-between gap-2.5 sm:justify-end">
                    <div className="flex items-center -space-x-2">
                      {sq.members.map((mem) => (
                        <img
                          key={mem.id}
                          src={mem.avatarUrl}
                          alt={mem.name}
                          title={mem.name}
                          onClick={() => onNavigateToProfile?.(mem.id)}
                          className="shadow-2xs h-7 w-7 cursor-pointer rounded-full object-cover ring-2 ring-white transition-transform hover:scale-110"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToSquad?.(sq.slug || sq.id)}
                      className="flex cursor-pointer items-center gap-1 rounded-xl border border-[#7FB77E]/30 bg-[#7FB77E]/15 px-3 py-1.5 text-xs font-bold text-[#1F4E5F] transition-all hover:bg-[#7FB77E]"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Hub</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChat?.(sq.id)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#1F4E5F] transition-all hover:bg-[#1F4E5F] hover:text-white"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPropose('squad', sq.name, sq.sport)}
                      className="flex cursor-pointer items-center gap-1 rounded-xl border border-[#7FB77E]/30 px-3 py-1.5 text-xs font-bold text-[#7FB77E] transition-all hover:bg-[#7FB77E]/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Convocatoria</span>
                    </button>
                  </div>
                </div>

                {/* 2. Active Convocatoria Section */}
                {callout ? (
                  <div className="flex flex-col gap-3">
                    {/* Hero Convocatoria Date & Title */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                        <Calendar className="h-3 w-3 text-emerald-600" />
                        <span>Próximo Entreno</span>
                      </span>
                      <span className="text-xs font-extrabold text-[#1F4E5F] sm:text-sm">
                        {callout.date}, {callout.time} —{' '}
                        <span className="font-bold text-[#1F4E5F]/85">{callout.title}</span>
                      </span>
                    </div>

                    {/* Split-Cards (2 Columns): Punto de Encuentro vs. Tercer Tiempo */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Left: Meeting Point */}
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 text-[#1F4E5F]">
                          <MapPin className="h-4 w-4 text-[#7FB77E]" />
                        </div>
                        <div className="truncate">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Punto de Encuentro
                          </span>
                          <span className="block truncate text-xs font-extrabold text-[#1F4E5F]">
                            {callout.meetingPoint}
                          </span>
                        </div>
                      </div>

                      {/* Right: Tercer Tiempo Social (Distinct Warm Amber Identity) */}
                      {callout.hasThirdHalf && callout.thirdHalfVenue ? (
                        <div className="shadow-2xs flex items-center gap-3 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-800">
                            {getThirdHalfVectorIcon(
                              callout.thirdHalfType,
                              'w-4 h-4 text-amber-700',
                            )}
                          </div>
                          <div className="truncate">
                            <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800">
                              {callout.thirdHalfType === 'beer'
                                ? 'Caña & Tapeo Post-Entreno'
                                : callout.thirdHalfType === 'picnic'
                                  ? 'Picnic al Aire Libre'
                                  : 'Café & Desayuno Post-Entreno'}
                            </span>
                            <span className="block truncate text-xs font-extrabold text-[#78350F]">
                              {callout.thirdHalfVenue}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-xs text-slate-500">
                          <span>Plan 100% deportivo (sin tercer tiempo agendado)</span>
                        </div>
                      )}
                    </div>

                    {/* 3. Bottom Attendance Bar with Segmented Control */}
                    <div className="flex flex-col justify-between gap-3 pt-1.5 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F4E5F]/75">
                          Asistencia ({callout.attendingMembers.length}/{callout.maxCapacity}{' '}
                          confirmados):
                        </span>
                        <div className="flex items-center -space-x-1.5">
                          {callout.attendingMembers.map((m) => (
                            <img
                              key={m.id}
                              src={m.avatarUrl}
                              alt={m.name}
                              title={m.name}
                              className="h-5 w-5 rounded-full object-cover ring-2 ring-white"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Tactile Segmented Control with Vector Icons */}
                      <div className="flex shrink-0 items-center self-start rounded-2xl border border-slate-200/80 bg-[#F1F5F9] p-1 sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'going')}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                            myRsvp === 'going'
                              ? 'shadow-xs scale-102 bg-[#7FB77E] text-white'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>Voy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'maybe')}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                            myRsvp === 'maybe'
                              ? 'shadow-xs scale-102 bg-amber-500 text-white'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span>Duda</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRsvpChange(sq.id, 'declined')}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                            myRsvp === 'declined'
                              ? 'shadow-xs scale-102 bg-rose-500 text-white'
                              : 'text-slate-600 hover:text-[#1F4E5F]'
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>No</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] p-4">
                    <span className="text-xs font-medium text-slate-500">
                      Sin convocatoria activa para los próximos días.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenPropose('squad', sq.name, sq.sport)}
                      className="cursor-pointer rounded-xl bg-[#7FB77E] px-3 py-1.5 text-xs font-black text-white hover:bg-[#6ea26d]"
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

      {/* 👥 BLOQUE 2: MI CÍRCULO ÍNTIMO */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1F4E5F]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/75">
              Tu Círculo Íntimo de Compañeros
            </h2>
          </div>
          <span className="text-xs font-bold text-[#1F4E5F]/50">
            {filteredConnections.length} deportistas
          </span>
        </div>

        {/* Clean, spacious rows */}
        <div className="border-[#1F4E5F]/12 divide-[#1F4E5F]/8 shadow-2xs divide-y overflow-hidden rounded-3xl border bg-white">
          {filteredConnections.map((conn) => {
            const primarySport = conn.sports[0];

            return (
              <div
                key={conn.id}
                className="sm:p-4.5 flex flex-col items-start justify-between gap-3.5 p-4 transition-colors hover:bg-[#F8FAFC] sm:flex-row sm:items-center"
              >
                {/* Left: Avatar + Identity + Mutual history */}
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={conn.athlete.avatarUrl}
                      alt={conn.athlete.name}
                      className="shadow-2xs h-11 w-11 rounded-full object-cover ring-2 ring-white"
                    />
                    {conn.athlete.isCaptain && (
                      <span
                        title="Capitán CIMO"
                        className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#7FB77E] text-[8px] font-black text-white"
                      >
                        ★
                      </span>
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3
                        className="cursor-pointer truncate text-sm font-black text-[#1F4E5F] transition-colors hover:text-[#7FB77E]"
                        onClick={() => onNavigateToProfile?.(conn.athlete.id)}
                      >
                        {conn.athlete.name}
                      </h3>
                      <span className="text-[11px] font-bold text-[#1F4E5F]/50">
                        • {conn.athlete.zone}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-[#1F4E5F]/65">
                      <span className="flex items-center gap-1.5 font-extrabold text-[#7FB77E]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7FB77E]" />
                        <span>{conn.stats.sharedWorkoutsCount} entrenos en común</span>
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[#1F4E5F]/50">
                        Último: {conn.stats.lastWorkoutDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Consolidated Metric Chip & Action Buttons */}
                <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  {/* Consolidated Sports & 3er T Chip with Vector Icons */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#1F4E5F]/85">
                    <span className="text-emerald-600">
                      {getSportVectorIcon(primarySport?.sport ?? 'running', 'w-3.5 h-3.5')}
                    </span>
                    <span>{primarySport?.paceOrMetric}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600">
                      {getThirdHalfVectorIcon(conn.preferredThirdHalf, 'w-3.5 h-3.5')}
                    </span>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenPropose(
                          'athlete',
                          conn.athlete.name,
                          primarySport?.sport ?? 'running',
                        )
                      }
                      className="active:scale-98 flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#7FB77E] px-3 py-1.5 text-xs font-black text-[#7FB77E] transition-all hover:bg-[#7FB77E] hover:text-white"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Proponer Entreno</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChat?.(conn.athlete.id)}
                      className="cursor-pointer rounded-xl bg-[#F1F5F9] p-2 text-[#1F4E5F] transition-colors hover:bg-[#1F4E5F] hover:text-white"
                      title="Abrir conversación"
                    >
                      <MessageSquare className="h-4 w-4" />
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
          className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#1F4E5F]/60 p-4 duration-150"
          onClick={() => setIsProposeModalOpen(false)}
        >
          <div
            className="animate-in zoom-in-95 relative flex w-full max-w-md flex-col gap-4 rounded-3xl border border-[#1F4E5F]/15 bg-white p-6 text-[#1F4E5F] shadow-2xl duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1F4E5F]/10 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/10 text-[#7FB77E]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1F4E5F] sm:text-base">
                    Proponer Quedada Rápida
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#1F4E5F]/60">
                    <span>Para:</span>
                    <span className="font-bold text-[#1F4E5F]">{proposeTarget.name}</span>
                    <span>•</span>
                    <span className="capitalize">{proposeTarget.sport}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProposeModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-[#1F4E5F]/40 hover:bg-[#F7F7F7] hover:text-[#1F4E5F]"
              >
                <X className="h-4 w-4" />
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
                    className="w-full rounded-xl border border-[#1F4E5F]/15 bg-[#F7F7F7] px-3 py-2 text-xs font-bold text-[#1F4E5F] outline-none"
                  >
                    <option value="Hoy">Hoy</option>
                    <option value="Mañana">Mañana</option>
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
                    className="w-full rounded-xl border border-[#1F4E5F]/15 bg-[#F7F7F7] px-3 py-2 font-mono text-xs font-bold text-[#1F4E5F] outline-none"
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
                  className="w-full rounded-xl border border-[#1F4E5F]/15 bg-[#F7F7F7] px-3 py-2 text-xs font-medium text-[#1F4E5F] outline-none focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#1F4E5F]/10 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="cursor-pointer px-3.5 py-1.5 text-xs font-bold text-[#1F4E5F]/60 hover:text-[#1F4E5F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="shadow-2xs active:scale-98 flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#7FB77E] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#6ea26d]"
                >
                  <Send className="h-3.5 w-3.5" />
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
