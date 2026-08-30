import React, { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  Clock,
  Coffee,
  ExternalLink,
  Flame,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { CrewConnection } from '../data/mockCrewNetwork';
import { INITIAL_CREW_CONNECTIONS } from '../data/mockCrewNetwork';
import { CimoInviteCrewModal } from './CimoInviteCrewModal';
import { getSportEmoji } from '../data/sportsCatalog';

export interface CimoCrewNetworkViewProps {
  onBackToExplore: () => void;
  onNavigateToProfile?: (athleteId: string) => void;
  onOpenChat?: (athleteId: string) => void;
  onCreateWorkout?: () => void;
}

export const CimoCrewNetworkView: React.FC<CimoCrewNetworkViewProps> = ({
  onBackToExplore,
  onNavigateToProfile,
  onOpenChat,
  onCreateWorkout,
}) => {
  const [connections, setConnections] = useState<CrewConnection[]>(INITIAL_CREW_CONNECTIONS);
  const [selectedSportFilter, setSelectedSportFilter] = useState<'all' | 'running' | 'padel' | 'hiking'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'favorite' | 'habitual'>('all');

  // Modal invite state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAthleteForInvite, setSelectedAthleteForInvite] = useState<CrewConnection | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered connections
  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      // Sport filter
      if (selectedSportFilter !== 'all') {
        const hasSport = conn.sports.some((s) => s.sport === selectedSportFilter);
        if (!hasSport) return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && conn.connectionStatus !== selectedStatusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = conn.athlete.name.toLowerCase().includes(q);
        const zoneMatch = conn.athlete.zone.toLowerCase().includes(q);
        const bioMatch = conn.athlete.bio.toLowerCase().includes(q);
        const sportMatch = conn.sports.some((s) => s.sport.toLowerCase().includes(q));
        if (!nameMatch && !zoneMatch && !bioMatch && !sportMatch) return false;
      }

      return true;
    });
  }, [connections, selectedSportFilter, selectedStatusFilter, searchQuery]);

  const toggleFavorite = (connId: string) => {
    setConnections((prev) =>
      prev.map((c) => {
        if (c.id === connId) {
          const newStatus = c.connectionStatus === 'favorite' ? 'habitual' : 'favorite';
          return { ...c, connectionStatus: newStatus };
        }
        return c;
      }),
    );
    showToast('Favorito actualizado');
  };

  const handleOpenInvite = (conn?: CrewConnection) => {
    if (conn) setSelectedAthleteForInvite(conn);
    setIsInviteModalOpen(true);
  };

  const handleSendInvites = (invitedIds: string[]) => {
    showToast(`📨 ¡Invitación enviada a ${invitedIds.length} compañero(s)!`);
  };

  const getThirdHalfEmoji = (type?: string) => {
    switch (type) {
      case 'cafe':
        return '☕';
      case 'beer':
        return '🍻';
      case 'smoothie':
        return '🥤';
      case 'picnic':
        return '🌿';
      default:
        return '☕';
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in duration-150 text-[#1F4E5F] pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F4E5F] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-150 border border-[#00B894]/40">
          <Sparkles className="w-4 h-4 text-[#00B894] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 🌟 1. Compact & Light Header Bar (LinkedIn Network style) */}
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
              <span className="text-xs font-black bg-[#00B894]/10 text-[#00B894] px-2 py-0.5 rounded-full">
                {connections.length} contactos
              </span>
            </div>
            <p className="text-xs text-[#1F4E5F]/65 font-medium mt-0.5">
              Deportistas con los que has compartido entrenamientos y tercer tiempo en CIMO.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => handleOpenInvite()}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-[#00B894] hover:bg-[#009678] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invitar a mi Crew</span>
          </button>

          <button
            type="button"
            onClick={onBackToExplore}
            className="px-3.5 py-2 rounded-full bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]/75 hover:text-[#1F4E5F] font-bold text-xs border border-[#1F4E5F]/10 transition-colors cursor-pointer"
          >
            ← Explorar
          </button>
        </div>
      </div>

      {/* 🔍 2. Clean Filters & Search Bar (Zero Horizontal Scroll, Flex-Wrap) */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Filter Pills with Flex-Wrap (No Scrollbar) */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'all'
                ? 'bg-[#1F4E5F] text-white shadow-2xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            ⭐ Todos ({connections.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('running')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'running'
                ? 'bg-[#1F4E5F] text-white shadow-2xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            🏃 Running ({connections.filter((c) => c.sports.some((s) => s.sport === 'running')).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('padel')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'padel'
                ? 'bg-[#1F4E5F] text-white shadow-2xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            🎾 Pádel ({connections.filter((c) => c.sports.some((s) => s.sport === 'padel')).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('hiking')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedSportFilter === 'hiking'
                ? 'bg-[#1F4E5F] text-white shadow-2xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F]/70 hover:text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            🥾 Hiking ({connections.filter((c) => c.sports.some((s) => s.sport === 'hiking')).length})
          </button>
        </div>

        {/* Search & Favorites Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar compañero o zona..."
              className="w-full pl-8 pr-7 py-1.5 bg-[#F7F7F7] focus:bg-white rounded-full border border-[#1F4E5F]/15 focus:border-[#00B894] text-xs font-bold text-[#1F4E5F] outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#1F4E5F]/40 absolute left-2.5 top-2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2 top-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedStatusFilter(selectedStatusFilter === 'favorite' ? 'all' : 'favorite')
            }
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              selectedStatusFilter === 'favorite'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]/70 border border-[#1F4E5F]/10'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${selectedStatusFilter === 'favorite' ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favoritos</span>
          </button>
        </div>
      </div>

      {/* 👥 3. LinkedIn / Strava Style Connection Cards (Spacious 2-column Grid) */}
      {filteredConnections.length === 0 ? (
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2">
          <Users className="w-8 h-8 text-[#1F4E5F]/30" />
          <h3 className="text-sm font-black text-[#1F4E5F]">No se encontraron compañeros</h3>
          <p className="text-xs text-[#1F4E5F]/60">
            Prueba a cambiar el filtro de deporte o el término de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConnections.map((conn) => {
            const isFav = conn.connectionStatus === 'favorite';
            const thirdHalfEmoji = getThirdHalfEmoji(conn.preferredThirdHalf);

            return (
              <div
                key={conn.id}
                className="bg-white border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-2xs hover:shadow-sm hover:border-[#00B894]/30 transition-all flex flex-col justify-between gap-4 group"
              >
                {/* Top Section: Avatar + Name + Subtitle + Favorite */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={conn.athlete.avatarUrl}
                          alt={conn.athlete.name}
                          className="w-13 h-13 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-102 transition-transform"
                        />
                        {conn.athlete.isCaptain && (
                          <span
                            title="Capitán en CIMO"
                            className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#00B894] text-white flex items-center justify-center shadow-xs text-[9px] border-2 border-white"
                          >
                            ⭐
                          </span>
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h3
                            className="text-sm font-black text-[#1F4E5F] hover:text-[#00B894] transition-colors cursor-pointer truncate"
                            onClick={() => onNavigateToProfile?.(conn.athlete.id)}
                          >
                            {conn.athlete.name}
                          </h3>
                          <span className="text-[11px] text-[#1F4E5F]/50 font-bold shrink-0">
                            • {conn.athlete.age}
                          </span>
                        </div>

                        <p className="text-xs text-[#1F4E5F]/65 font-medium truncate mt-0.5">
                          {conn.athlete.zone}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(conn.id)}
                      title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                        isFav
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-[#1F4E5F]/25 hover:text-[#1F4E5F] hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Clean Mutual Connection Headline (LinkedIn-style) */}
                  <div className="flex items-center justify-between text-xs py-2 px-3 bg-[#F7F7F7] rounded-xl border border-[#1F4E5F]/5">
                    <span className="font-extrabold text-[#1F4E5F] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00B894]" />
                      <span>{conn.stats.sharedWorkoutsCount} entrenos en común</span>
                    </span>
                    <span className="text-[11px] text-[#1F4E5F]/50 font-medium">
                      Último: {conn.stats.lastWorkoutDate}
                    </span>
                  </div>

                  {/* Sports & Paces Clean Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {conn.sports.map((sp) => (
                        <span
                          key={sp.sport}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#1F4E5F]/5 text-[#1F4E5F]/85"
                        >
                          {getSportEmoji(sp.sport)} {sp.paceOrMetric}
                        </span>
                      ))}
                    </div>

                    <span className="text-[11px] font-bold text-[#1F4E5F]/60 flex items-center gap-1 shrink-0" title="Tercer Tiempo habitual">
                      <span>{thirdHalfEmoji}</span>
                      <span className="text-[10px] uppercase font-black">3er T</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar (LinkedIn Style: [ 📨 Invitar ] [ 💬 Mensaje ]) */}
                <div className="pt-2.5 border-t border-[#1F4E5F]/8 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInvite(conn)}
                    className="flex-1 py-2 rounded-xl bg-[#00B894]/10 hover:bg-[#00B894] text-[#00B894] hover:text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invitar a Entreno</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat?.(conn.athlete.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F7F7] hover:bg-[#1F4E5F] text-[#1F4E5F] hover:text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mensaje</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToProfile?.(conn.athlete.id)}
                    title="Ver Pasaporte Deportivo"
                    className="p-2 rounded-xl bg-[#F7F7F7] hover:bg-[#1F4E5F]/10 text-[#1F4E5F]/60 hover:text-[#1F4E5F] transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      <CimoInviteCrewModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setSelectedAthleteForInvite(null);
        }}
        connections={selectedAthleteForInvite ? [selectedAthleteForInvite] : connections}
        targetActivityTitle="Running 8K por Parque del Retiro"
        targetSport="running"
        onSendInvites={handleSendInvites}
      />
    </div>
  );
};
