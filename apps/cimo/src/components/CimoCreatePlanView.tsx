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
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
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
import { CimoLivePlanPreviewWidget } from './CimoLivePlanPreviewWidget';
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

export const TennisBallIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M4.5 7.5C8.8 8.5 12.5 12.2 13.5 19.5" />
    <path d="M19.5 16.5C15.2 15.5 11.5 11.8 10.5 4.5" />
  </svg>
);

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

  // Final Step 5: Title, Smart Description & Real Photo Cover State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);
  const [isDescriptionManuallyEdited, setIsDescriptionManuallyEdited] = useState(false);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isCustomImageMode, setIsCustomImageMode] = useState(false);

  // Custom Visual Pickers State
  const [isCityComboboxOpen, setIsCityComboboxOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [customThirdHalfCoords, setCustomThirdHalfCoords] = useState<{ lat: number; lng: number } | null>(null);

  const locationContainerRef = useRef<HTMLDivElement>(null);
  const thirdHalfContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-generate comprehensive smart description synthesizing all user choices in friendly language
  const autoGeneratedDescription = useMemo(() => {
    const sportName = selectedSportObj.label;
    const loc = cleanLocationName || location.split('(')[0].trim() || 'el punto de encuentro';
    const paceStr = `${currentPace.title} (${currentPace.metric})`;

    // 1. Warm & friendly intro
    let text = `¡Nos vamos a entrenar! Quedamos en ${loc} (${selectedCity}) para hacer ${sportName} juntos. Será una sesión de nivel ${paceStr}, ideal para compartir entreno en un grupo de hasta ${maxMembers} personas.`;

    // 2. Schedule
    const dateFormatted = date.toLowerCase() === 'hoy'
      ? 'hoy'
      : date.toLowerCase() === 'mañana'
      ? 'mañana'
      : date.toLowerCase().startsWith('este') || date.toLowerCase().startsWith('próx')
      ? date.toLowerCase()
      : `el ${date}`;
    text += ` Nos vemos ${dateFormatted} a las ${time}h en punto.`;

    // 3. Captain Instructions if provided
    if (instructions.trim()) {
      text += ` 📋 Consejos del Capitán: ${instructions.trim().replace(/\.$/, '')}.`;
    }

    // 4. Gear items
    const gearItems = getSportGear(sport).filter((g) => selectedGearIds.includes(g.id));
    if (gearItems.length > 0) {
      const gearList = gearItems.map((g) => g.label.toLowerCase()).join(', ');
      text += ` 🎒 Qué traer: ${gearList}.`;
    }

    // 5. Friendly Third Half
    if (hasThirdHalf) {
      const thTypeObj = THIRD_HALF_TYPES.find((t) => t.id === thirdHalfType);
      const thLabel = thTypeObj?.label ?? 'Tercer Tiempo';
      const venueName = thirdHalfVenue.split('(')[0].trim() || 'una terraza cercana';
      text += ` ☕ Y al terminar... ¡Tercer Tiempo! Nos tomaremos algo (${thLabel}) en ${venueName}`;
      if (thirdHalfNotes.trim()) {
        text += ` (${thirdHalfNotes.trim().replace(/\.$/, '')})`;
      }
      text += `.`;
    }

    text += ` ¡Anímate y súmate al Crew!`;

    return text;
  }, [
    selectedSportObj,
    cleanLocationName,
    location,
    selectedCity,
    maxMembers,
    currentPace,
    date,
    time,
    instructions,
    selectedGearIds,
    hasThirdHalf,
    thirdHalfType,
    thirdHalfVenue,
    thirdHalfNotes,
    sport,
  ]);

  // Effective title and image
  const effectiveTitle = isTitleManuallyEdited ? title : (title.trim() || titleVariants.dynamic);
  const effectiveDescription = isDescriptionManuallyEdited ? description : autoGeneratedDescription;
  const effectiveImage = isCustomImageMode && customImageUrl ? customImageUrl : (selectedCoverUrl || realPhotos[0]?.url || selectedSportObj.image);

  // Auto-resize description textarea to fit text perfectly without clipping
  useEffect(() => {
    if (descriptionTextareaRef.current) {
      descriptionTextareaRef.current.style.height = 'auto';
      descriptionTextareaRef.current.style.height = `${Math.max(140, descriptionTextareaRef.current.scrollHeight + 8)}px`;
    }
  }, [effectiveDescription]);

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
        instructions,
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
    instructions,
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
    const current = isDescriptionManuallyEdited ? description : autoGeneratedDescription;
    if (current.includes(chipText)) {
      const cleaned = current
        .replace(new RegExp(`\\.?\\s*${chipText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.?`, 'g'), '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*\.\s*/, '')
        .trim();
      setDescription(cleaned);
      setIsDescriptionManuallyEdited(true);
    } else {
      const updated = current.trim() ? `${current.trim()}. ${chipText}` : chipText;
      setDescription(updated.slice(0, 600));
      setIsDescriptionManuallyEdited(true);
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
      setThirdHalfNotes(updated.slice(0, 300));
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
    { day: 1, name: 'Mar 1 Sep', dateStr: 'Mar 1 Sep' },
    { day: 2, name: 'Mié 2 Sep', dateStr: 'Mié 2 Sep' },
    { day: 3, name: 'Jue 3 Sep', dateStr: 'Jue 3 Sep' },
    { day: 4, name: 'Vie 4 Sep', dateStr: 'Vie 4 Sep' },
    { day: 5, name: 'Sáb 5 Sep', dateStr: 'Sáb 5 Sep' },
    { day: 6, name: 'Dom 6 Sep', dateStr: 'Dom 6 Sep' },
    { day: 7, name: 'Lun 7 Sep', dateStr: 'Lun 7 Sep' },
    { day: 8, name: 'Mar 8 Sep', dateStr: 'Mar 8 Sep' },
    { day: 9, name: 'Mié 9 Sep', dateStr: 'Mié 9 Sep' },
    { day: 10, name: 'Jue 10 Sep', dateStr: 'Jue 10 Sep' },
    { day: 11, name: 'Vie 11 Sep', dateStr: 'Vie 11 Sep' },
    { day: 12, name: 'Sáb 12 Sep', dateStr: 'Sáb 12 Sep' },
    { day: 13, name: 'Dom 13 Sep', dateStr: 'Dom 13 Sep' },
    { day: 14, name: 'Lun 14 Sep', dateStr: 'Lun 14 Sep' },
    { day: 15, name: 'Mar 15 Sep', dateStr: 'Mar 15 Sep' },
    { day: 16, name: 'Mié 16 Sep', dateStr: 'Mié 16 Sep' },
    { day: 17, name: 'Jue 17 Sep', dateStr: 'Jue 17 Sep' },
    { day: 18, name: 'Vie 18 Sep', dateStr: 'Vie 18 Sep' },
    { day: 19, name: 'Sáb 19 Sep', dateStr: 'Sáb 19 Sep' },
    { day: 20, name: 'Dom 20 Sep', dateStr: 'Dom 20 Sep' },
    { day: 21, name: 'Lun 21 Sep', dateStr: 'Lun 21 Sep' },
    { day: 22, name: 'Mar 22 Sep', dateStr: 'Mar 22 Sep' },
    { day: 23, name: 'Mié 23 Sep', dateStr: 'Mié 23 Sep' },
    { day: 24, name: 'Jue 24 Sep', dateStr: 'Jue 24 Sep' },
    { day: 25, name: 'Vie 25 Sep', dateStr: 'Vie 25 Sep' },
    { day: 26, name: 'Sáb 26 Sep', dateStr: 'Sáb 26 Sep' },
    { day: 27, name: 'Dom 27 Sep', dateStr: 'Dom 27 Sep' },
    { day: 28, name: 'Lun 28 Sep', dateStr: 'Lun 28 Sep' },
    { day: 29, name: 'Mar 29 Sep', dateStr: 'Mar 29 Sep' },
    { day: 30, name: 'Mié 30 Sep', dateStr: 'Mié 30 Sep' },
  ];

  return (
    <div className="flex flex-col gap-8 text-[#1F4E5F] w-full max-w-4xl mx-auto pb-20 min-w-0 animate-in fade-in duration-200">
      {/* 🧭 Top Navigation Header */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col gap-4">
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
          <p className="text-xs sm:text-sm text-[#1F4E5F]/70 mt-1.5 font-medium leading-relaxed">
            Monta tu quedada en 5 pasos sencillos: elige deporte, cuándo y dónde, qué traer, si os tomáis algo después y listo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-10">
        {/* ========================================================================= */}
        {/* 🟢 BLOQUE 1: DEPORTE, NIVEL Y PLAZAS                                      */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col gap-7 sm:gap-8">
          <div className="flex flex-col gap-2.5 pb-3.5 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                1
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1F4E5F]">
                ¿Qué deporte practicamos?
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap pl-9.5">
              <span className="text-xs text-[#1F4E5F]/60 font-medium">
                Configura el deporte, ritmo sugerido y tamaño del grupo
              </span>
              <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full shrink-0">
                {selectedSportObj.label} • {maxMembers} plazas
              </span>
            </div>
          </div>

          {/* 1.1 Deporte */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  1.1
                </span>
                <span>Elige el deporte</span>
              </span>
              <span className="text-xs font-bold text-[#7FB77E] capitalize">
                {sport}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {sportsList.map((s) => {
                const isSelected = sport === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSport(s.id);
                      setSelectedPaceIndex(1);
                      setIsCustomImageMode(false);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-md scale-[1.02]'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-white hover:border-[#1F4E5F]/25 shadow-2xs'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-[#7FB77E]/15 text-[#1F4E5F]'}`}>
                      {s.id === 'hiking' ? (
                        <Footprints className="w-6 h-6" />
                      ) : s.id === 'padel' ? (
                        <TennisBallIcon className="w-6 h-6" />
                      ) : (
                        <Flame className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black">{s.label}</span>
                      <span className={`text-[11px] font-medium mt-0.5 line-clamp-1 ${isSelected ? 'text-white/90' : 'text-[#1F4E5F]/60'}`}>
                        {s.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1.2 Nivel & Ritmo */}
          <div className="pt-6 sm:pt-7 border-t border-[#1F4E5F]/10">
            <CimoSportPaceSelector
              sport={sport}
              selectedIndex={selectedPaceIndex}
              onSelectIndex={setSelectedPaceIndex}
              stepNumber="1.2"
            />
          </div>

          {/* 1.3 Cupo de Plazas */}
          <div className="pt-6 sm:pt-7 border-t border-[#1F4E5F]/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  1.3
                </span>
                <span>¿Cuántas personas como máximo?</span>
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-[#1F4E5F] block">
                  Límite de asistentes al entreno
                </span>
                <p className="text-xs text-[#1F4E5F]/70 font-medium mt-0.5 max-w-md">
                  Recomendamos grupitos de 4 a 8 personas para asegurar buen ambiente, cercanía y que nadie se quede atrás.
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-center gap-3 w-full sm:w-auto sm:min-w-[200px] bg-white px-4 py-2 rounded-2xl border border-[#1F4E5F]/15 shadow-2xs">
                <button
                  type="button"
                  disabled={maxMembers <= 2}
                  onClick={() => setMaxMembers(Math.max(2, maxMembers - 1))}
                  className="w-9 h-9 rounded-xl bg-[#F7F7F7] hover:bg-[#7FB77E]/20 flex items-center justify-center text-[#1F4E5F] disabled:opacity-30 cursor-pointer font-bold transition-colors active:scale-95 shrink-0"
                  aria-label="Reducir plazas"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center px-3 flex-1 sm:flex-initial sm:min-w-[95px]">
                  <span className="text-sm sm:text-base font-black text-[#1F4E5F] text-center leading-none">
                    {maxMembers} plazas
                  </span>
                  <span className="text-[9px] font-black text-[#7FB77E] uppercase tracking-wider mt-0.5">
                    {maxMembers <= 4 ? 'Íntimo' : maxMembers <= 8 ? 'Óptimo' : 'Amplio'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={maxMembers >= 16}
                  onClick={() => setMaxMembers(Math.min(16, maxMembers + 1))}
                  className="w-9 h-9 rounded-xl bg-[#F7F7F7] hover:bg-[#7FB77E]/20 flex items-center justify-center text-[#1F4E5F] disabled:opacity-30 cursor-pointer font-bold transition-colors active:scale-95 shrink-0"
                  aria-label="Aumentar plazas"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🟢 BLOQUE 2: CUÁNDO Y DÓNDE QUEDAMOS                                      */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col gap-7 sm:gap-8">
          <div className="flex flex-col gap-2.5 pb-3.5 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                2
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1F4E5F]">
                ¿Cuándo y dónde quedamos?
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap pl-9.5">
              <span className="text-xs text-[#1F4E5F]/60 font-medium">
                Fecha, horario y punto de encuentro con GPS
              </span>
              <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full shrink-0">
                {date} a las {time}h
              </span>
            </div>
          </div>

          {/* 2.1 Fecha */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  2.1
                </span>
                <span>¿Qué día entrenamos?</span>
              </span>
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
                        ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-xs scale-[1.02]'
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

              <button
                type="button"
                onClick={() => setIsCustomCalendarOpen(!isCustomCalendarOpen)}
                className={`col-span-2 sm:col-span-2 lg:col-span-1 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-0.5 ${
                  isCustomCalendarOpen
                    ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-xs scale-[1.01]'
                    : 'border-dashed border-[#1F4E5F]/30 bg-white text-[#1F4E5F] hover:bg-[#F7F7F7]'
                }`}
              >
                <Calendar className={`w-4 h-4 shrink-0 ${isCustomCalendarOpen ? 'text-white' : 'text-[#7FB77E]'}`} />
                <div className="flex items-center gap-1.5 lg:flex-col lg:gap-0">
                  <span className="text-xs font-black leading-tight">Otro día</span>
                  <span className={`text-[10px] font-bold ${isCustomCalendarOpen ? 'text-white/80' : 'text-[#1F4E5F]/50'}`}>
                    Calendario
                  </span>
                </div>
              </button>
            </div>

            {isCustomCalendarOpen && (
              <div className="p-4 sm:p-5 bg-[#F7F7F7] rounded-3xl border border-[#1F4E5F]/15 flex flex-col gap-3 animate-in fade-in zoom-in-98 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                    {calendarMonth}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 rounded-xl hover:bg-white text-[#1F4E5F] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-xl hover:bg-white text-[#1F4E5F] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                    <span key={day} className="text-[10px] font-black text-[#1F4E5F]/40 py-1">
                      {day}
                    </span>
                  ))}
                  {calendarDays.map((cd, index) => {
                    if (cd.empty) {
                      return <div key={`empty-${index}`} className="p-2" />;
                    }
                    const isSelected = date === cd.dateStr;
                    return (
                      <button
                        key={cd.dateStr || `day-${index}`}
                        type="button"
                        onClick={() => {
                          if (cd.dateStr) setDate(cd.dateStr);
                        }}
                        className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isSelected ? 'bg-[#7FB77E] text-white shadow-xs' : 'hover:bg-white text-[#1F4E5F]'
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

          {/* 2.2 Hora */}
          <div className="border-t border-[#1F4E5F]/10 pt-6 sm:pt-7 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  2.2
                </span>
                <span>¿A qué hora nos vemos?</span>
              </span>
              <span className="text-xs font-extrabold text-[#7FB77E]">{time}h</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {quickTimes.map((qt) => {
                const isSelected = time === qt.value && !isCustomTimeOpen;
                return (
                  <button
                    key={qt.value}
                    type="button"
                    onClick={() => {
                      setTime(qt.value);
                      setIsCustomTimeOpen(false);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-xs scale-[1.02]'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {qt.period === 'Mañana' ? (
                        <Sunrise className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#7FB77E]'}`} />
                      ) : (
                        <Sunset className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#7FB77E]'}`} />
                      )}
                      <span className="text-xs font-black">{qt.label}</span>
                    </div>
                    <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#1F4E5F]/50'}`}>
                      {qt.period}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustomTimeOpen(!isCustomTimeOpen)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isCustomTimeOpen
                    ? 'border-[#7FB77E] bg-[#7FB77E] text-white shadow-xs scale-[1.02]'
                    : 'border-dashed border-[#1F4E5F]/30 bg-white text-[#1F4E5F] hover:bg-[#F7F7F7]'
                }`}
              >
                <Clock className={`w-4 h-4 mb-0.5 ${isCustomTimeOpen ? 'text-white' : 'text-[#7FB77E]'}`} />
                <span className="text-xs font-black leading-tight">Otra hora</span>
                <span className={`text-[9px] font-bold mt-0.5 ${isCustomTimeOpen ? 'text-white/80' : 'text-[#1F4E5F]/50'}`}>
                  Manual
                </span>
              </button>
            </div>

            {isCustomTimeOpen && (
              <div className="p-5 bg-[#F7F7F7] rounded-3xl border border-[#1F4E5F]/15 flex flex-col gap-4 animate-in fade-in zoom-in-98 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                    Configura la hora exacta
                  </span>
                  <span className="text-sm font-black bg-[#7FB77E] text-white px-3 py-1 rounded-full">
                    {selectedHour}:{selectedMinute} h
                  </span>
                </div>

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
                              ? 'bg-[#7FB77E] text-white font-black shadow-xs'
                              : 'bg-white text-[#1F4E5F] hover:bg-[#7FB77E]/10 border border-[#1F4E5F]/10'
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

          {/* 2.3 Ciudad & Punto de Encuentro */}
          <div className="border-t border-[#1F4E5F]/10 pt-6 sm:pt-7 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  2.3
                </span>
                <span>Ciudad y punto de encuentro</span>
              </span>
              <span className="text-xs font-extrabold text-[#7FB77E]">{selectedCity}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                  Ciudad o Municipio
                </label>
                <button
                  type="button"
                  onClick={() => setIsCityComboboxOpen(true)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 hover:border-[#7FB77E] cursor-pointer bg-[#F7F7F7] hover:bg-white flex items-center justify-between text-xs font-extrabold text-[#1F4E5F] transition-all relative text-left shadow-2xs"
                >
                  <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3" />
                  <span className="truncate">{selectedCity}</span>
                  <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.5 rounded-full shrink-0">
                    Cambiar
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5 relative" ref={locationContainerRef}>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                  Punto o Lugar de encuentro
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 pointer-events-none" />
                  <input
                    id="custom-location-input"
                    type="text"
                    value={location}
                    onFocus={() => setIsLocationDropdownOpen(true)}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setIsLocationDropdownOpen(true);
                    }}
                    placeholder="Ej: Estatua del Ángel Caído (Retiro)"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-black text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
                  />
                  {location && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocation('');
                        setCustomCoords(null);
                      }}
                      className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2.5 top-2.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isLocationDropdownOpen && (() => {
                  const allCityPoints = cityLocationsMap[selectedCity] ?? cityLocationsMap.Otra;
                  const isExactMatch = allCityPoints.includes(location);
                  const displayPoints = isExactMatch || !location.trim()
                    ? allCityPoints
                    : allCityPoints.filter((pt) => pt.toLowerCase().includes(location.toLowerCase()));

                  return (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#1F4E5F]/15 shadow-xl p-2.5 z-30 max-h-72 overflow-y-auto flex flex-col gap-1.5 animate-in fade-in zoom-in-98 duration-150">
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

                      {isSearchingPlaces && (
                        <div className="px-3 py-1.5 text-xs font-bold text-[#1F4E5F]/60 flex items-center gap-2 animate-pulse">
                          <div className="w-3 h-3 rounded-full border-2 border-[#7FB77E] border-t-transparent animate-spin" />
                          <span>Buscando en Google & OpenStreetMap...</span>
                        </div>
                      )}

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
                              isSelected ? 'bg-[#7FB77E] text-white' : 'hover:bg-[#F7F7F7] text-[#1F4E5F]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#7FB77E]'} shrink-0`} />
                              <span className="truncate">{pt}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

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

            {location.trim() && (
              <CimoMapPreviewCard
                location={location}
                city={selectedCity}
                coords={customCoords}
                className="mt-1"
              />
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🟢 BLOQUE 3: CONSEJOS DEL CAPITÁN Y QUÉ LLEVAR                            */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col gap-7 sm:gap-8">
          <div className="flex flex-col gap-2.5 pb-3.5 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                3
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1F4E5F]">
                Consejos del Capitán y qué llevar
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap pl-9.5">
              <span className="text-xs text-[#1F4E5F]/60 font-medium">
                Instrucciones de ruta y checklist de equipamiento
              </span>
              <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full shrink-0">
                {selectedGearIds.length} recomendados
              </span>
            </div>
          </div>

          {/* 3.1 Instrucciones Escritas */}
          <CimoCaptainInstructionsField
            value={instructions}
            onChange={setInstructions}
            sport={sport}
            stepNumber="3.1"
          />

          {/* 3.2 Material Recomendado */}
          <div className="border-t border-[#1F4E5F]/10 pt-6 sm:pt-7 flex flex-col gap-3.5 sm:gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
                  3.2
                </span>
                <ShoppingBag className="w-4 h-4 text-[#7FB77E]" />
                <span>¿Qué material deben traer? ({selectedSportObj.label})</span>
              </span>
              <span className="text-[11px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                Checklist
              </span>
            </div>

            <p className="text-xs text-[#1F4E5F]/70 font-medium">
              Marca el equipamiento recomendado para los asistentes:
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

        {/* ========================================================================= */}
        {/* 🔵 BLOQUE 4: TERCER TIEMPO SOCIAL                                         */}
        {/* ========================================================================= */}
        <div className="border-2 border-[#1F4E5F]/30 bg-gradient-to-br from-[#1F4E5F]/10 via-white to-[#1F4E5F]/5 rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col gap-7 sm:gap-8 text-[#1F4E5F]">
          <div className="flex flex-col gap-3 pb-3.5 border-b border-[#1F4E5F]/15">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#1F4E5F] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                4
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1F4E5F]">
                Tercer Tiempo Social
              </h3>
            </div>

            <div className="flex items-center justify-between gap-3 pl-9.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#1F4E5F] bg-[#1F4E5F]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#1F4E5F] shrink-0" />
                  <span>{hasThirdHalf ? 'Activado • Tomar algo post-entreno' : 'Opcional (Desactivado)'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-[#1F4E5F]/70 hidden sm:inline">
                  {hasThirdHalf ? 'Incluir en el plan' : 'Desactivado'}
                </span>
                <button
                  type="button"
                  onClick={() => setHasThirdHalf(!hasThirdHalf)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center shrink-0 ${
                    hasThirdHalf ? 'bg-[#1F4E5F] justify-end' : 'bg-[#1F4E5F]/20 justify-start'
                  }`}
                  aria-label="Activar o desactivar tercer tiempo"
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-black text-[#1F4E5F] block">
              ¿Nos tomamos algo después de entrenar?
            </span>
            <p className="text-xs text-[#1F4E5F]/75 font-medium mt-0.5 leading-relaxed">
              El post-entreno perfecto para charlar, reponer fuerzas y conocer a los demás miembros del grupo.
            </p>
          </div>

          {hasThirdHalf && (
            <div className="flex flex-col gap-6 pt-1 animate-in fade-in zoom-in-98 duration-150">
              {/* Type selector pills */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/80">
                  4.1 ¿Qué os apetece tomar?
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
                            ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white ring-2 ring-[#1F4E5F]/30 shadow-2xs scale-[1.02]'
                            : 'border-[#1F4E5F]/15 bg-white hover:bg-[#1F4E5F]/5 text-[#1F4E5F]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-[#1F4E5F]/10 text-[#1F4E5F]'}`}>
                          <tht.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">{tht.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4.2 Ciudad & Local / Terraza con buscador Maps GPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/80">
                    Ciudad o Municipio
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCityComboboxOpen(true)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 hover:border-[#1F4E5F] cursor-pointer bg-white flex items-center justify-between text-xs font-extrabold text-[#1F4E5F] transition-all relative text-left shadow-2xs"
                  >
                    <MapPin className="w-4 h-4 text-[#1F4E5F] absolute left-3" />
                    <span className="truncate">{selectedCity}</span>
                    <span className="text-[10px] font-black text-[#1F4E5F] bg-[#1F4E5F]/10 px-2 py-0.5 rounded-full shrink-0">
                      Cambiar
                    </span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 relative" ref={thirdHalfContainerRef}>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/80">
                    4.2 Lugar o local previsto en {selectedCity}
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-[#1F4E5F] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={thirdHalfVenue}
                      onFocus={() => setIsThirdHalfDropdownOpen(true)}
                      onChange={(e) => {
                        setThirdHalfVenue(e.target.value);
                        setIsThirdHalfDropdownOpen(true);
                      }}
                      placeholder="Ej: Café Murillo, Terraza Florida Park, Honest Greens..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#1F4E5F]/25 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/20 text-xs font-black text-[#1F4E5F] outline-none bg-white shadow-2xs"
                    />
                    {thirdHalfVenue && (
                      <button
                        type="button"
                        onClick={() => {
                          setThirdHalfVenue('');
                          setCustomThirdHalfCoords(null);
                        }}
                        className="p-1 rounded-full hover:bg-[#1F4E5F]/10 text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2.5 top-2.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isThirdHalfDropdownOpen && (() => {
                    const spots = getThirdHalfSpots(selectedCity, thirdHalfType);
                    return (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#1F4E5F]/20 shadow-xl p-2.5 z-30 max-h-60 overflow-y-auto flex flex-col gap-1.5 animate-in fade-in zoom-in-98 duration-150">
                        {liveThirdHalfResults.length > 0 && (
                          <div className="flex flex-col gap-1 pb-1">
                            {liveThirdHalfResults.map((place) => (
                              <button
                                key={`${place.name}-${place.lat}-${place.lng}`}
                                type="button"
                                onClick={() => {
                                  setThirdHalfVenue(place.name);
                                  setCustomThirdHalfCoords({ lat: place.lat, lng: place.lng });
                                  setIsThirdHalfDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between hover:bg-[#1F4E5F]/5 text-[#1F4E5F]"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <MapPin className="w-4 h-4 text-[#1F4E5F] shrink-0" />
                                  <div className="truncate">
                                    <span className="text-xs font-black block truncate leading-tight">{place.name}</span>
                                    <span className="text-[10px] text-[#1F4E5F]/50 block truncate">{place.address}</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
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
                                setCustomThirdHalfCoords(null);
                                setIsThirdHalfDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                                isSelected ? 'bg-[#1F4E5F] text-white' : 'hover:bg-[#1F4E5F]/5 text-[#1F4E5F]'
                              }`}
                            >
                              <span className="truncate">{spot}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Contextual Suggestion Pills for Current City */}
                  {(() => {
                    const cityPointSuggestions = [
                      { label: `Café Central, ${selectedCity}`, coords: { lat: 40.4168, lng: -3.7038 } },
                      { label: `Terraza Plaza Mayor, ${selectedCity}`, coords: { lat: 40.4154, lng: -3.7074 } },
                      { label: `Cervecería del Parque, ${selectedCity}`, coords: { lat: 40.418, lng: -3.682 } },
                    ];

                    return (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-[#1F4E5F]/60 self-center mr-0.5">
                          Sugerencias en {selectedCity}:
                        </span>
                        {cityPointSuggestions.map((venue) => {
                          const isSelected = thirdHalfVenue === venue.label;
                          return (
                            <button
                              key={venue.label}
                              type="button"
                              onClick={() => {
                                setThirdHalfVenue(venue.label);
                                setCustomThirdHalfCoords(venue.coords);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#1F4E5F] text-white border-[#1F4E5F] shadow-2xs'
                                  : 'bg-[#F7F7F7] hover:bg-white text-[#1F4E5F] border-[#1F4E5F]/15 shadow-2xs'
                              }`}
                            >
                              <Plus className="w-3 h-3 text-[#1F4E5F]" />
                              <span>{venue.label.split(',')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Notes Contextual with standardized '+' chips */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/80">
                    4.3 Notas o detalles del tercer tiempo
                  </label>
                  <span className="text-[10px] font-bold text-[#1F4E5F]/60">
                    {thirdHalfNotes.length}/300
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Pediremos ronda de cervezas / refrescos',
                    'Terraza reservada para el grupo',
                    'Tomaremos café de especialidad y charlaremos',
                    'Smoothies y batidos de proteínas',
                    'Picoteo informal de tapas',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setThirdHalfNotes(chip)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        thirdHalfNotes === chip
                          ? 'bg-[#1F4E5F] text-white border-[#1F4E5F] shadow-2xs'
                          : 'bg-[#F7F7F7] hover:bg-white text-[#1F4E5F] border-[#1F4E5F]/15 shadow-2xs'
                      }`}
                    >
                      <Plus className="w-3 h-3 text-[#1F4E5F]" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={thirdHalfNotes}
                  onChange={(e) => setThirdHalfNotes(e.target.value)}
                  placeholder="Escribe detalles del tercer tiempo: duración aproximada, tipo de consumición, reserva de mesa o terraza, buen rollo post-entreno..."
                  className="w-full p-4 rounded-2xl border border-[#1F4E5F]/25 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/20 text-xs sm:text-sm font-medium text-[#1F4E5F] outline-none bg-white shadow-2xs resize-none leading-relaxed transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ✨ BLOQUE 5: DALE EL TOQUE FINAL Y PUBLICA                                 */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-[#7FB77E]/40 rounded-3xl p-6 sm:p-9 shadow-sm flex flex-col gap-7 sm:gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#7FB77E] via-[#1F4E5F] to-[#7FB77E]" />

          <div className="flex flex-col gap-2.5 pb-3.5 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                5
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1F4E5F]">
                Dale el toque final y publica
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap pl-9.5">
              <span className="text-xs text-[#1F4E5F]/60 font-medium">
                Revisa el título, descripción y foto de portada antes de lanzar
              </span>
              <span className="text-[11px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E]" />
                <span>Paso Final</span>
              </span>
            </div>
          </div>

          {/* 5.1 Título Inteligente con 3 Variantes Rápidas */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                5.1 Ponle un buen título a tu plan
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsTitleManuallyEdited(false);
                  setTitle('');
                }}
                className="text-[11px] font-black text-[#7FB77E] hover:text-[#6ea26d] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar sugerencia</span>
              </button>
            </div>

            <p className="text-xs text-[#1F4E5F]/60 font-medium">
              Hemos pensado 3 opciones automáticas con tus datos. Elige una con 1 clic o escribe la tuya:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTitle(titleVariants.dynamic);
                  setIsTitleManuallyEdited(true);
                }}
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
                onClick={() => {
                  setTitle(titleVariants.social);
                  setIsTitleManuallyEdited(true);
                }}
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
                onClick={() => {
                  setTitle(titleVariants.technical);
                  setIsTitleManuallyEdited(true);
                }}
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
              value={effectiveTitle}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsTitleManuallyEdited(true);
              }}
              placeholder={titleVariants.dynamic}
              className="w-full px-4 py-3 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-sm font-black text-[#1F4E5F] outline-none bg-white shadow-2xs mt-1"
            />
          </div>

          {/* 5.2 Descripción Inteligente con Chips Estandarizados '+' */}
          <div className="flex flex-col gap-2.5 pt-6 sm:pt-7 border-t border-[#1F4E5F]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                  5.2 Resumen de lo que vais a hacer
                </label>
                <span className="text-[10px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#7FB77E]" />
                  <span>Generado con tus datos</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDescriptionManuallyEdited(false);
                    setDescription('');
                  }}
                  className="text-[11px] font-black text-[#7FB77E] hover:text-[#6ea26d] flex items-center gap-1 cursor-pointer"
                  title="Restaurar el texto recopilado automáticamente a partir de todos tus campos"
                >
                  <RefreshCw className="w-3 h-3 text-[#7FB77E]" />
                  <span>Regenerar con mis datos</span>
                </button>
                <span className="text-[11px] font-bold text-[#1F4E5F]/40">
                  {effectiveDescription.length}/600
                </span>
              </div>
            </div>

            <p className="text-xs text-[#1F4E5F]/60 font-medium">
              Hemos redactado este resumen con todo lo que has rellenado. ¡Léelo, cámbiale lo que quieras o acéptalo tal cual!
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(descriptionEnhancementChips[sport] ?? descriptionEnhancementChips.running).map((chip) => {
                const isAdded = (isDescriptionManuallyEdited ? description : autoGeneratedDescription).includes(chip);
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
              ref={descriptionTextareaRef}
              value={effectiveDescription}
              onChange={(e) => {
                setDescription(e.target.value.slice(0, 600));
                setIsDescriptionManuallyEdited(true);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.max(140, e.target.scrollHeight + 8)}px`;
              }}
              maxLength={600}
              placeholder="Descripción completa de tu convocatoria deportiva..."
              className="w-full p-4.5 sm:p-5 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs sm:text-sm font-medium text-[#1F4E5F] outline-none bg-white shadow-2xs resize-none leading-relaxed transition-all min-h-[140px]"
            />
          </div>

          {/* 5.3 Selector de Foto Real de Portada & Subida Personalizada */}
          <div className="flex flex-col gap-3 pt-6 sm:pt-7 border-t border-[#1F4E5F]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#7FB77E]" />
                <span>5.3 Elige la foto de portada ({selectedSportObj.label})</span>
              </label>
              <span className="text-[10px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                Fotografías Reales
              </span>
            </div>

            <p className="text-xs text-[#1F4E5F]/60 font-medium">
              Elige una foto chula para tu convocatoria o sube una propia:
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

          {/* Action Buttons: 1st Publicar, 2nd Cancelar on the same row */}
          <div className="flex items-center gap-2.5 sm:gap-4 pt-6 sm:pt-8 border-t border-[#1F4E5F]/10 w-full">
            <button
              type="submit"
              className="flex-1 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-[#7FB77E] hover:bg-[#6ea26d] text-white font-black text-xs sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center min-h-[46px] sm:min-h-[52px]"
            >
              <Send className="w-4 h-4 text-white shrink-0" />
              <span className="hidden sm:inline">Publicar Convocatoria Grupal</span>
              <span className="sm:hidden">Publicar Convocatoria</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-4 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-[#1F4E5F]/20 text-xs sm:text-sm font-black text-[#1F4E5F] hover:bg-[#F7F7F7] transition-all cursor-pointer text-center shrink-0 min-h-[46px] sm:min-h-[52px] flex items-center justify-center"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* 📱 Mobile Floating Preview Trigger (lg:hidden) */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 lg:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={() => setIsMobilePreviewOpen(true)}
          aria-label="Abrir vista previa del plan"
          className="px-4 py-2.5 bg-[#1F4E5F] hover:bg-[#163a47] text-white rounded-full font-black text-xs shadow-2xl flex items-center gap-2 border border-white/20 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <Smartphone className="w-4 h-4 text-[#7FB77E]" />
          <span>Ver Preview</span>
        </button>
      </div>

      {/* 📱 Mobile Bottom Sheet Modal (lg:hidden) */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FCFDFD] rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl border-t border-[#1F4E5F]/15 animate-in slide-in-from-bottom duration-250">
            {/* Header / Grab Handle */}
            <div className="p-4 border-b border-[#1F4E5F]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#7FB77E]" />
                <span className="text-xs font-black uppercase text-[#1F4E5F] tracking-wider">
                  Live Preview & Co-Piloto
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                aria-label="Cerrar vista previa móvil"
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content: Live Preview Widget */}
            <div className="p-4 overflow-y-auto">
              <CimoLivePlanPreviewWidget
                formData={{
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
                  instructions,
                }}
                currentUser={currentUser ?? { name: 'Capitán' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
