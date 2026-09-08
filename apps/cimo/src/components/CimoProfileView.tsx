import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  Edit3,
  Flame,
  Globe,
  Instagram,
  Linkedin,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import type { ExtendedUserProfileData } from './CimoEditProfileView';

export interface CimoProfileViewProps {
  user: ExtendedUserProfileData;
  isOwnProfile?: boolean;
  userActivities?: ActivityCardData[];
  onSelectActivity?: (id: string) => void;
  onCreatePlan?: () => void;
  onEditProfile?: () => void;
  onNavigateToCrew?: () => void;
  onUpdateUser?: (updated: ExtendedUserProfileData) => void;
}

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400';

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
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 3 días',
    sport: '🏃 Running 8K',
    rating: 5,
    comment:
      'Alex es un capitán de 10. Marcó un ritmo súper cómodo de 5:15 min/km y nos guió por las mejores sombras del Retiro.',
  },
  {
    id: 'rev_2',
    author: 'Carlos Gómez',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 1 semana',
    sport: '🎾 Pádel Mixto',
    rating: 5,
    comment: 'Gran partido de pádel, muy buen ambiente y súper puntual. 100% recomendable.',
  },
  {
    id: 'rev_3',
    author: 'Elena Rivas',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    date: 'Hace 2 semanas',
    sport: '🥾 Hiking Navacerrada',
    rating: 5,
    comment:
      'Ruta espectacular y muy bien organizada. Trajo botiquín y recomendaciones claras en todo momento.',
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
  isOwnProfile = true,
  onCreatePlan,
  onEditProfile,
  onNavigateToCrew,
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
    <div className="animate-in fade-in mx-auto flex max-w-4xl flex-col gap-6 pb-12 text-[#1F4E5F] duration-200">
      {/* 🏞️ Hero Profile Card with Panoramic Cover */}
      <div className="shadow-xs flex flex-col overflow-hidden rounded-3xl border border-[#1F4E5F]/10 bg-white">
        {/* Panoramic Cover */}
        <div className="relative h-44 w-full overflow-hidden bg-[#1F4E5F]/10 sm:h-52">
          <img
            src={user.coverUrl ?? DEFAULT_COVER}
            alt="Cover"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_COVER;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

          {/* Top Actions in Cover */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="backdrop-blur-xs flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-black text-[#1F4E5F] shadow-sm transition-all hover:bg-white"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>
            {isOwnProfile ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#7FB77E] px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#6ea26d] active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (user.phoneWhatsapp) {
                    window.open(
                      `https://wa.me/${user.phoneWhatsapp.replace(/[^0-9]/g, '')}`,
                      '_blank',
                    );
                  }
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#7FB77E] px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#6ea26d] active:scale-95"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Contactar</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details & Avatar Header */}
        <div className="relative flex flex-col gap-6 p-6 pt-0 sm:p-8">
          <div className="-mt-14 flex flex-col justify-between gap-4 sm:-mt-16 sm:flex-row sm:items-end">
            {/* Avatar with Captain Ring */}
            <div className="relative inline-block">
              <img
                src={
                  user.avatarUrl ??
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
                }
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-xl sm:h-28 sm:w-28"
              />
              {user.isCaptainAvailable !== false && (
                <div
                  className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-[#7FB77E] p-1.5 text-white shadow-md"
                  title="Capitán Verificado CIMO"
                >
                  <ShieldCheck className="h-4 w-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Quick Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {user.isCaptainAvailable !== false && (
                <span className="flex items-center gap-1 rounded-full border border-[#7FB77E]/20 bg-[#7FB77E]/10 px-3 py-1 text-xs font-black text-[#7FB77E]">
                  <Award className="h-3.5 w-3.5" />
                  <span>Capitán Verificado</span>
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-800">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>5.0 (18 entrenos)</span>
              </span>
            </div>
          </div>

          {/* Name, Bio, Location and Contact Channels */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#1F4E5F] sm:text-3xl">
                {user.name}
              </h1>
              {user.handle && (
                <span className="text-xs font-bold text-[#1F4E5F]/50">{user.handle}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#1F4E5F]/70">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" />
                <span>{user.city ?? 'Madrid, España'}</span>
                {user.neighborhood && <span className="text-[#1F4E5F]">({user.neighborhood})</span>}
              </div>
              <span>•</span>
              <span>Miembro activo CIMO</span>
            </div>

            <p className="max-w-2xl text-xs font-medium leading-relaxed text-[#1F4E5F]/80 sm:text-sm">
              {user.bio ??
                'Apasionado del running matutino y las partidas de pádel. ¡Siempre buscando sumar nuevos kilómetros y conectar con gente activa!'}
            </p>

            {/* Social & Contact Channels Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {user.phoneWhatsapp && (
                <div className="shadow-2xs flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{user.phoneWhatsapp}</span>
                  {user.phonePrivacy && (
                    <span className="flex items-center gap-0.5 text-[10px] font-normal text-emerald-700/80">
                      <Lock className="h-2.5 w-2.5" /> (Crew)
                    </span>
                  )}
                </div>
              )}

              {user.stravaUrl && (
                <a
                  href={user.stravaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-2xs flex items-center gap-1.5 rounded-full border border-[#7FB77E]/30 bg-[#7FB77E]/10 px-3 py-1 text-xs font-bold text-[#1F4E5F] transition-colors hover:bg-[#7FB77E]/20"
                >
                  <Globe className="h-3.5 w-3.5 text-[#7FB77E]" />
                  <span>Strava</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-2xs flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 transition-colors hover:bg-blue-100"
                >
                  <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                  <span>LinkedIn</span>
                </a>
              )}

              {user.instagramHandle && (
                <div className="shadow-2xs flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-bold text-pink-800">
                  <Instagram className="h-3.5 w-3.5 text-pink-600" />
                  <span>{user.instagramHandle}</span>
                </div>
              )}
            </div>
          </div>

          {/* 📊 Strava Style Performance Stats Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-[#1F4E5F]/10 pt-3 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 text-center">
              <Flame className="mb-1 h-5 w-5 text-amber-500" />
              <span className="text-xl font-black text-[#1F4E5F]">
                {user.completedWorkouts ?? 28}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4E5F]/60">
                Entrenos Realizados
              </span>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 text-center">
              <Timer className="mb-1 h-5 w-5 text-[#7FB77E]" />
              <span className="text-xl font-black text-[#1F4E5F]">{user.totalKm ?? 184} km</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4E5F]/60">
                Distancia Acumulada
              </span>
            </div>

            <button
              type="button"
              onClick={onNavigateToCrew}
              className="hover:shadow-xs flex cursor-pointer flex-col items-center rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 text-center transition-all hover:border-[#7FB77E] hover:bg-white active:scale-95"
            >
              <Users className="mb-1 h-5 w-5 text-[#7FB77E]" />
              <span className="text-xl font-black text-[#1F4E5F]">7</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4E5F]/60">
                Mi Red de Crew →
              </span>
            </button>

            <div className="flex flex-col items-center rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 text-center">
              <Trophy className="mb-1 h-5 w-5 text-[#7FB77E]" />
              <span className="text-xl font-black text-[#1F4E5F]">99%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4E5F]/60">
                Tasa de Asistencia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Tabs Navigation Card (Responsive Zero-Overflow Grid) */}
      <div className="shadow-xs rounded-3xl border border-[#1F4E5F]/10 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-center text-xs font-black transition-all ${
              activeTab === 'plans'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Mis Planes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sports')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-center text-xs font-black transition-all ${
              activeTab === 'sports'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Zap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Deportes & Ritmos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-center text-xs font-black transition-all ${
              activeTab === 'badges'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Insignias ({ATHLETE_BADGES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-center text-xs font-black transition-all ${
              activeTab === 'reviews'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Reseñas ({COMMUNITY_REVIEWS.length})</span>
          </button>
        </div>
      </div>

      {/* 📄 Active Tab Content */}
      <div className="flex flex-col gap-6">
        {/* Tab 1: Mis Planes */}
        {activeTab === 'plans' && (
          <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1F4E5F]">
                  Tus Entrenos Activos y Liderados
                </h2>
                <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                  Planes donde eres Capitán o miembro confirmado.
                </p>
              </div>

              {onCreatePlan && (
                <button
                  type="button"
                  onClick={onCreatePlan}
                  className="shadow-xs flex cursor-pointer items-center gap-1.5 rounded-full bg-[#7FB77E] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#6ea26d] active:scale-95"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Nuevo Entreno</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 transition-all hover:border-[#7FB77E]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-[#7FB77E]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                      Tú eres Capitán
                    </span>
                    <h3 className="mt-2 text-sm font-black text-[#1F4E5F]">
                      Running 8K por Parque del Retiro
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#1F4E5F]/70">
                      <MapPin className="h-3 w-3 text-[#7FB77E]" />
                      <span>Parque del Retiro (Madrid)</span>
                    </p>
                  </div>
                  <span className="text-2xl">🏃</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#1F4E5F]/10 pt-2 text-xs font-extrabold text-[#1F4E5F]">
                  <span>Hoy • 19:30 h</span>
                  <span className="text-[#7FB77E]">4/5 confirmados</span>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-4 transition-all hover:border-[#7FB77E]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-[#1F4E5F]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                      Miembro Confirmado
                    </span>
                    <h3 className="mt-2 text-sm font-black text-[#1F4E5F]">
                      Pádel Mixto Nivel 3.5 en Chamartín
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#1F4E5F]/70">
                      <MapPin className="h-3 w-3 text-[#7FB77E]" />
                      <span>Club Tenis Chamartín (Madrid)</span>
                    </p>
                  </div>
                  <span className="text-2xl">🎾</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#1F4E5F]/10 pt-2 text-xs font-extrabold text-[#1F4E5F]">
                  <span>Mañana • 18:30 h</span>
                  <span className="text-[#7FB77E]">4/4 plazas llenas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deportes, Ritmos, Disponibilidad & Preferencias de Crew */}
        {activeTab === 'sports' && (
          <div className="flex flex-col gap-6">
            {/* 1. Sports & Paces (Sports Passport) */}
            <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Tus Deportes y Marcas de Ritmo
                  </h2>
                  <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                    Marcas que garantizan homogeneidad en tus entrenos y partidas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="cursor-pointer text-xs font-black text-[#7FB77E] transition-colors hover:text-[#6ea26d]"
                >
                  Editar Deportes
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {sportsList.map((s, idx) => {
                  const emoji = SPORT_EMOJIS[s.sport.toLowerCase()] ?? '🏅';
                  return (
                    <div
                      key={idx}
                      className="shadow-2xs flex flex-col justify-between gap-3 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-5 transition-all hover:border-[#7FB77E]/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-base font-black text-[#1F4E5F]">{s.sport}</span>
                        </div>
                        <span className="rounded-full bg-[#7FB77E]/10 px-2.5 py-0.5 text-[11px] font-black text-[#7FB77E]">
                          {s.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 border-t border-[#1F4E5F]/10 pt-2 text-xs font-bold text-[#1F4E5F]/70">
                        <Timer className="h-4 w-4 shrink-0 text-[#7FB77E]" />
                        <span>
                          Ritmo habitual:{' '}
                          <strong className="text-[#1F4E5F]">{s.pace ?? '5:15 min/km'}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Day-by-Day Availability Matrix */}
            <div className="shadow-xs flex flex-col gap-5 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Tu Disponibilidad Semanal por Día
                  </h2>
                  <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                    Días y franjas horarias exactas en las que sueles estar libre para entrenar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="cursor-pointer text-xs font-black text-[#7FB77E] transition-colors hover:text-[#6ea26d]"
                >
                  Cambiar Horarios
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
                {WEEK_DAYS_NAMES.map((dayName) => {
                  const slots = weeklySchedule[dayName] ?? [];
                  const isAvailable = slots.length > 0;

                  return (
                    <div
                      key={dayName}
                      className={`flex flex-col justify-between gap-2.5 rounded-2xl border p-3.5 ${
                        isAvailable
                          ? 'shadow-2xs border-[#7FB77E]/30 bg-[#7FB77E]/5'
                          : 'border-[#1F4E5F]/10 bg-[#F7F7F7] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1F4E5F]">
                          {dayName.slice(0, 3)}
                        </span>
                        {isAvailable && <span className="h-2 w-2 rounded-full bg-[#7FB77E]" />}
                      </div>

                      <div className="flex flex-col gap-1 text-[10px] font-bold">
                        {slots.includes('morning') && (
                          <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-900">
                            <Sunrise className="h-3 w-3 shrink-0 text-amber-600" /> Mañanas
                          </span>
                        )}
                        {slots.includes('noon') && (
                          <span className="flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-sky-900">
                            <Sun className="h-3 w-3 shrink-0 text-sky-600" /> Mediodía
                          </span>
                        )}
                        {slots.includes('afternoon') && (
                          <span className="flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-indigo-900">
                            <Sunset className="h-3 w-3 shrink-0 text-indigo-600" /> Tardes
                          </span>
                        )}
                        {!isAvailable && <span className="italic text-[#1F4E5F]/40">Descanso</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Community Style & Crew Preferences */}
            <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#1F4E5F]">
                    Estilo Social & Preferencias de Crew
                  </h2>
                  <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                    Cómo disfrutas entrenar y qué buscas en la comunidad.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onEditProfile}
                  className="cursor-pointer text-xs font-black text-[#7FB77E] transition-colors hover:text-[#6ea26d]"
                >
                  Editar Preferencias
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Group size card */}
                <div className="flex flex-col gap-2 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Formato de Grupo Preferido
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#7FB77E]" />
                    <span className="text-sm font-black text-[#1F4E5F]">
                      {user.groupSizePreference === 'medium'
                        ? '🏃 Grupos Medianos (8 a 15 personas)'
                        : '👥 Microgrupos (4 a 6 personas)'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#1F4E5F]/70">
                    {user.groupSizePreference === 'medium'
                      ? 'Diversidad de ritmos, energía de club y espíritu comunitario.'
                      : 'Mayor homogeneidad de ritmo, cercanía y charla fluida.'}
                  </span>
                </div>

                {/* Social Goals list */}
                <div className="flex flex-col gap-2.5 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Metas en la Comunidad CIMO
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {goalsList.map((g, idx) => (
                      <span
                        key={idx}
                        className="shadow-2xs flex items-center gap-1 rounded-full border border-[#1F4E5F]/15 bg-white px-3 py-1 text-xs font-bold text-[#1F4E5F]"
                      >
                        <Check className="h-3 w-3 stroke-[3] text-[#7FB77E]" />
                        <span>{g}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Captain Mode & Notes (If Available) */}
            {user.isCaptainAvailable !== false && (
              <div className="shadow-xs flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#1F4E5F] to-[#163a47] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#7FB77E]">
                    <Award className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Perfil de Capitán Verificado
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="cursor-pointer text-xs font-bold text-white/80 underline hover:text-white"
                  >
                    Editar Normas
                  </button>
                </div>

                <h3 className="text-lg font-black tracking-tight">
                  Instrucciones Habituales en los Entrenos de {user.name}
                </h3>

                <div className="backdrop-blur-xs rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-medium italic leading-relaxed text-white/90">
                    "
                    {user.defaultCaptainNotes ??
                      '💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar'}
                    "
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Insignias y Logros */}
        {activeTab === 'badges' && (
          <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-black text-[#1F4E5F]">Insignias de la Comunidad CIMO</h2>
              <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                Logros desbloqueados por tu constancia, puntualidad y liderazgo de entrenos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ATHLETE_BADGES.map((b) => (
                <div
                  key={b.id}
                  className={`flex items-start gap-3.5 rounded-2xl border p-5 ${b.color}`}
                >
                  <span className="shrink-0 text-3xl">{b.icon}</span>
                  <div>
                    <h3 className="text-sm font-black">{b.title}</h3>
                    <p className="mt-0.5 text-xs font-medium leading-relaxed opacity-80">
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
          <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-black text-[#1F4E5F]">
                Valoraciones de Compañeros de Crew
              </h2>
              <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                Comentarios de deportistas que han asistido a entrenos liderados por ti.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {COMMUNITY_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="h-10 w-10 rounded-full border border-[#1F4E5F]/15 object-cover"
                      />
                      <div>
                        <span className="block text-xs font-black text-[#1F4E5F]">
                          {rev.author}
                        </span>
                        <span className="text-[10px] font-medium text-[#1F4E5F]/50">
                          {rev.date} • {rev.sport}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-[#1F4E5F]/80">
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
