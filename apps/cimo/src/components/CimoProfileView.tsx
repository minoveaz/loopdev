import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Edit3,
  Flame,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import type { ExtendedUserProfileData } from './CimoEditProfileView';

export interface CimoProfileViewProps {
  user: ExtendedUserProfileData;
  userActivities?: ActivityCardData[];
  onSelectActivity?: (id: string) => void;
  onCreatePlan?: () => void;
  onEditProfile?: () => void;
  onUpdateUser?: (updated: ExtendedUserProfileData) => void;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400';

const SPORT_EMOJIS: Record<string, string> = {
  running: '🏃',
  padel: '🎾',
  pádel: '🎾',
  hiking: '🥾',
  crossfit: '🏋️',
  ciclismo: '🚴',
  cycling: '🚴',
  hyrox: '⚡',
  yoga: '🧘',
};

const COMMUNITY_REVIEWS = [
  {
    id: 'rev_1',
    author: 'Lucía Morales',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 3 días',
    sport: '🏃 Running 8K',
    rating: 5,
    comment: 'Alex es un capitán de 10. Marcó un ritmo súper cómodo de 5:15 min/km y nos guió por las mejores sombras del Retiro.',
  },
  {
    id: 'rev_2',
    author: 'Carlos Gómez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 1 semana',
    sport: '🎾 Pádel Mixto',
    rating: 5,
    comment: 'Gran partido de pádel, muy buen ambiente y súper puntual. 100% recomendable.',
  },
  {
    id: 'rev_3',
    author: 'Elena Rivas',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 2 semanas',
    sport: '🥾 Hiking Navacerrada',
    rating: 5,
    comment: 'Ruta espectacular y muy bien organizada. Trajo botiquín y recomendaciones claras en todo momento.',
  },
];

const ATHLETE_BADGES = [
  {
    id: 'badge_1',
    icon: '🏅',
    title: 'Capitán Fundador',
    desc: 'Ha liderado más de 10 entrenos con puntuación perfecta de 5 estrellas.',
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-800',
  },
  {
    id: 'badge_2',
    icon: '🔥',
    title: 'Constancia de Oro',
    desc: '4 semanas consecutivas sumando al menos 2 entrenos grupales.',
    color: 'bg-orange-500/10 border-orange-500/30 text-orange-800',
  },
  {
    id: 'badge_3',
    icon: '🛡️',
    title: 'Puntualidad 100%',
    desc: '0 cancelaciones de última hora. Asistencia impecable.',
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
  },
  {
    id: 'badge_4',
    icon: '🤝',
    title: 'Conector Deportivo',
    desc: 'Ha entrenado con más de 40 deportistas diferentes en su ciudad.',
    color: 'bg-[#1F4E5F]/10 border-[#1F4E5F]/30 text-[#1F4E5F]',
  },
];

const WEEK_DAYS_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const CimoProfileView: React.FC<CimoProfileViewProps> = ({
  user,
  userActivities = [],
  onSelectActivity,
  onCreatePlan,
  onEditProfile,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'sports' | 'badges' | 'reviews'>('plans');
  const [shareCopied, setShareCopied] = useState(false);

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const sportsList = user.sports ?? [
    { sport: 'Running', level: 'Intermedio (5-10K)', pace: '5:15 min/km' },
    { sport: 'Pádel', level: 'Nivel 3.5 (Intermedio)', pace: 'Drive / Revés' },
    { sport: 'Hiking', level: 'Rutas 10-15 km', pace: '10-15 km • +600m desnivel' },
  ];

  const weeklySchedule = user.weeklySchedule ?? {
    Lunes: ['afternoon'],
    Martes: ['morning'],
    Miércoles: ['afternoon'],
    Jueves: ['afternoon'],
    Viernes: [],
    Sábado: ['morning'],
    Domingo: ['morning'],
  };

  const goalsList = user.goals ?? [
    '🤝 Conocer deportistas activos',
    '☕ Café / Caña post-entreno (Tercer Tiempo)',
    '🔥 Mantener constancia semanal',
  ];

  return (
    <div className="flex flex-col gap-6 text-[#1F4E5F] max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 🏞️ Hero Profile Card with Panoramic Cover */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl overflow-hidden shadow-xs flex flex-col">
        {/* Panoramic Cover */}
        <div className="relative h-44 sm:h-52 w-full bg-[#1F4E5F]/10 overflow-hidden">
          <img
            src={user.coverUrl ?? DEFAULT_COVER}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_COVER;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

          {/* Top Actions in Cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white/90 hover:bg-white text-[#1F4E5F] backdrop-blur-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>
            <button
              type="button"
              onClick={onEditProfile}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#00B894] hover:bg-[#009678] text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>

        {/* Profile Details & Avatar Header */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            {/* Avatar with Captain Ring */}
            <div className="relative inline-block">
              <img
                src={user.avatarUrl ?? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              />
              {user.isCaptainAvailable !== false && (
                <div
                  className="absolute bottom-1 right-1 bg-[#00B894] text-white p-1.5 rounded-full shadow-md border-2 border-white"
                  title="Capitán Verificado CIMO"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Quick Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {user.isCaptainAvailable !== false && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Capitán Verificado</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>5.0 (18 entrenos)</span>
              </span>
            </div>
          </div>

          {/* Name, Bio, Location and Contact Channels */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
                {user.name}
              </h1>
              {user.handle && (
                <span className="text-xs font-bold text-[#1F4E5F]/50">
                  {user.handle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1F4E5F]/70 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00B894]" />
                <span>{user.city ?? 'Madrid, España'}</span>
                {user.neighborhood && <span className="text-[#1F4E5F]">({user.neighborhood})</span>}
              </div>
              <span>•</span>
              <span>Miembro activo CIMO</span>
            </div>

            <p className="text-xs sm:text-sm text-[#1F4E5F]/80 font-medium leading-relaxed max-w-2xl">
              {user.bio ?? 'Apasionado del running matutino y las partidas de pádel. ¡Siempre buscando sumar nuevos kilómetros y conectar con gente activa!'}
            </p>

            {/* Social & Contact Channels Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-1.5">
              {user.phoneWhatsapp && (
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user.phoneWhatsapp}</span>
                  {user.phonePrivacy && (
                    <span className="text-[10px] text-emerald-700/80 font-normal flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> (Crew)
                    </span>
                  )}
                </div>
              )}

              {user.stravaUrl && (
                <a
                  href={user.stravaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#00B894]/10 hover:bg-[#00B894]/20 border border-[#00B894]/30 rounded-full text-xs font-bold text-[#1F4E5F] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-[#00B894]" />
                  <span>Strava</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-xs font-bold text-blue-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                  <span>LinkedIn</span>
                </a>
              )}

              {user.instagramHandle && (
                <div className="px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-bold text-pink-800 flex items-center gap-1.5 shadow-2xs">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>{user.instagramHandle}</span>
                </div>
              )}
            </div>
          </div>

          {/* 📊 Strava Style Performance Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1F4E5F]/10">
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col items-center text-center">
              <Flame className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-xl font-black text-[#1F4E5F]">
                {user.completedWorkouts ?? 28}
              </span>
              <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase tracking-wider">
                Entrenos Realizados
              </span>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col items-center text-center">
              <Timer className="w-5 h-5 text-[#00B894] mb-1" />
              <span className="text-xl font-black text-[#1F4E5F]">
                {user.totalKm ?? 184} km
              </span>
              <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase tracking-wider">
                Distancia Acumulada
              </span>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col items-center text-center">
              <Users className="w-5 h-5 text-[#1F4E5F] mb-1" />
              <span className="text-xl font-black text-[#1F4E5F]">
                46
              </span>
              <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase tracking-wider">
                Compañeros de Crew
              </span>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col items-center text-center">
              <Trophy className="w-5 h-5 text-[#7FB77E] mb-1" />
              <span className="text-xl font-black text-[#1F4E5F]">
                99%
              </span>
              <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase tracking-wider">
                Tasa de Asistencia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Tabs Navigation Card (Responsive Zero-Overflow Grid) */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'plans'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Mis Planes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sports')}
            className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'sports'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Deportes & Ritmos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'badges'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Insignias ({ATHLETE_BADGES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'reviews'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Reseñas ({COMMUNITY_REVIEWS.length})</span>
          </button>
        </div>
      </div>

      {/* 📄 Active Tab Content */}
      <div className="flex flex-col gap-6">
        {/* Tab 1: Mis Planes */}
        {activeTab === 'plans' && (
          <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1F4E5F]">
                  Tus Entrenos Activos y Liderados
                </h2>
                <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                  Planes donde eres Capitán o miembro confirmado.
                </p>
              </div>

              {onCreatePlan && (
                <button
                  type="button"
                  onClick={onCreatePlan}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#00B894] hover:bg-[#009678] text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Nuevo Entreno</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col justify-between gap-3 hover:border-[#00B894] transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00B894] bg-[#00B894]/10 px-2 py-0.5 rounded-full">
                      Tú eres Capitán
                    </span>
                    <h3 className="font-black text-sm text-[#1F4E5F] mt-2">
                      Running 8K por Parque del Retiro
                    </h3>
                    <p className="text-xs text-[#1F4E5F]/70 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#7FB77E]" />
                      <span>Parque del Retiro (Madrid)</span>
                    </p>
                  </div>
                  <span className="text-2xl">🏃</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1F4E5F]/10 text-xs font-extrabold text-[#1F4E5F]">
                  <span>Hoy • 19:30 h</span>
                  <span className="text-[#00B894]">4/5 confirmados</span>
                </div>
              </div>

              <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col justify-between gap-3 hover:border-[#00B894] transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/70 bg-[#1F4E5F]/10 px-2 py-0.5 rounded-full">
                      Miembro Confirmado
                    </span>
                    <h3 className="font-black text-sm text-[#1F4E5F] mt-2">
                      Pádel Mixto Nivel 3.5 en Chamartín
                    </h3>
                    <p className="text-xs text-[#1F4E5F]/70 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#7FB77E]" />
                      <span>Club Tenis Chamartín (Madrid)</span>
                    </p>
                  </div>
                  <span className="text-2xl">🎾</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1F4E5F]/10 text-xs font-extrabold text-[#1F4E5F]">
                  <span>Mañana • 18:30 h</span>
                  <span className="text-[#00B894]">4/4 plazas llenas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deportes, Ritmos, Disponibilidad & Preferencias de Crew */}
        {activeTab === 'sports' && (
          <div className="flex flex-col gap-6">
            {/* 1. Sports & Paces (Sports Passport) */}
            <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Tus Deportes y Marcas de Ritmo
                  </h2>
                  <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                    Marcas que garantizan homogeneidad en tus entrenos y partidas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="text-xs font-black text-[#00B894] hover:text-[#009678] transition-colors cursor-pointer"
                >
                  Editar Deportes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sportsList.map((s, idx) => {
                  const emoji = SPORT_EMOJIS[s.sport.toLowerCase()] ?? '🏅';
                  return (
                    <div
                      key={idx}
                      className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col justify-between gap-3 hover:border-[#00B894]/40 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-base font-black text-[#1F4E5F]">
                            {s.sport}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full">
                          {s.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4E5F]/70 pt-2 border-t border-[#1F4E5F]/10">
                        <Timer className="w-4 h-4 text-[#7FB77E] shrink-0" />
                        <span>Ritmo habitual: <strong className="text-[#1F4E5F]">{s.pace ?? '5:15 min/km'}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Day-by-Day Availability Matrix */}
            <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Tu Disponibilidad Semanal por Día
                  </h2>
                  <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                    Días y franjas horarias exactas en las que sueles estar libre para entrenar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="text-xs font-black text-[#00B894] hover:text-[#009678] transition-colors cursor-pointer"
                >
                  Cambiar Horarios
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                {WEEK_DAYS_NAMES.map((dayName) => {
                  const slots = weeklySchedule[dayName] ?? [];
                  const isAvailable = slots.length > 0;

                  return (
                    <div
                      key={dayName}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 ${
                        isAvailable
                          ? 'bg-[#00B894]/5 border-[#00B894]/30 shadow-2xs'
                          : 'bg-[#F7F7F7] border-[#1F4E5F]/10 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1F4E5F]">
                          {dayName.slice(0, 3)}
                        </span>
                        {isAvailable && (
                          <span className="w-2 h-2 rounded-full bg-[#00B894]" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1 text-[10px] font-bold">
                        {slots.includes('morning') && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-900 rounded-md flex items-center gap-1">
                            <Sunrise className="w-3 h-3 text-amber-600 shrink-0" /> Mañanas
                          </span>
                        )}
                        {slots.includes('noon') && (
                          <span className="px-2 py-0.5 bg-sky-500/10 text-sky-900 rounded-md flex items-center gap-1">
                            <Sun className="w-3 h-3 text-sky-600 shrink-0" /> Mediodía
                          </span>
                        )}
                        {slots.includes('afternoon') && (
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-900 rounded-md flex items-center gap-1">
                            <Sunset className="w-3 h-3 text-indigo-600 shrink-0" /> Tardes
                          </span>
                        )}
                        {!isAvailable && (
                          <span className="text-[#1F4E5F]/40 italic">Descanso</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Community Style & Crew Preferences */}
            <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Estilo Social & Preferencias de Crew
                  </h2>
                  <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                    Cómo disfrutas entrenar y qué buscas en la comunidad.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="text-xs font-black text-[#00B894] hover:text-[#009678] transition-colors cursor-pointer"
                >
                  Editar Preferencias
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Group size card */}
                <div className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Formato de Grupo Preferido
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00B894]" />
                    <span className="text-sm font-black text-[#1F4E5F]">
                      {user.groupSizePreference === 'medium'
                        ? '🏃 Grupos Medianos (8 a 15 personas)'
                        : '👥 Microgrupos (4 a 6 personas)'}
                    </span>
                  </div>
                  <span className="text-xs text-[#1F4E5F]/70 font-medium">
                    {user.groupSizePreference === 'medium'
                      ? 'Diversidad de ritmos, energía de club y espíritu comunitario.'
                      : 'Mayor homogeneidad de ritmo, cercanía y charla fluida.'}
                  </span>
                </div>

                {/* Social Goals list */}
                <div className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Metas en la Comunidad CIMO
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {goalsList.map((g, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-[#1F4E5F]/15 rounded-full text-xs font-bold text-[#1F4E5F] flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3 h-3 text-[#00B894] stroke-[3]" />
                        <span>{g}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Captain Mode & Notes (If Available) */}
            {user.isCaptainAvailable !== false && (
              <div className="bg-gradient-to-br from-[#1F4E5F] to-[#163a47] rounded-3xl p-6 sm:p-8 text-white shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#7FB77E]">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Perfil de Capitán Verificado
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="text-xs font-bold text-white/80 hover:text-white underline cursor-pointer"
                  >
                    Editar Normas
                  </button>
                </div>

                <h3 className="text-lg font-black tracking-tight">
                  Instrucciones Habituales en los Entrenos de {user.name}
                </h3>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs">
                  <p className="text-xs text-white/90 font-medium leading-relaxed italic">
                    "{user.defaultCaptainNotes ?? '💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar'}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Insignias y Logros */}
        {activeTab === 'badges' && (
          <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-black text-[#1F4E5F]">
                Insignias de la Comunidad CIMO
              </h2>
              <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                Logros desbloqueados por tu constancia, puntualidad y liderazgo de entrenos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATHLETE_BADGES.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border flex items-start gap-3.5 ${b.color}`}
                >
                  <span className="text-3xl shrink-0">{b.icon}</span>
                  <div>
                    <h3 className="font-black text-sm">{b.title}</h3>
                    <p className="text-xs opacity-80 mt-0.5 leading-relaxed font-medium">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reseñas */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-black text-[#1F4E5F]">
                Valoraciones de Compañeros de Crew
              </h2>
              <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                Comentarios de deportistas que han asistido a entrenos liderados por ti.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {COMMUNITY_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-[#1F4E5F]/15"
                      />
                      <div>
                        <span className="font-black text-xs text-[#1F4E5F] block">
                          {rev.author}
                        </span>
                        <span className="text-[10px] text-[#1F4E5F]/50 font-medium">
                          {rev.date} • {rev.sport}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#1F4E5F]/80 font-medium leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
