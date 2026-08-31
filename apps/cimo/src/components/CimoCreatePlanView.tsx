import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Apple,
  ArrowLeft,
  Award,
  Beer,
  Bike,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Droplets,
  Eye,
  FileText,
  Flame,
  Footprints,
  Image as ImageIcon,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  Upload,
  Users,
  Wand2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import { CimoCitySearchCombobox } from './CimoCitySearchCombobox';
import { CimoMapPreviewCard } from './CimoMapPreviewCard';
import { CimoCaptainInstructionsField } from './CimoCaptainInstructionsField';
import { CimoSportPaceSelector } from './CimoSportPaceSelector';
import { useSpainLocationSearch } from '../hooks/useSpainLocationSearch';
import {
  CIMO_SPORTS_CATALOG,
  getSportGear,
  getSportPaces,
  getSportRealPhotos,
  getThirdHalfSpots,
} from '../data/sportsCatalog';

export interface CimoCreatePlanViewProps {
  onBack: () => void;
  onCreate: (newPlan: Partial<ActivityCardData>) => void;
  onDraftChange?: (draft: {
    sport: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
    level: string;
    thirdHalfType: string;
    thirdHalfTitle: string;
    thirdHalfLocation: string;
    image: string;
    price: string;
  }) => void;
}

const THIRD_HALF_TYPES = [
  { id: 'cafe' as const, label: 'Café & Desayuno', icon: Coffee, defaultVenue: 'Cafetería con terraza soleada' },
  { id: 'beer' as const, label: 'Caña & Tapeo', icon: Beer, defaultVenue: 'Terraza o bar del club' },
  { id: 'smoothie' as const, label: 'Smoothie Recovery', icon: Sparkles, defaultVenue: 'Juice & Recovery Bar' },
  { id: 'picnic' as const, label: 'Picnic al Aire Libre', icon: Sun, defaultVenue: 'Césped con sombra' },
];

const THIRD_HALF_NOTES_SUGGESTIONS = [
  'Mesa en terraza soleada',
  'Café de especialidad y desayuno',
  'Cañas y picoteo para comentar los puntos',
  'Batidos proteicos y fruta fresca',
  'Charla distendida de 30-40 min tras entrenar',
  'Cada asistente paga su consumición',
];

const sportsList = CIMO_SPORTS_CATALOG;

const spanishCities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao', 'Zaragoza', 'Otra'];

const cityLocationsMap: Record<string, string[]> = {
  Madrid: [
    'Parque del Retiro (Puerta de Alcalá)',
    'Madrid Río (Puente de Segovia)',
    'Club Tenis Chamartín',
    'Casa de Campo (Lago)',
    'Box Singular Chamberí',
    'Sierra de Guadarrama / Navacerrada',
  ],
  Barcelona: [
    'Paseo Marítimo Barceloneta',
    'Carretera de les Aigües',
    'Montjuïc (Font Màgica)',
    'Diagonal / Turó Park',
    'Pádel Indoor Poble Nou',
    'Parc de Collserola',
  ],
  Valencia: [
    'Jardines del Turia (Puente de las Flores)',
    'Marina Real de Valencia',
    'Playa de la Malvarrosa',
    'Pádel Club Ruzafa',
  ],
  Sevilla: [
    'Parque de María Luisa / Plaza de España',
    'Márgenes del Guadalquivir (Triana)',
    'Parque del Alamillo',
  ],
  Málaga: [
    'Paseo Marítimo Antonio Banderas',
    'Muelle Uno / La Farola',
    'Castillo de Gibralfaro',
  ],
  Bilbao: [
    'Ría de Bilbao / Guggenheim',
    'Parque Doña Casilda',
    'Paseo de Artxanda',
  ],
  Zaragoza: [
    'Parque Grande José Antonio Labordeta',
    'Riberas del Ebro / Expo',
  ],
  Otra: [
    'Parque Principal',
    'Polideportivo Municipal',
    'Pistas del Club',
  ],
};

const quickDates = [
  { label: 'Hoy', sub: 'Entreno hoy', value: 'Hoy' },
  { label: 'Mañana', sub: 'Próximas 24h', value: 'Mañana' },
  { label: 'Este finde', sub: 'Sáb o Dom', value: 'Este fin de semana' },
  { label: 'Sábado', sub: 'Fin de semana', value: 'Sábado' },
  { label: 'Domingo', sub: 'Fin de semana', value: 'Domingo' },
  { label: 'Próx. semana', sub: 'Días laborables', value: 'Próxima semana' },
];

const quickTimes = [
  { label: '07:30', icon: Sunrise, desc: 'Madrugón' },
  { label: '08:30', icon: Sunrise, desc: 'Mañana' },
  { label: '10:00', icon: Sun, desc: 'Media mañana' },
  { label: '14:00', icon: Sun, desc: 'Mediodía' },
  { label: '18:30', icon: Sunset, desc: 'Tarde' },
  { label: '19:30', icon: Sunset, desc: 'Afterwork' },
  { label: '20:30', icon: Sunset, desc: 'Noche' },
];

const availableHours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
const availableMinutes = ['00', '15', '30', '45'];

const descriptionEnhancementChips: Record<string, string[]> = {
  hiking: [
    'Ruta circular panorámica',
    'Paradas de reagrupación y fotos',
    'Ritmo constante y ameno',
    'Vistas despejadas de la sierra',
    'Desconexión total en la naturaleza',
  ],
  running: [
    'Rodaje conversacional continuo',
    'Tirada progresiva en grupo',
    '5 min de estiramientos finales',
    'Trazado llano y con sombra',
    'Buen rollo y motivación mutua',
  ],
  padel: [
    'Partido amistoso a 3 sets',
    'Peloteo fluido y voleas',
    'Rotación de parejas dinámica',
    'Ambiente social sin presión',
    'Pista de cristal climatizada',
  ],
  cycling: [
    'Salida en grupeta con relevos suaves',
    'Carreteras secundarias tranquilas',
    'Parada en fuente intermedia',
    'Ritmo constante y seguro',
  ],
  crossfit: [
    'WOD en equipo por estaciones',
    'Calentamiento articular guiado',
    'Adaptable a cualquier condición física',
    'Estiramientos y vuelta a la calma',
  ],
};

export const CimoCreatePlanView: React.FC<CimoCreatePlanViewProps> = ({
  onBack,
  onCreate,
  onDraftChange,
}) => {
  const [sport, setSport] = useState('running');
  const [selectedCity, setSelectedCity] = useState('Madrid');
  const [location, setLocation] = useState('Parque del Retiro (Puerta de Alcalá)');
  const [date, setDate] = useState('Hoy');
  const [time, setTime] = useState('19:30');
  const [selectedPaceIndex, setSelectedPaceIndex] = useState(1);
  const [maxMembers, setMaxMembers] = useState(5);
  const [instructions, setInstructions] = useState('');
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([
    'footwear', 'water', 'windbreaker', 'snack', 'sun', 'racket', 'shoes', 'balls', 'bike', 'helmet', 'tools', 'apparel', 'energy',
  ]);

  // Optional Third Half (Tercer Tiempo) State
  const [hasThirdHalf, setHasThirdHalf] = useState(true);
  const [thirdHalfType, setThirdHalfType] = useState<'cafe' | 'beer' | 'smoothie' | 'picnic'>('cafe');
  const [thirdHalfVenue, setThirdHalfVenue] = useState('Café Murillo (Retiro)');
  const [thirdHalfNotes, setThirdHalfNotes] = useState('Nos sentaremos 30 min a tomar un café, rehidratarnos y charlar tras el entreno.');
  const [isThirdHalfDropdownOpen, setIsThirdHalfDropdownOpen] = useState(false);

  // Final Step 9: Title, Smart Description & Real Photo Cover State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCoverUrl, setSelectedCoverUrl] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isCustomImageMode, setIsCustomImageMode] = useState(false);

  // Custom Visual Pickers State
  const [isCityComboboxOpen, setIsCityComboboxOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);

  const locationContainerRef = useRef<HTMLDivElement>(null);
  const thirdHalfContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { results: liveResults, isLoading: isSearchingPlaces } = useSpainLocationSearch(location, selectedCity);
  const { results: liveThirdHalfResults, isLoading: isSearchingThirdHalf } = useSpainLocationSearch(thirdHalfVenue, selectedCity);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationContainerRef.current && !locationContainerRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (thirdHalfContainerRef.current && !thirdHalfContainerRef.current.contains(e.target as Node)) {
        setIsThirdHalfDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [calendarMonth, setCalendarMonth] = useState('Septiembre 2026');
  const [selectedHour, setSelectedHour] = useState('19');
  const [selectedMinute, setSelectedMinute] = useState('30');

  const selectedSportObj = sportsList.find((s) => s.id === sport) ?? sportsList[0];
  const activePaces = getSportPaces(sport);
  const currentPace = activePaces[selectedPaceIndex] ?? activePaces[0];
  const realPhotos = useMemo(() => getSportRealPhotos(sport), [sport]);

  // Set default photo cover when sport changes if not manually custom
  useEffect(() => {
    if (!isCustomImageMode && realPhotos.length > 0) {
      setSelectedCoverUrl(realPhotos[0].url);
    }
  }, [sport, realPhotos, isCustomImageMode]);

  const cleanLocationName = useMemo(() => {
    return location.split('(')[0].replace(/,\s*[A-Za-zÀ-ÿ\s]+$/, '').trim() || location.trim();
  }, [location]);

  // Smart Generated Title Options
  const titleVariants = useMemo(() => {
    const loc = cleanLocationName;
    const sportName = selectedSportObj.label;
    const paceLabel = currentPace.metric ? `(${currentPace.metric})` : '';

    return {
      dynamic: `${sportName} ${paceLabel} • ${loc}`.replace(/\s+/g, ' ').trim(),
      social: `Sesión en Grupo ${hasThirdHalf ? '& ' + (thirdHalfType === 'cafe' ? 'Café' : thirdHalfType === 'beer' ? 'Cañas' : 'Tercer Tiempo') : ''} en ${loc}`.replace(/\s+/g, ' ').trim(),
      technical: `Entrenamiento ${currentPace.title} • ${loc}`.replace(/\s+/g, ' ').trim(),
    };
  }, [cleanLocationName, selectedSportObj, currentPace, hasThirdHalf, thirdHalfType]);

  // Auto-generate smart description based on all inputs
  const autoGeneratedDescription = useMemo(() => {
    const sportName = selectedSportObj.label;
    const loc = cleanLocationName;
    const paceTitle = currentPace.title;
    const paceMetric = currentPace.metric;
    const thirdHalfText = hasThirdHalf
      ? ` Al terminar, nos quedaremos en ${thirdHalfVenue.split('(')[0].trim() || 'una terraza cercana'} para compartir el tercer tiempo.`
      : '';

    if (sport === 'hiking') {
      return `Ruta circular de senderismo por la zona de ${loc}. Mantendremos un ritmo de ${paceTitle} (${paceMetric}) con paradas para fotos y reagrupación.${thirdHalfText}`;
    }
    if (sport === 'padel') {
      return `Partido amistoso de pádel nivel ${paceTitle} (${paceMetric}) en ${loc}. Peloteo continuo, buen ambiente y puntos disputados.${thirdHalfText}`;
    }
    if (sport === 'cycling') {
      return `Salida en grupeta ciclista saliendo de ${loc}. Rodaremos a ritmo ${paceTitle} con relevos suaves y seguridad en todo el trayecto.${thirdHalfText}`;
    }
    return `Rodaje dinámico en grupo por ${loc}. Mantendremos un ritmo ${paceTitle} (${paceMetric}), ideal para sumar kilómetros con buena energía.${thirdHalfText}`;
  }, [selectedSportObj, cleanLocationName, currentPace, hasThirdHalf, thirdHalfVenue, sport]);

  // Effective title and image
  const effectiveTitle = title.trim() || titleVariants.dynamic;
  const effectiveDescription = description.trim() || autoGeneratedDescription;
  const effectiveImage = isCustomImageMode && customImageUrl ? customImageUrl : (selectedCoverUrl || realPhotos[0]?.url || selectedSportObj.image);

  // Sync draft state with RightSupportZone Live Preview
  useEffect(() => {
    if (onDraftChange) {
      onDraftChange({
        sport: selectedSportObj.label,
        title: effectiveTitle,
        description: effectiveDescription,
        date,
        time,
        location,
        capacity: maxMembers,
        level: `${currentPace.title} (${currentPace.metric})`,
        thirdHalfType,
        thirdHalfTitle: hasThirdHalf
          ? (THIRD_HALF_TYPES.find((t) => t.id === thirdHalfType)?.label ?? 'Tercer Tiempo')
          : 'Sin tercer tiempo',
        thirdHalfLocation: hasThirdHalf ? thirdHalfVenue : '',
        image: effectiveImage,
        price: 'Gratis',
      });
    }
  }, [
    effectiveTitle,
    effectiveDescription,
    effectiveImage,
    sport,
    selectedSportObj,
    date,
    time,
    location,
    maxMembers,
    currentPace,
    hasThirdHalf,
    thirdHalfType,
    thirdHalfVenue,
    onDraftChange,
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImageUrl(result);
          setIsCustomImageMode(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDescriptionChip = (chipText: string) => {
    if (description.includes(chipText)) {
      const cleaned = description
        .replace(new RegExp(`\\.?\\s*${chipText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.?`, 'g'), '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*\.\s*/, '')
        .trim();
      setDescription(cleaned);
    } else {
      const current = description.trim() || autoGeneratedDescription;
      const updated = current ? `${current}. ${chipText}` : chipText;
      setDescription(updated.slice(0, 500));
    }
  };

  const handleAddThirdHalfChip = (chipText: string) => {
    if (thirdHalfNotes.includes(chipText)) {
      const cleaned = thirdHalfNotes
        .replace(new RegExp(`\\.?\\s*${chipText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.?`, 'g'), '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*\.\s*/, '')
        .trim();
      setThirdHalfNotes(cleaned);
    } else {
      const updated = thirdHalfNotes.trim() ? `${thirdHalfNotes.trim()}. ${chipText}` : chipText;
      setThirdHalfNotes(updated.slice(0, 200));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({
      title: effectiveTitle,
      sport,
      location,
      date,
      time,
      level: currentPace.level,
      paceOrDetails: `${currentPace.title} • ${currentPace.metric}`,
      maxMembers,
      image: effectiveImage,
      description: effectiveDescription,
      instructions: instructions.trim() || undefined,
      whatToBring: getSportGear(sport).filter((g) => selectedGearIds.includes(g.id)),
      thirdHalf: hasThirdHalf
        ? {
            enabled: true,
            type: thirdHalfType,
            venue: thirdHalfVenue.trim() || 'Cafetería cercana',
            notes: thirdHalfNotes.trim() || undefined,
          }
        : {
            enabled: false,
          },
    });
  };

  // Days for September 2026 calendar (Starts on Tuesday 1st)
  const calendarDays = [
    { day: '', empty: true }, // Monday
    { day: 1, name: 'Mar 1 Sep' },
    { day: 2, name: 'Mié 2 Sep' },
    { day: 3, name: 'Jue 3 Sep' },
    { day: 4, name: 'Vie 4 Sep' },
    { day: 5, name: 'Sáb 5 Sep' },
    { day: 6, name: 'Dom 6 Sep' },
    { day: 7, name: 'Lun 7 Sep' },
    { day: 8, name: 'Mar 8 Sep' },
    { day: 9, name: 'Mié 9 Sep' },
    { day: 10, name: 'Jue 10 Sep' },
    { day: 11, name: 'Vie 11 Sep' },
    { day: 12, name: 'Sáb 12 Sep' },
    { day: 13, name: 'Dom 13 Sep' },
    { day: 14, name: 'Lun 14 Sep' },
    { day: 15, name: 'Mar 15 Sep' },
    { day: 16, name: 'Mié 16 Sep' },
    { day: 17, name: 'Jue 17 Sep' },
    { day: 18, name: 'Vie 18 Sep' },
    { day: 19, name: 'Sáb 19 Sep' },
    { day: 20, name: 'Dom 20 Sep' },
    { day: 21, name: 'Lun 21 Sep' },
    { day: 22, name: 'Mar 22 Sep' },
    { day: 23, name: 'Mié 23 Sep' },
    { day: 24, name: 'Jue 24 Sep' },
    { day: 25, name: 'Vie 25 Sep' },
    { day: 26, name: 'Sáb 26 Sep' },
    { day: 27, name: 'Dom 27 Sep' },
    { day: 28, name: 'Lun 28 Sep' },
    { day: 29, name: 'Mar 29 Sep' },
    { day: 30, name: 'Mié 30 Sep' },
  ];

  return (
    <div className="flex flex-col gap-6 text-[#1F4E5F] max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 🧭 Top Navigation Header Island */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Explorar</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-black text-[#7FB77E] uppercase tracking-wider bg-[#7FB77E]/10 px-3 py-1 rounded-full">
            <Award className="w-4 h-4" />
            <span>Estudio de Capitán</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
            Crea tu Entrenamiento Grupal
          </h1>
          <p className="text-xs sm:text-sm text-[#1F4E5F]/70 mt-1 font-medium leading-relaxed">
            Diseña tu Crew en 9 pasos guiados. Los miembros de tu ciudad podrán descubrir tu propuesta y unirse.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 🏃 Island 1: Deporte */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                ¿Qué deporte vas a liderar?
              </span>
            </div>
            <span className="text-xs font-black text-[#7FB77E] capitalize bg-[#7FB77E]/10 px-3 py-1 rounded-full">
              {sport}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sportsList.map((s) => {
              const isSelected = sport === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSport(s.id);
                    setSelectedPaceIndex(1);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white shadow-md scale-[1.02]'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5 hover:border-[#1F4E5F]/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-[#7FB77E]/15 text-[#1F4E5F]'}`}>
                    {s.id === 'hiking' ? (
                      <Footprints className="w-5 h-5" />
                    ) : s.id === 'padel' ? (
                      <Activity className="w-5 h-5" />
                    ) : s.id === 'cycling' ? (
                      <Bike className="w-5 h-5" />
                    ) : (
                      <Flame className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 📅 Island 2: Cuándo Entrenamos (Fecha & Hora) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          {/* Step 2: Fecha */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                  ¿Qué día entrenamos?
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#7FB77E]">{date}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {quickDates.map((qd) => {
                const isSelected = date === qd.value && !isCustomCalendarOpen;
                return (
                  <button
                    key={qd.value}
                    type="button"
                    onClick={() => {
                      setDate(qd.value);
                      setIsCustomCalendarOpen(false);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white shadow-xs scale-[1.02]'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
                    }`}
                  >
                    <span className="text-xs font-black leading-tight">{qd.label}</span>
                    <span className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#1F4E5F]/50'}`}>
                      {qd.sub}
                    </span>
                  </button>
                );
              })}

              {/* 7th item: Custom Calendar Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCustomCalendarOpen(!isCustomCalendarOpen)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[58px] ${
                  isCustomCalendarOpen
                    ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-xs scale-[1.02]'
                    : 'border-dashed border-[#1F4E5F]/30 bg-white text-[#1F4E5F] hover:bg-[#F7F7F7]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Calendar className={`w-3.5 h-3.5 ${isCustomCalendarOpen ? 'text-white' : 'text-[#7FB77E]'}`} />
                  <span className="text-xs font-black leading-tight whitespace-nowrap">Otro día</span>
                </div>
                <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${isCustomCalendarOpen ? 'text-white/80' : 'text-[#1F4E5F]/50'}`}>
                  Calendario
                </span>
              </button>
            </div>

            {/* Custom Visual Interactive Month Calendar */}
            {isCustomCalendarOpen && (
              <div className="p-5 bg-[#F7F7F7] rounded-3xl border border-[#1F4E5F]/15 flex flex-col gap-4 animate-in fade-in zoom-in-98 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                    {calendarMonth}
                  </span>
                  <span className="text-xs font-extrabold text-[#7FB77E]">Selecciona fecha</span>
                </div>

                {/* Day names header */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <span key={d} className="text-[10px] font-black text-[#1F4E5F]/60 py-1">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cd, idx) => {
                    if (cd.empty) {
                      return <div key={`empty-${idx}`} className="h-8" />;
                    }
                    const isSelectedDay = date === cd.name;
                    return (
                      <button
                        key={cd.day}
                        type="button"
                        onClick={() => {
                          setDate(cd.name!);
                          setIsCustomCalendarOpen(false);
                        }}
                        className={`h-8 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer ${
                          isSelectedDay
                            ? 'bg-[#7FB77E] text-white shadow-xs font-black scale-105'
                            : 'bg-white hover:bg-[#7FB77E]/20 text-[#1F4E5F]'
                        }`}
                      >
                        {cd.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#1F4E5F]/10 pt-5 flex flex-col gap-3.5">
            {/* Step 3: Hora */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                  ¿A qué hora?
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#7FB77E]">{time} h</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {quickTimes.map((qt) => {
                const isSelected = time === qt.label && !isCustomTimeOpen;
                const IconComp = qt.icon;
                return (
                  <button
                    key={qt.label}
                    type="button"
                    onClick={() => {
                      setTime(qt.label);
                      setIsCustomTimeOpen(false);
                    }}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white font-black shadow-xs scale-105'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] font-bold hover:bg-[#1F4E5F]/5'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 opacity-70" />
                    <span className="text-xs">{qt.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustomTimeOpen(!isCustomTimeOpen)}
                className={`py-2.5 px-2 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] ${
                  isCustomTimeOpen
                    ? 'border-[#7FB77E] bg-[#7FB77E] text-white font-black shadow-xs scale-105'
                    : 'border-dashed border-[#1F4E5F]/30 bg-white text-[#1F4E5F] font-bold hover:bg-[#F7F7F7]'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${isCustomTimeOpen ? 'text-white' : 'opacity-70'}`} />
                <span className="text-xs whitespace-nowrap">Otra hora</span>
              </button>
            </div>

            {/* Custom Visual Digital Time Tuner */}
            {isCustomTimeOpen && (
              <div className="p-5 bg-[#F7F7F7] rounded-3xl border border-[#1F4E5F]/15 flex flex-col gap-4 animate-in fade-in zoom-in-98 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                    Configura la hora exacta
                  </span>
                  <span className="text-sm font-black bg-[#1F4E5F] text-white px-3 py-1 rounded-full">
                    {selectedHour}:{selectedMinute} h
                  </span>
                </div>

                {/* Hours Row */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Hora:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableHours.map((hr) => {
                      const isSelected = selectedHour === hr;
                      return (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => {
                            setSelectedHour(hr);
                            setTime(`${hr}:${selectedMinute}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#7FB77E] text-white font-black shadow-xs'
                              : 'bg-white text-[#1F4E5F] hover:bg-[#7FB77E]/10 border border-[#1F4E5F]/10'
                          }`}
                        >
                          {hr}:00
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minutes Row */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#1F4E5F]/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                    Minutos:
                  </span>
                  <div className="flex gap-2">
                    {availableMinutes.map((min) => {
                      const isSelected = selectedMinute === min;
                      return (
                        <button
                          key={min}
                          type="button"
                          onClick={() => {
                            setSelectedMinute(min);
                            setTime(`${selectedHour}:${min}`);
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#1F4E5F] text-white font-black shadow-xs'
                              : 'bg-white text-[#1F4E5F] hover:bg-[#1F4E5F]/10 border border-[#1F4E5F]/10'
                          }`}
                        >
                          :{min}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 📍 Island 3: Dónde Quedamos (Ciudad, Punto de Encuentro & Mapa) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                4
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Ciudad & Punto de encuentro
              </span>
            </div>
            <span className="text-xs font-extrabold text-[#7FB77E]">{selectedCity}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Field A: Ciudad */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                Ciudad o Municipio
              </label>
              <button
                type="button"
                onClick={() => setIsCityComboboxOpen(true)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 hover:border-[#7FB77E] cursor-pointer bg-[#F7F7F7] hover:bg-white flex items-center justify-between text-xs font-extrabold text-[#1F4E5F] transition-all relative text-left shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 top-3" />
                <span className="truncate">{selectedCity}</span>
                <span className="text-[10px] font-black text-[#7FB77E] uppercase tracking-wider shrink-0 bg-[#7FB77E]/10 px-2 py-0.5 rounded-full">
                  Cambiar
                </span>
              </button>
            </div>

            {/* Field B: Punto de encuentro with smart autocomplete dropdown */}
            <div ref={locationContainerRef} className="flex flex-col gap-1.5 relative">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                Punto de encuentro exacto
              </label>
              <div className="relative">
                <input
                  id="custom-location-input"
                  type="text"
                  value={location}
                  onFocus={(e) => {
                    setIsLocationDropdownOpen(true);
                    e.target.select();
                  }}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setIsLocationDropdownOpen(true);
                  }}
                  placeholder={`Parque, club deportivo o calle en ${selectedCity}`}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-white shadow-2xs"
                  autoComplete="off"
                />
                <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 top-3" />
                {location && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('');
                      setIsLocationDropdownOpen(true);
                      const inputEl = document.getElementById('custom-location-input');
                      inputEl?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2.5 top-2.5 transition-colors cursor-pointer"
                    title="Limpiar y escribir otro lugar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Floating Location Suggestions Dropdown with Live Geocoding */}
              {isLocationDropdownOpen && (() => {
                const allCityPoints = cityLocationsMap[selectedCity] ?? cityLocationsMap.Otra;
                const isExactMatch = allCityPoints.includes(location);
                const displayPoints = isExactMatch || !location.trim()
                  ? allCityPoints
                  : allCityPoints.filter((pt) => pt.toLowerCase().includes(location.toLowerCase()));

                return (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#1F4E5F]/15 shadow-xl p-2.5 z-30 max-h-72 overflow-y-auto flex flex-col gap-1.5 animate-in fade-in zoom-in-98 duration-150">
                    {/* 1. Live Geocoding Search Results (when typing query) */}
                    {liveResults.length > 0 && (
                      <div className="flex flex-col gap-1 pb-1">
                        {liveResults.map((place) => (
                          <button
                            key={`${place.name}-${place.lat}-${place.lng}`}
                            type="button"
                            onClick={() => {
                              setLocation(place.name);
                              setCustomCoords({ lat: place.lat, lng: place.lng });
                              setIsLocationDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between hover:bg-[#F7F7F7] text-[#1F4E5F]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <MapPin className="w-4 h-4 text-[#7FB77E] shrink-0" />
                              <div className="truncate">
                                <span className="text-xs font-black block truncate leading-tight">{place.name}</span>
                                <span className="text-[10px] text-[#1F4E5F]/50 block truncate">{place.address}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Searching Loader Indicator */}
                    {isSearchingPlaces && (
                      <div className="px-3 py-1.5 text-xs font-bold text-[#1F4E5F]/60 flex items-center gap-2 animate-pulse">
                        <div className="w-3 h-3 rounded-full border-2 border-[#7FB77E] border-t-transparent animate-spin" />
                        <span>Buscando en Google & OpenStreetMap...</span>
                      </div>
                    )}

                    {/* 2. Frequent Local Spots */}
                    <div className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50 flex items-center justify-between">
                      <span>Puntos frecuentes en {selectedCity}</span>
                      <span className="text-[#7FB77E] font-black">{displayPoints.length} sugeridos</span>
                    </div>

                    {displayPoints.map((pt) => {
                      const isSelected = location === pt;
                      return (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => {
                            setLocation(pt);
                            setCustomCoords(null);
                            setIsLocationDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#1F4E5F] text-white'
                              : 'hover:bg-[#F7F7F7] text-[#1F4E5F]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#7FB77E]' : 'text-[#7FB77E]'}`} />
                            <span className="truncate">{pt}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />}
                        </button>
                      );
                    })}

                    {/* Option to clear and type a new custom spot */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isExactMatch && location.trim()) {
                          setIsLocationDropdownOpen(false);
                        } else {
                          setLocation('');
                          setCustomCoords(null);
                          const inputEl = document.getElementById('custom-location-input');
                          inputEl?.focus();
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-black transition-all cursor-pointer flex items-center gap-2 bg-[#7FB77E]/10 text-[#1F4E5F] hover:bg-[#7FB77E]/20 border border-dashed border-[#7FB77E] mt-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                      <span className="truncate">
                        {location.trim() && !isExactMatch
                          ? `Usar lugar: "${location.trim()}"`
                          : 'Escribir otro lugar o dirección'}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* City Autocomplete Combobox when requested */}
          {isCityComboboxOpen && (
            <CimoCitySearchCombobox
              selectedCity={selectedCity}
              onSelectCity={(cityName) => {
                setSelectedCity(cityName);
                setIsCityComboboxOpen(false);
                setCustomCoords(null);
                const cityPoints = cityLocationsMap[cityName];
                if (cityPoints && cityPoints.length > 0) {
                  setLocation(cityPoints[0]);
                } else {
                  setLocation(`Parque Principal, ${cityName}`);
                }
              }}
              onClose={() => setIsCityComboboxOpen(false)}
            />
          )}

          {/* Real-Time Mini Map Preview Card with Custom GPS Coords support */}
          {location.trim() && (
            <CimoMapPreviewCard
              location={location}
              city={selectedCity}
              coords={customCoords}
              className="mt-1"
            />
          )}
        </div>

        {/* ⚡ Island 4: Nivel & Ritmo Deportivo (Paso 5) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
          <CimoSportPaceSelector
            sport={sport}
            selectedIndex={selectedPaceIndex}
            onSelectIndex={setSelectedPaceIndex}
            stepNumber={5}
          />
        </div>

        {/* 📝 Island 5: Instrucciones del Capitán & Material Recomendado (Paso 6) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          {/* Parte A: Instrucciones Escritas del Capitán */}
          <CimoCaptainInstructionsField
            value={instructions}
            onChange={setInstructions}
            sport={sport}
            stepNumber={6}
          />

          {/* Parte B: Material Recomendado (Checklist Amplio y Legible) */}
          <div className="border-t border-[#1F4E5F]/10 pt-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#7FB77E]" />
                <span>Material recomendado para los asistentes ({selectedSportObj.label})</span>
              </span>
              <span className="text-[11px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                Checklist
              </span>
            </div>

            <p className="text-xs text-[#1F4E5F]/70 font-medium">
              Selecciona el material esencial que los deportistas deben traer:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {getSportGear(sport).map((item) => {
                const isSelected = selectedGearIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedGearIds((prev) =>
                        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                      );
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                      isSelected
                        ? 'border-[#7FB77E] bg-[#7FB77E]/10 ring-2 ring-[#7FB77E]/20 shadow-2xs'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                          isSelected ? 'bg-[#7FB77E] text-white' : 'bg-[#1F4E5F]/10 text-[#1F4E5F]'
                        }`}
                      >
                        {item.icon === 'Footprints' ? (
                          <Footprints className="w-5 h-5" />
                        ) : item.icon === 'Droplets' ? (
                          <Droplets className="w-5 h-5" />
                        ) : item.icon === 'Apple' ? (
                          <Apple className="w-5 h-5" />
                        ) : item.icon === 'Sun' ? (
                          <Sun className="w-5 h-5" />
                        ) : item.icon === 'Activity' ? (
                          <Activity className="w-5 h-5" />
                        ) : item.icon === 'CheckCircle2' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : item.icon === 'Bike' ? (
                          <Bike className="w-5 h-5" />
                        ) : item.icon === 'ShieldCheck' ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : item.icon === 'Wrench' ? (
                          <Wrench className="w-5 h-5" />
                        ) : item.icon === 'Flame' ? (
                          <Flame className="w-5 h-5" />
                        ) : (
                          <Zap className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-black text-[#1F4E5F] block leading-snug">
                          {item.label}
                        </span>
                        <span className="text-xs text-[#1F4E5F]/70 font-medium block leading-snug mt-0.5">
                          {item.sub}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#7FB77E] text-white' : 'border-2 border-[#1F4E5F]/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 👥 Island 6: Cupo de Plazas (Paso 7) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                7
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Cupo máximo de personas
              </span>
            </div>
            <span className="text-xs font-extrabold text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full">
              {maxMembers} plazas
            </span>
          </div>

          <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-[#1F4E5F] block">
                Límite de asistentes al entreno
              </span>
              <p className="text-xs text-[#1F4E5F]/70 font-medium mt-0.5">
                Recomendamos microgrupos de 4 a 8 personas para garantizar cercanía, seguridad y buen rollo.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-[#1F4E5F]/15 shadow-2xs">
              <button
                type="button"
                disabled={maxMembers <= 2}
                onClick={() => setMaxMembers(Math.max(2, maxMembers - 1))}
                className="w-8 h-8 rounded-full bg-[#F7F7F7] hover:bg-[#1F4E5F]/10 flex items-center justify-center text-[#1F4E5F] disabled:opacity-30 cursor-pointer font-bold transition-colors"
                aria-label="Reducir plazas"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-sm font-black text-[#1F4E5F] min-w-[75px] text-center">
                {maxMembers} plazas
              </span>

              <button
                type="button"
                disabled={maxMembers >= 16}
                onClick={() => setMaxMembers(Math.min(16, maxMembers + 1))}
                className="w-8 h-8 rounded-full bg-[#F7F7F7] hover:bg-[#1F4E5F]/10 flex items-center justify-center text-[#1F4E5F] disabled:opacity-30 cursor-pointer font-bold transition-colors"
                aria-label="Aumentar plazas"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ☕ Island 7: Tercer Tiempo Post-Entreno con Búsqueda GPS (Paso 8) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                8
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Tercer Tiempo Post-Entreno
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHasThirdHalf(!hasThirdHalf)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center shrink-0 ${
                hasThirdHalf ? 'bg-[#7FB77E] justify-end' : 'bg-[#1F4E5F]/20 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {hasThirdHalf && (
            <div className="flex flex-col gap-5 animate-in fade-in zoom-in-98 duration-150">
              {/* Type selector pills */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Tipo de Tercer Tiempo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THIRD_HALF_TYPES.map((tht) => {
                    const isSelected = thirdHalfType === tht.id;
                    return (
                      <button
                        key={tht.id}
                        type="button"
                        onClick={() => {
                          setThirdHalfType(tht.id);
                          const citySpots = getThirdHalfSpots(selectedCity, tht.id);
                          if (citySpots && citySpots.length > 0) {
                            setThirdHalfVenue(citySpots[0]);
                          } else {
                            setThirdHalfVenue(tht.defaultVenue);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-[#7FB77E] bg-[#7FB77E]/10 ring-2 ring-[#7FB77E]/20 shadow-2xs'
                            : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 flex items-center justify-center text-[#1F4E5F]">
                          <tht.icon className="w-4 h-4 text-[#1F4E5F]" />
                        </div>
                        <span className="text-xs font-black">{tht.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Local / Terraza con buscador Maps GPS */}
              <div className="flex flex-col gap-1.5 relative" ref={thirdHalfContainerRef}>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Lugar o local previsto en {selectedCity}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={thirdHalfVenue}
                    onFocus={() => setIsThirdHalfDropdownOpen(true)}
                    onChange={(e) => {
                      setThirdHalfVenue(e.target.value);
                      setIsThirdHalfDropdownOpen(true);
                    }}
                    placeholder="Ej: Café Murillo, Terraza Florida Park, Honest Greens..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-black text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
                  />
                  {thirdHalfVenue && (
                    <button
                      type="button"
                      onClick={() => setThirdHalfVenue('')}
                      className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2.5 top-2.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Third Half Live Search Dropdown */}
                {isThirdHalfDropdownOpen && (() => {
                  const spots = getThirdHalfSpots(selectedCity, thirdHalfType);
                  return (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#1F4E5F]/15 shadow-xl p-2.5 z-30 max-h-60 overflow-y-auto flex flex-col gap-1.5 animate-in fade-in zoom-in-98 duration-150">
                      {liveThirdHalfResults.length > 0 && (
                        <div className="flex flex-col gap-1 pb-1">
                          {liveThirdHalfResults.map((place) => (
                            <button
                              key={`${place.name}-${place.lat}-${place.lng}`}
                              type="button"
                              onClick={() => {
                                setThirdHalfVenue(place.name);
                                setIsThirdHalfDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between hover:bg-[#F7F7F7] text-[#1F4E5F]"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <MapPin className="w-4 h-4 text-[#7FB77E] shrink-0" />
                                <div className="truncate">
                                  <span className="text-xs font-black block truncate leading-tight">{place.name}</span>
                                  <span className="text-[10px] text-[#1F4E5F]/50 block truncate">{place.address}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {isSearchingThirdHalf && (
                        <div className="px-3 py-1.5 text-xs font-bold text-[#1F4E5F]/60 flex items-center gap-2 animate-pulse">
                          <div className="w-3 h-3 rounded-full border-2 border-[#7FB77E] border-t-transparent animate-spin" />
                          <span>Buscando cafeterías y terrazas...</span>
                        </div>
                      )}

                      <div className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50">
                        Sitios recomendados en {selectedCity}
                      </div>

                      {spots.map((spot) => {
                        const isSelected = thirdHalfVenue === spot;
                        return (
                          <button
                            key={spot}
                            type="button"
                            onClick={() => {
                              setThirdHalfVenue(spot);
                              setIsThirdHalfDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected ? 'bg-[#1F4E5F] text-white' : 'hover:bg-[#F7F7F7] text-[#1F4E5F]'
                            }`}
                          >
                            <span className="truncate">{spot}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Notes Contextual with standardized '+' chips */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                    Nota breve sobre el tercer tiempo
                  </label>
                  <span className="text-[10px] font-bold text-[#1F4E5F]/40">
                    {thirdHalfNotes.length}/200
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {THIRD_HALF_NOTES_SUGGESTIONS.map((sug) => {
                    const isAdded = thirdHalfNotes.includes(sug);
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddThirdHalfChip(sug)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isAdded
                            ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] font-black shadow-2xs'
                            : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 text-[#7FB77E] stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#7FB77E]" />
                        )}
                        <span>{sug}</span>
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={thirdHalfNotes}
                  onChange={(e) => setThirdHalfNotes(e.target.value.slice(0, 200))}
                  placeholder="Ej: Nos quedaremos 30 min a desayunar, rehidratarnos y charlar."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* 🌟 Island 8: Estudio de Portada, Título & Descripción Inteligente (Paso 9 - Cierre) */}
        <div className="bg-white border-2 border-[#7FB77E]/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#7FB77E] via-[#1F4E5F] to-[#7FB77E]" />

          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                9
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]">
                Estudio de Portada, Título & Descripción Inteligente
              </span>
            </div>
            <span className="text-[11px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#7FB77E]" />
              <span>Paso Final</span>
            </span>
          </div>

          {/* 1. Título Inteligente con 3 Variantes Rápidas */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                Título de la Convocatoria
              </label>
              <button
                type="button"
                onClick={() => setTitle(titleVariants.dynamic)}
                className="text-[11px] font-black text-[#7FB77E] hover:text-[#6ea26d] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar sugerencia</span>
              </button>
            </div>

            <p className="text-xs text-[#1F4E5F]/60 font-medium">
              Hemos sintetizado 3 propuestas automáticas en base a lo que configuraste. Haz clic en una para aplicarla o escribe la tuya:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTitle(titleVariants.dynamic)}
                className={`p-3 rounded-2xl border text-left text-xs font-black transition-all cursor-pointer flex flex-col gap-1 ${
                  effectiveTitle === titleVariants.dynamic
                    ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] ring-2 ring-[#7FB77E]/30'
                    : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#7FB77E]">
                  <span>Opción Dinámica</span>
                  <Plus className="w-3 h-3 text-[#7FB77E]" />
                </div>
                <span className="line-clamp-2 leading-snug">{titleVariants.dynamic}</span>
              </button>

              <button
                type="button"
                onClick={() => setTitle(titleVariants.social)}
                className={`p-3 rounded-2xl border text-left text-xs font-black transition-all cursor-pointer flex flex-col gap-1 ${
                  effectiveTitle === titleVariants.social
                    ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] ring-2 ring-[#7FB77E]/30'
                    : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#7FB77E]">
                  <span>Opción Social</span>
                  <Plus className="w-3 h-3 text-[#7FB77E]" />
                </div>
                <span className="line-clamp-2 leading-snug">{titleVariants.social}</span>
              </button>

              <button
                type="button"
                onClick={() => setTitle(titleVariants.technical)}
                className={`p-3 rounded-2xl border text-left text-xs font-black transition-all cursor-pointer flex flex-col gap-1 ${
                  effectiveTitle === titleVariants.technical
                    ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] ring-2 ring-[#7FB77E]/30'
                    : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#7FB77E]">
                  <span>Opción Técnica</span>
                  <Plus className="w-3 h-3 text-[#7FB77E]" />
                </div>
                <span className="line-clamp-2 leading-snug">{titleVariants.technical}</span>
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={titleVariants.dynamic}
              className="w-full px-4 py-3 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-sm font-black text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs mt-1"
            />
          </div>

          {/* 2. Descripción Inteligente con Chips Estandarizados '+' */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[#1F4E5F]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                ¿De qué trata tu sesión? (Descripción Inteligente)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDescription(autoGeneratedDescription)}
                  className="text-[11px] font-black text-[#7FB77E] hover:text-[#6ea26d] flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3 text-[#7FB77E]" />
                  <span>Autogenerar</span>
                </button>
                <span className="text-[11px] font-bold text-[#1F4E5F]/40">
                  {effectiveDescription.length}/500
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
              Añade detalles con 1 clic (estandarizados con +):
            </span>

            <div className="flex flex-wrap gap-1.5">
              {(descriptionEnhancementChips[sport] ?? descriptionEnhancementChips.running).map((chip) => {
                const isAdded = description.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddDescriptionChip(chip)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAdded
                        ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] font-black shadow-2xs'
                        : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 text-[#7FB77E] stroke-[3]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#7FB77E]" />
                    )}
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              rows={3}
              placeholder={autoGeneratedDescription}
              className="w-full px-4 py-3 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs sm:text-sm font-medium text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white resize-none shadow-2xs leading-relaxed"
            />
          </div>

          {/* 3. Selector de Foto Real de Portada & Subida Personalizada */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#1F4E5F]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#7FB77E]" />
                <span>Foto Real de Portada ({selectedSportObj.label})</span>
              </label>
              <span className="text-[10px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                Fotografías Reales
              </span>
            </div>

            <p className="text-xs text-[#1F4E5F]/60 font-medium">
              Elige una fotografía de alta calidad de nuestra galería o sube tu propia imagen:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {realPhotos.map((photo) => {
                const isSelected = !isCustomImageMode && selectedCoverUrl === photo.url;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      setSelectedCoverUrl(photo.url);
                      setIsCustomImageMode(false);
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer group text-left ${
                      isSelected
                        ? 'border-[#7FB77E] ring-4 ring-[#7FB77E]/20 shadow-md scale-[1.02]'
                        : 'border-[#1F4E5F]/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-2 left-2 right-2 flex flex-col text-white">
                      <span className="text-[11px] font-black leading-tight line-clamp-1">{photo.title}</span>
                      <span className="text-[9px] text-[#7FB77E] font-bold leading-tight line-clamp-1">{photo.locationTag}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#7FB77E] text-white p-1 rounded-full shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom upload or custom URL */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isCustomImageMode && customImageUrl
                    ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F]'
                    : 'border-dashed border-[#1F4E5F]/30 hover:border-[#7FB77E] bg-[#F7F7F7] text-[#1F4E5F]'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[#7FB77E]" />
                <span>{isCustomImageMode && customImageUrl ? 'Foto subida correctamente' : 'Subir foto propia desde el dispositivo'}</span>
              </button>

              <span className="text-xs font-bold text-[#1F4E5F]/40 hidden sm:inline">o</span>

              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={isCustomImageMode ? customImageUrl : ''}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setIsCustomImageMode(Boolean(e.target.value.trim()));
                  }}
                  placeholder="Pegar URL de foto personalizada..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F4E5F]/20 text-xs font-medium text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#1F4E5F]/10">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-2xl border border-[#1F4E5F]/20 text-xs font-black text-[#1F4E5F] hover:bg-[#F7F7F7] transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#1F4E5F] hover:bg-[#163a47] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#7FB77E]" />
              <span>Publicar Convocatoria Grupal</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
