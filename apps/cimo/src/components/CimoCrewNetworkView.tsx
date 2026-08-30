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
  MessageSquare,
  Phone,
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

  // KPI calculations
  const totalAthletes = connections.length;
  const totalSharedWorkouts = useMemo(
    () => connections.reduce((sum, c) => sum + c.stats.sharedWorkoutsCount, 0),
    [connections],
  );
  const totalSharedThirdHalfs = useMemo(
    () => connections.reduce((sum, c) => sum + c.stats.sharedThirdHalfsCount, 0),
    [connections],
  );

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
    showToast('Preferencia actualizada en tu Crew');
  };

  const handleOpenInvite = (conn?: CrewConnection) => {
    if (conn) setSelectedAthleteForInvite(conn);
    setIsInviteModalOpen(true);
  };

  const handleSendInvites = (invitedIds: string[]) => {
    showToast(`📨 ¡Invitación enviada a ${invitedIds.length} atleta(s) de tu Crew!`);
  };

  const getThirdHalfBadge = (type?: string) => {
    switch (type) {
      case 'cafe':
        return { emoji: '☕', label: 'Café & Desayuno' };
      case 'beer':
        return { emoji: '🍻', label: 'Caña & Tapeo' };
      case 'smoothie':
        return { emoji: '🥤', label: 'Smoothie Recovery' };
      case 'picnic':
        return { emoji: '🌿', label: 'Picnic al Aire Libre' };
      default:
        return { emoji: '☕', label: 'Tercer Tiempo' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200 text-[#1F4E5F] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1F4E5F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 border border-[#00B894]/40">
          <Sparkles className="w-4 h-4 text-[#00B894] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 🌟 1. Header Banner & KPI Summary */}
      <div className="bg-white border border-[#1F4E5F]/15 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/20 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Social Sports Graph</span>
            </span>
            <span className="text-xs font-bold text-[#1F4E5F]/60">• Red de Contactos</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
            Mi Red de Crew Deportiva
          </h1>

          <p className="text-xs sm:text-sm text-[#1F4E5F]/75 font-medium leading-relaxed">
            Deportistas con los que ya has sudado la camiseta y compartido tercer tiempo en CIMO.
            Fomenta la constancia, invita a tus compañeros de confianza en 1 clic y mantén el contacto directo.
          </p>
        </div>

        {/* Action Button & KPIs */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 z-10">
          <button
            type="button"
            onClick={() => handleOpenInvite()}
            className="w-full px-5 py-3 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Invitar a mi Crew Habitual</span>
          </button>

          <button
            type="button"
            onClick={onBackToExplore}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F7] hover:bg-[#1F4E5F]/5 text-[#1F4E5F] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1F4E5F]/10"
          >
            <span>← Volver a Explorar Entrenos</span>
          </button>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-[#00B894]/10 via-[#7FB77E]/5 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* 📊 2. KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1F4E5F] block leading-tight">
              {totalAthletes}
            </span>
            <span className="text-xs text-[#1F4E5F]/60 font-extrabold uppercase tracking-wider block">
              Compañeros en tu Red
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-[#00B894]" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1F4E5F] block leading-tight">
              {totalSharedWorkouts}
            </span>
            <span className="text-xs text-[#1F4E5F]/60 font-extrabold uppercase tracking-wider block">
              Entrenos Compartidos
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1F4E5F] block leading-tight">
              {totalSharedThirdHalfs}
            </span>
            <span className="text-xs text-[#1F4E5F]/60 font-extrabold uppercase tracking-wider block">
              Terceros Tiempos Juntos
            </span>
          </div>
        </div>
      </div>

      {/* 🔍 3. Filter Bar & Search Controls */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sport Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-full border border-[#1F4E5F]/5 w-full md:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedSportFilter === 'all'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            ⭐ Todos ({connections.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('running')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedSportFilter === 'running'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🏃 Running ({connections.filter((c) => c.sports.some((s) => s.sport === 'running')).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('padel')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedSportFilter === 'padel'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🎾 Pádel ({connections.filter((c) => c.sports.some((s) => s.sport === 'padel')).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSportFilter('hiking')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedSportFilter === 'hiking'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            🥾 Hiking ({connections.filter((c) => c.sports.some((s) => s.sport === 'hiking')).length})
          </button>
        </div>

        {/* Search Input & Status Filter */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, barrio o ritmo..."
              className="w-full pl-8 pr-7 py-2 bg-[#F7F7F7] focus:bg-white rounded-2xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none shadow-2xs transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#1F4E5F]/40 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2 top-2 cursor-pointer"
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
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              selectedStatusFilter === 'favorite'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]/70 border border-[#1F4E5F]/10'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${selectedStatusFilter === 'favorite' ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favoritos</span>
          </button>
        </div>
      </div>

      {/* 👥 4. Athletes Directory Cards Grid */}
      {filteredConnections.length === 0 ? (
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#1F4E5F]/40">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#1F4E5F]">No se encontraron compañeros</h3>
          <p className="text-xs text-[#1F4E5F]/60 max-w-sm">
            Prueba a cambiar el filtro de deporte o el término de búsqueda para ver más deportistas de tu red.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSportFilter('all');
              setSelectedStatusFilter('all');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 rounded-full bg-[#00B894] text-white text-xs font-black cursor-pointer hover:bg-[#009678]"
          >
            Resetear filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredConnections.map((conn) => {
            const isFav = conn.connectionStatus === 'favorite';
            const thirdHalfInfo = getThirdHalfBadge(conn.preferredThirdHalf);

            return (
              <div
                key={conn.id}
                className="bg-white border border-[#1F4E5F]/15 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5 relative group"
              >
                {/* Top Row: Avatar, Name, Zone & Favorite Toggle */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={conn.athlete.avatarUrl}
                          alt={conn.athlete.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#1F4E5F]/10 group-hover:ring-[#00B894]/40 transition-all shadow-xs"
                        />
                        {conn.athlete.isCaptain && (
                          <div
                            title="Capitán de Entrenos en CIMO"
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00B894] text-white flex items-center justify-center shadow-xs text-[10px]"
                          >
                            ⭐
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-[#1F4E5F] hover:text-[#00B894] transition-colors cursor-pointer"
                              onClick={() => onNavigateToProfile?.(conn.athlete.id)}>
                            {conn.athlete.name}
                          </h3>
                          <span className="text-xs text-[#1F4E5F]/50 font-bold">
                            {conn.athlete.age}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#1F4E5F]/60 font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
                          <span className="truncate max-w-[160px]">{conn.athlete.zone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Favorite Star Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(conn.id)}
                      title={isFav ? 'Quitar de favoritos' : 'Marcar como compañero favorito'}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                          : 'text-[#1F4E5F]/30 hover:bg-[#F7F7F7] hover:text-[#1F4E5F]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#1F4E5F]/75 font-medium leading-relaxed line-clamp-2">
                    "{conn.athlete.bio}"
                  </p>

                  {/* Shared History Highlight Box */}
                  <div className="p-3 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className="text-[#1F4E5F] flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{conn.stats.sharedWorkoutsCount} entrenos compartidos</span>
                      </span>
                      <span className="text-[#00B894]">{conn.stats.lastWorkoutDate}</span>
                    </div>

                    <span className="text-[10px] text-[#1F4E5F]/60 truncate font-medium">
                      Último: {conn.stats.lastWorkoutTitle}
                    </span>

                    {/* Third half preference */}
                    <div className="pt-1.5 mt-0.5 border-t border-[#1F4E5F]/10 flex items-center justify-between text-[10px]">
                      <span className="text-[#1F4E5F]/60 font-bold">Tercer Tiempo Favorito:</span>
                      <span className="font-extrabold text-[#1F4E5F] flex items-center gap-1">
                        <span>{thirdHalfInfo.emoji}</span>
                        <span>{thirdHalfInfo.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Sports & Paces Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {conn.sports.map((sp) => (
                      <span
                        key={sp.sport}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-[#1F4E5F]/5 text-[#1F4E5F] border border-[#1F4E5F]/10 flex items-center gap-1"
                      >
                        <span>{getSportEmoji(sp.sport)}</span>
                        <span>{sp.paceOrMetric}</span>
                      </span>
                    ))}
                  </div>

                  {/* Unlocked Contact Badge */}
                  {conn.contactChannels?.whatsappUnlocked && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Contacto desbloqueado</span>
                      </span>
                      {conn.contactChannels.whatsappNumber && (
                        <span className="font-mono font-black">{conn.contactChannels.whatsappNumber}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-[#1F4E5F]/10 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInvite(conn)}
                    className="w-full py-2.5 rounded-xl bg-[#00B894]/10 hover:bg-[#00B894] text-[#00B894] hover:text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invitar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat?.(conn.athlete.id)}
                    className="w-full py-2.5 rounded-xl bg-[#F7F7F7] hover:bg-[#1F4E5F] text-[#1F4E5F] hover:text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🏆 5. Community Milestones & Badges Footer Banner */}
      <div className="bg-gradient-to-r from-[#1F4E5F] to-[#163844] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00B894]/20 text-[#00B894] border border-[#00B894]/40 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                Insignia: Conector de Crew Activo
              </h3>
              <span className="text-[10px] font-black bg-[#00B894] text-white px-2 py-0.5 rounded-full">
                Nivel 2
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium mt-1 max-w-xl leading-relaxed">
              Has compartido entrenamientos con 7 deportistas diferentes en Madrid.
              ¡Suma 3 compañeros más para desbloquear el estatus de **Capitán de Oro** y prioridad en eventos especiales!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateWorkout}
          className="px-5 py-3 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white text-xs sm:text-sm font-black shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
        >
          + Proponer Nuevo Entreno
        </button>
      </div>

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
