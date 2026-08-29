import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bookmark,
  Calendar,
  Camera,
  Check,
  Clock,
  Flame,
  Globe,
  Heart,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react';
import type { UserProfileData } from './CimoEditProfileModal';

export type DayTimeSlot = 'morning' | 'noon' | 'afternoon';

export interface DaySchedule {
  day: string; // 'Lunes', 'Martes', etc.
  dayShort: string; // 'Lun', 'Mar', etc.
  slots: DayTimeSlot[];
}

export interface ExtendedUserProfileData extends UserProfileData {
  handle?: string;
  neighborhood?: string;
  coverUrl?: string;
  weeklySchedule?: Record<string, DayTimeSlot[]>;
  groupSizePreference?: 'micro' | 'medium';
  goals?: string[];
  isCaptainAvailable?: boolean;
  defaultCaptainNotes?: string;
  phoneWhatsapp?: string;
  phonePrivacy?: boolean;
  linkedinUrl?: string;
  stravaUrl?: string;
  instagramHandle?: string;
}

export interface CimoEditProfileViewProps {
  user: ExtendedUserProfileData;
  onBack: () => void;
  onSave: (updated: ExtendedUserProfileData) => void;
}

// 100% verified, stable high-res sports photography presets
const COVER_PRESETS = [
  {
    name: 'Running al Atardecer',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400',
  },
  {
    name: 'Pista de Pádel',
    url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1400',
  },
  {
    name: 'Montaña & Hiking',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1400',
  },
  {
    name: 'Ciclismo de Carretera',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1400',
  },
  {
    name: 'Crossfit & Training',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1400',
  },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
];

const ALL_SPORTS_CATALOG = [
  {
    id: 'Running',
    emoji: '🏃',
    defaultPace: '5:15 min/km',
    defaultLevel: 'Intermedio (5-10K)',
    detailsLabel: 'Ritmo cómodo habitual',
  },
  {
    id: 'Pádel',
    emoji: '🎾',
    defaultPace: 'Nivel 3.5 • Drive/Revés',
    defaultLevel: 'Intermedio Playtomic',
    detailsLabel: 'Nivel Playtomic & Posición',
  },
  {
    id: 'Hiking',
    emoji: '🥾',
    defaultPace: '10-15 km • +600m desnivel',
    defaultLevel: 'Rutas de montaña media',
    detailsLabel: 'Distancia y desnivel habitual',
  },
  {
    id: 'Crossfit',
    emoji: '🏋️',
    defaultPace: 'RX / Scaled • 3 días/sem',
    defaultLevel: 'Intermedio Box',
    detailsLabel: 'Nivel WOD & Frecuencia',
  },
  {
    id: 'Ciclismo',
    emoji: '🚴',
    defaultPace: 'Carretera • 28 km/h media',
    defaultLevel: 'Salidas 60-90 km',
    detailsLabel: 'Modalidad y velocidad media',
  },
  {
    id: 'Hyrox',
    emoji: '⚡',
    defaultPace: 'Open / Pro • Dobles',
    defaultLevel: 'Preparación competición',
    detailsLabel: 'Categoría Hyrox',
  },
];

const WEEK_DAYS = [
  { id: 'Lunes', short: 'L' },
  { id: 'Martes', short: 'M' },
  { id: 'Miércoles', short: 'X' },
  { id: 'Jueves', short: 'J' },
  { id: 'Viernes', short: 'V' },
  { id: 'Sábado', short: 'S' },
  { id: 'Domingo', short: 'D' },
];

const TIME_SLOT_OPTIONS: Array<{ id: DayTimeSlot; label: string; icon: any; timeText: string }> = [
  { id: 'morning', label: 'Mañanas', icon: Sunrise, timeText: '07:00 - 09:00' },
  { id: 'noon', label: 'Mediodía', icon: Sun, timeText: '14:00 - 15:30' },
  { id: 'afternoon', label: 'Tardes', icon: Sunset, timeText: '18:30 - 21:00' },
];

const COMMUNITY_GOALS = [
  '🤝 Conocer deportistas activos',
  '☕ Café / Caña post-entreno (Tercer Tiempo)',
  '🎯 Preparar carreras y torneos',
  '🔥 Mantener constancia semanal',
  '👑 Liderar entrenos como Capitán',
  '🌍 Descubrir nuevas rutas en mi ciudad',
];

export const CimoEditProfileView: React.FC<CimoEditProfileViewProps> = ({
  user,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle ?? '@alexrivera');
  const [city, setCity] = useState(user.city ?? 'Madrid, España');
  const [neighborhood, setNeighborhood] = useState(user.neighborhood ?? 'Retiro / Chamberí');
  const [bio, setBio] = useState(
    user.bio ??
      'Apasionado del running matutino y las partidas de pádel. ¡Siempre dispuesto a sumar nuevos kilómetros y conectar con gente activa!'
  );
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? AVATAR_PRESETS[0]);
  const [coverUrl, setCoverUrl] = useState(user.coverUrl ?? COVER_PRESETS[0].url);
  const [customCoverInput, setCustomCoverInput] = useState('');

  // Sports & Technical Passport
  const [sports, setSports] = useState<Array<{ sport: string; level: string; pace?: string }>>(
    user.sports ?? [
      { sport: 'Running', level: 'Intermedio (5-10K)', pace: '5:15 min/km' },
      { sport: 'Pádel', level: 'Nivel 3.5 (Intermedio)', pace: 'Drive / Revés' },
      { sport: 'Hiking', level: 'Rutas 10-15 km', pace: 'Desnivel medio' },
    ]
  );

  // Day-by-Day Schedule Matrix (Record<day, DayTimeSlot[]>)
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DayTimeSlot[]>>(
    user.weeklySchedule ?? {
      Lunes: ['afternoon'],
      Martes: ['morning'],
      Miércoles: ['afternoon'],
      Jueves: ['afternoon'],
      Viernes: [],
      Sábado: ['morning'],
      Domingo: ['morning'],
    }
  );

  // Community & Social Preferences
  const [groupSizePreference, setGroupSizePreference] = useState<'micro' | 'medium'>(
    user.groupSizePreference ?? 'micro'
  );
  const [goals, setGoals] = useState<string[]>(
    user.goals ?? [
      '🤝 Conocer deportistas activos',
      '☕ Café / Caña post-entreno (Tercer Tiempo)',
      '🔥 Mantener constancia semanal',
    ]
  );

  // Contact Channels
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(user.phoneWhatsapp ?? '+34 612 345 678');
  const [phonePrivacy, setPhonePrivacy] = useState(user.phonePrivacy ?? true);
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl ?? 'https://linkedin.com/in/alexrivera-sport');
  const [stravaUrl, setStravaUrl] = useState(user.stravaUrl ?? 'https://strava.com/athletes/alexrivera');
  const [instagramHandle, setInstagramHandle] = useState(user.instagramHandle ?? '@alex_rivera_cimo');

  // Captain Mode
  const [isCaptainAvailable, setIsCaptainAvailable] = useState<boolean>(
    user.isCaptainAvailable ?? true
  );
  const [defaultCaptainNotes, setDefaultCaptainNotes] = useState<string>(
    user.defaultCaptainNotes ?? '💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sports toggle
  const handleToggleSport = (catalogSport: typeof ALL_SPORTS_CATALOG[0]) => {
    if (sports.some((s) => s.sport === catalogSport.id)) {
      setSports(sports.filter((s) => s.sport !== catalogSport.id));
    } else {
      setSports([
        ...sports,
        {
          sport: catalogSport.id,
          level: catalogSport.defaultLevel,
          pace: catalogSport.defaultPace,
        },
      ]);
    }
  };

  const handleUpdateSportField = (sportName: string, field: 'pace' | 'level', val: string) => {
    setSports((prev) =>
      prev.map((s) => (s.sport === sportName ? { ...s, [field]: val } : s))
    );
  };

  // Day-by-Day Schedule Slot Toggle
  const handleToggleDaySlot = (day: string, slot: DayTimeSlot) => {
    const currentSlots = weeklySchedule[day] ?? [];
    const updated = currentSlots.includes(slot)
      ? currentSlots.filter((s) => s !== slot)
      : [...currentSlots, slot];

    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: updated,
    }));
  };

  const handleQuickPresetSchedule = (type: 'afternoons' | 'mornings' | 'weekends') => {
    if (type === 'afternoons') {
      setWeeklySchedule({
        Lunes: ['afternoon'],
        Martes: ['afternoon'],
        Miércoles: ['afternoon'],
        Jueves: ['afternoon'],
        Viernes: ['afternoon'],
        Sábado: ['morning'],
        Domingo: ['morning'],
      });
    } else if (type === 'mornings') {
      setWeeklySchedule({
        Lunes: ['morning'],
        Martes: ['morning'],
        Miércoles: ['morning'],
        Jueves: ['morning'],
        Viernes: ['morning'],
        Sábado: ['morning'],
        Domingo: [],
      });
    } else if (type === 'weekends') {
      setWeeklySchedule((prev) => ({
        ...prev,
        Sábado: ['morning', 'noon'],
        Domingo: ['morning'],
      }));
    }
  };

  const handleToggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ExtendedUserProfileData = {
      ...user,
      name: name.trim() || user.name,
      handle: handle.trim() || '@atleta',
      city: city.trim() || 'Madrid, España',
      neighborhood: neighborhood.trim() || 'Centro',
      bio: bio.trim(),
      avatarUrl,
      coverUrl,
      sports,
      weeklySchedule,
      groupSizePreference,
      goals,
      isCaptainAvailable,
      defaultCaptainNotes,
      phoneWhatsapp,
      phonePrivacy,
      linkedinUrl,
      stravaUrl,
      instagramHandle,
    };

    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onBack();
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6 text-[#1F4E5F] max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* 🧭 Top Navigation Island */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mi Perfil</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-black text-[#00B894] uppercase tracking-wider bg-[#00B894]/10 px-3 py-1 rounded-full">
            <Award className="w-4 h-4" />
            <span>Pasaporte Deportivo CIMO</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
            Edita tu Perfil & Pasaporte de Atleta
          </h1>
          <p className="text-xs sm:text-sm text-[#1F4E5F]/70 mt-1 font-medium leading-relaxed">
            Configura tu disponibilidad exacta por día, canales de contacto y marcas deportivas para unirte a los mejores Crews.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 🏞️ Isla 1: Identidad & Fotos */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Identidad & Fotos de Portada
              </span>
            </div>
            <span className="text-xs font-bold text-[#00B894]">Paso 1 de 5</span>
          </div>

          {/* Panoramic Cover Preview & Presets */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Foto de Portada Panorámica
              </label>
              <span className="text-[10px] font-bold text-[#00B894]">
                Resolución 16:9 de alta calidad
              </span>
            </div>

            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-[#1F4E5F]/15 shadow-inner bg-[#1F4E5F]/5">
              <img
                src={coverUrl}
                alt="Vista previa de portada"
                className="w-full h-full object-cover transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = COVER_PRESETS[0].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-end p-4">
                <span className="text-xs font-black text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  📷 Portada en Vivo
                </span>
              </div>
            </div>

            {/* Presets Gallery */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold text-[#1F4E5F]/70">
                Elige una foto de portada deportiva:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {COVER_PRESETS.map((cp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverUrl(cp.url)}
                    className={`p-1.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 text-left ${
                      coverUrl === cp.url
                        ? 'border-[#00B894] bg-[#00B894]/10 ring-2 ring-[#00B894]/20 shadow-xs'
                        : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:border-[#1F4E5F]/30'
                    }`}
                  >
                    <div className="h-12 w-full rounded-lg overflow-hidden bg-slate-200">
                      <img src={cp.url} alt={cp.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-[#1F4E5F] truncate w-full text-center">
                      {cp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-[#1F4E5F]/10">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-3 border-[#00B894] shadow-md bg-white"
              />
              <div className="absolute bottom-0 right-0 bg-[#00B894] text-white p-1 rounded-full border border-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Avatar del Atleta
              </label>
              <div className="flex items-center gap-2">
                {AVATAR_PRESETS.map((ap, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(ap)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === ap
                        ? 'border-[#00B894] ring-2 ring-[#00B894]/30 scale-110 shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={ap} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name, Handle, City and Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Handle Deportivo (@usuario)
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@tu_usuario"
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Ciudad Base
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Madrid, España"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Barrio o Zona Habitual
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ej: Retiro / Chamberí / Salamanca"
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Bio / Motto */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Bio Deportiva & Lema
              </label>
              <span className="text-[10px] font-bold text-[#1F4E5F]/50">
                {bio.length}/250
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={250}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntale al Crew qué te apasiona del deporte, tus metas del año o tu estilo de entreno..."
              className="w-full p-4 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* ⚡ Isla 2: Pasaporte Técnico por Deporte */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Pasaporte Técnico por Deporte
              </span>
            </div>
            <span className="text-xs font-bold text-[#00B894]">Paso 2 de 5</span>
          </div>

          <p className="text-xs text-[#1F4E5F]/70 font-medium -mt-2">
            Selecciona los deportes que practicas y define tus marcas reales de ritmo y nivel para que los capitanes sepan que encajas en su plan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_SPORTS_CATALOG.map((cat) => {
              const isSelected = sports.some((s) => s.sport === cat.id);
              const userSportObj = sports.find((s) => s.sport === cat.id);

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                    isSelected
                      ? 'border-[#00B894] bg-[#00B894]/5 shadow-xs'
                      : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:border-[#1F4E5F]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleSport(cat)}
                      className="flex items-center gap-2.5 cursor-pointer text-left"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <div>
                        <span className="text-sm font-black text-[#1F4E5F] block leading-tight">
                          {cat.id}
                        </span>
                        <span className="text-[10px] font-extrabold text-[#1F4E5F]/60">
                          {isSelected ? 'Activo en tu perfil' : 'Haz clic para añadir'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSport(cat)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00B894] text-white shadow-2xs'
                          : 'border border-[#1F4E5F]/30 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="pt-2 border-t border-[#1F4E5F]/10 flex flex-col gap-2 animate-in fade-in">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                          {cat.detailsLabel}
                        </label>
                        <input
                          type="text"
                          value={userSportObj?.pace ?? cat.defaultPace}
                          onChange={(e) =>
                            handleUpdateSportField(cat.id, 'pace', e.target.value)
                          }
                          placeholder="Ej: 5:15 min/km o Nivel 3.5 Playtomic"
                          className="w-full px-3 py-1.5 rounded-xl border border-[#1F4E5F]/15 bg-white text-xs font-bold text-[#1F4E5F] outline-none focus:border-[#00B894]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                          Nivel / Distancia habitual
                        </label>
                        <input
                          type="text"
                          value={userSportObj?.level ?? cat.defaultLevel}
                          onChange={(e) =>
                            handleUpdateSportField(cat.id, 'level', e.target.value)
                          }
                          placeholder="Ej: Intermedio (5-10K)"
                          className="w-full px-3 py-1.5 rounded-xl border border-[#1F4E5F]/15 bg-white text-xs font-bold text-[#1F4E5F] outline-none focus:border-[#00B894]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ⏰ Isla 3: Disponibilidad Exacta por Día y Franja Horaria (Schedule Matrix) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Disponibilidad por Día & Horario
              </span>
            </div>
            <span className="text-xs font-bold text-[#00B894]">Paso 3 de 5</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 -mt-2">
            <p className="text-xs text-[#1F4E5F]/70 font-medium">
              Marca qué momentos tienes libres en cada día de la semana.
            </p>

            {/* Quick Helper Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold text-[#1F4E5F]/60">Atajos rápidos:</span>
              <button
                type="button"
                onClick={() => handleQuickPresetSchedule('afternoons')}
                className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#1F4E5F]/10 hover:bg-[#1F4E5F]/20 text-[#1F4E5F] transition-colors cursor-pointer"
              >
                🌇 Tardes
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetSchedule('mornings')}
                className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#1F4E5F]/10 hover:bg-[#1F4E5F]/20 text-[#1F4E5F] transition-colors cursor-pointer"
              >
                🌅 Mañanas
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetSchedule('weekends')}
                className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#1F4E5F]/10 hover:bg-[#1F4E5F]/20 text-[#1F4E5F] transition-colors cursor-pointer"
              >
                ☕ Finde
              </button>
            </div>
          </div>

          {/* Day-by-Day Schedule Rows */}
          <div className="flex flex-col gap-3">
            {WEEK_DAYS.map((wd) => {
              const activeSlots = weeklySchedule[wd.id] ?? [];
              const isDayActive = activeSlots.length > 0;

              return (
                <div
                  key={wd.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDayActive
                      ? 'border-[#00B894]/40 bg-[#00B894]/5'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7]/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isDayActive
                          ? 'bg-[#00B894] text-white shadow-2xs'
                          : 'bg-[#1F4E5F]/10 text-[#1F4E5F]'
                      }`}
                    >
                      {wd.short}
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#1F4E5F] block leading-tight">
                        {wd.id}
                      </span>
                      <span className="text-[10px] font-bold text-[#1F4E5F]/60">
                        {isDayActive ? `${activeSlots.length} franja(s)` : 'No disponible'}
                      </span>
                    </div>
                  </div>

                  {/* 3 Time Slot Pills for This Day */}
                  <div className="grid grid-cols-3 gap-2 flex-1 max-w-xl">
                    {TIME_SLOT_OPTIONS.map((slot) => {
                      const isSlotActive = activeSlots.includes(slot.id);
                      const IconComp = slot.icon;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleToggleDaySlot(wd.id, slot.id)}
                          className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                            isSlotActive
                              ? 'bg-[#1F4E5F] border-[#1F4E5F] text-white font-black shadow-2xs scale-[1.02]'
                              : 'bg-white border-[#1F4E5F]/15 text-[#1F4E5F] hover:bg-white hover:border-[#1F4E5F]/30'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <IconComp
                              className={`w-3.5 h-3.5 ${
                                isSlotActive ? 'text-[#00B894]' : 'text-[#1F4E5F]/60'
                              }`}
                            />
                            <span className="text-xs font-black leading-tight">
                              {slot.label}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-extrabold ${
                              isSlotActive ? 'text-white/80' : 'text-[#1F4E5F]/50'
                            }`}
                          >
                            {slot.timeText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📱 Isla 4: Canales de Contacto, Redes & Estilo Social */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                4
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Canales de Contacto & Redes
              </span>
            </div>
            <span className="text-xs font-bold text-[#00B894]">Paso 4 de 5</span>
          </div>

          {/* WhatsApp / Phone with Privacy Lock */}
          <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#00B894]" />
                <span>WhatsApp / Teléfono de Coordinación</span>
              </label>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full">
                <Lock className="w-3 h-3" />
                <span>Privacidad protegida</span>
              </div>
            </div>

            <input
              type="tel"
              value={phoneWhatsapp}
              onChange={(e) => setPhoneWhatsapp(e.target.value)}
              placeholder="+34 600 000 000"
              className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-white shadow-2xs"
            />

            <label className="flex items-center gap-2 text-xs font-bold text-[#1F4E5F]/80 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={phonePrivacy}
                onChange={(e) => setPhonePrivacy(e.target.checked)}
                className="w-4 h-4 rounded text-[#00B894] focus:ring-[#00B894]"
              />
              <span>
                Compartir solo con capitanes y compañeros de entrenos a los que me haya unido.
              </span>
            </label>
          </div>

          {/* Social Links: LinkedIn, Strava, Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                <span>LinkedIn Profesional</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/tu_perfil"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#00B894]" />
                <span>Perfil de Strava</span>
              </label>
              <input
                type="url"
                value={stravaUrl}
                onChange={(e) => setStravaUrl(e.target.value)}
                placeholder="https://strava.com/athletes/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Deportivo</span>
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@tu_instagram"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Social Goals Chips */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-[#1F4E5F]/10">
            <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              ¿Qué buscas en la comunidad CIMO?
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_GOALS.map((g) => {
                const isSelected = goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleToggleGoal(g)}
                    className={`px-3.5 py-2 rounded-full text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[#00B894] bg-[#00B894]/15 text-[#1F4E5F] font-black shadow-2xs'
                        : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#00B894] stroke-[3]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#00B894]" />
                    )}
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 👑 Isla 5: Modo Capitán & Normas Habituales */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                5
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Modo Capitán & Normas Habituales
              </span>
            </div>
            <span className="text-xs font-bold text-[#00B894]">Paso 5 de 5</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-[#1F4E5F] block">
                  ¿Disponible para liderar entrenos como Capitán?
                </span>
                <span className="text-[11px] text-[#1F4E5F]/70 font-medium">
                  Aparecerás con la insignia de Capitán Verificado en tu comunidad.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCaptainAvailable(!isCaptainAvailable)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                isCaptainAvailable ? 'bg-[#00B894] justify-end' : 'bg-[#1F4E5F]/20 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {isCaptainAvailable && (
            <div className="flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Tus Instrucciones Habituales de Capitán
                </label>
                <span className="text-[10px] font-bold text-[#00B894]">
                  Se precargarán en tus entrenos
                </span>
              </div>
              <textarea
                rows={3}
                value={defaultCaptainNotes}
                onChange={(e) => setDefaultCaptainNotes(e.target.value)}
                placeholder="Ej: 💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar"
                className="w-full p-4 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* 🚀 Bottom Action Card */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] block">
              ¿Listo para guardar tu Pasaporte Deportivo?
            </span>
            <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
              Tu disponibilidad por día y contactos se sincronizarán al instante.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-full text-xs font-extrabold text-[#1F4E5F] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full text-xs font-black bg-[#00B894] hover:bg-[#009678] text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Guardado con éxito!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Pasaporte Deportivo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
