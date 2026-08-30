import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Eye,
  FileText,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import { CimoCitySearchCombobox } from './CimoCitySearchCombobox';
import { CimoMapPreviewCard } from './CimoMapPreviewCard';
import { CimoCaptainInstructionsField } from './CimoCaptainInstructionsField';
import { CimoSportPaceSelector, SPORT_PACES_CATALOG } from './CimoSportPaceSelector';
import { CimoCapacityStepper } from './CimoCapacityStepper';
import { useSpainLocationSearch } from '../hooks/useSpainLocationSearch';
import { CIMO_SPORTS_CATALOG } from '../data/spanishCitiesCatalog';

export interface CimoCreatePlanViewProps {
  onBack: () => void;
  onCreate: (newPlan: Partial<ActivityCardData>) => void;
}

const THIRD_HALF_TYPES = [
  { id: 'cafe' as const, label: 'Café & Desayuno', emoji: '☕', defaultVenue: 'Cafetería cercana con terraza' },
  { id: 'beer' as const, label: 'Caña & Tapeo', emoji: '🍻', defaultVenue: 'Terraza o bar del club' },
  { id: 'smoothie' as const, label: 'Smoothie Recovery', emoji: '🥤', defaultVenue: 'Juice & Recovery Bar' },
  { id: 'picnic' as const, label: 'Picnic al Aire Libre', emoji: '🌿', defaultVenue: 'Césped con sombra' },
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
  Granada: [
    'Paseo del Salón / Río Genil',
    'Parque García Lorca',
    'Pádel Club Granada',
    'Sierra Nevada / Cumbres Verdes',
  ],
  Santander: [
    'Paseo Marítimo de El Sardinero',
    'Península de La Magdalena',
    'Parque de Las Llamas',
  ],
  Alicante: [
    'Paseo de la Explanada / Puerto',
    'Playa de San Juan',
  ],
  'San Sebastián / Donostia': [
    'Paseo de La Concha',
    'Monte Urgull / Kursaal',
    'Playa de Zurriola',
  ],
  Otra: [
    'Parque Principal',
    'Polideportivo Municipal',
    'Plaza Mayor',
  ],
};

const quickDates = [
  { label: 'Hoy', sub: '29 Ago', value: 'Hoy' },
  { label: 'Mañana', sub: '30 Ago', value: 'Mañana' },
  { label: 'Lunes', sub: '31 Ago', value: 'Lunes 31 Ago' },
  { label: 'Martes', sub: '1 Sep', value: 'Martes 1 Sep' },
  { label: 'Miércoles', sub: '2 Sep', value: 'Miércoles 2 Sep' },
  { label: 'Jueves', sub: '3 Sep', value: 'Jueves 3 Sep' },
];

const quickTimes = [
  { label: '07:30', group: 'morning', icon: Sunrise },
  { label: '08:30', group: 'morning', icon: Sunrise },
  { label: '09:00', group: 'morning', icon: Sunrise },
  { label: '14:00', group: 'noon', icon: Sun },
  { label: '18:30', group: 'afternoon', icon: Sunset },
  { label: '19:00', group: 'afternoon', icon: Sunset },
  { label: '19:30', group: 'afternoon', icon: Sunset },
];

const availableHours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
const availableMinutes = ['00', '15', '30', '45'];

export const CimoCreatePlanView: React.FC<CimoCreatePlanViewProps> = ({ onBack, onCreate }) => {
  const [sport, setSport] = useState('running');
  const [selectedCity, setSelectedCity] = useState('Madrid');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Parque del Retiro (Puerta de Alcalá)');
  const [date, setDate] = useState('Hoy');
  const [time, setTime] = useState('19:30');
  const [selectedPaceIndex, setSelectedPaceIndex] = useState(1);
  const [maxMembers, setMaxMembers] = useState(5);
  const [instructions, setInstructions] = useState('');

  // Optional Third Half (Tercer Tiempo) State
  const [hasThirdHalf, setHasThirdHalf] = useState(true);
  const [thirdHalfType, setThirdHalfType] = useState<'cafe' | 'beer' | 'smoothie' | 'picnic'>('cafe');
  const [thirdHalfVenue, setThirdHalfVenue] = useState('Café Murillo (Retiro)');
  const [thirdHalfNotes, setThirdHalfNotes] = useState('Nos sentaremos 30 min a tomar un café, rehidratarnos y charlar tras el entreno.');

  // Custom Visual Pickers State
  const [isCityComboboxOpen, setIsCityComboboxOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);
  const locationContainerRef = React.useRef<HTMLDivElement>(null);

  const { results: liveResults, isLoading: isSearchingPlaces } = useSpainLocationSearch(location, selectedCity);

  // Click outside listener for location dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationContainerRef.current && !locationContainerRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [calendarMonth, setCalendarMonth] = useState('Septiembre 2026');
  const [selectedHour, setSelectedHour] = useState('19');
  const [selectedMinute, setSelectedMinute] = useState('30');

  const selectedSportObj = sportsList.find((s) => s.id === sport) ?? sportsList[0];
  const activePaces = SPORT_PACES_CATALOG[sport] ?? SPORT_PACES_CATALOG.running;
  const currentPace = activePaces[selectedPaceIndex] ?? activePaces[0];

  const finalTitle = title.trim() || `${selectedSportObj.label} en ${location.split('(')[0].trim()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({
      title: finalTitle,
      sport,
      location,
      date,
      time,
      level: currentPace.level,
      paceOrDetails: `${currentPace.title} • ${currentPace.metric}`,
      maxMembers,
      image: selectedSportObj.image,
      instructions: instructions.trim() || undefined,
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

          <div className="flex items-center gap-1.5 text-xs font-black text-[#00B894] uppercase tracking-wider bg-[#00B894]/10 px-3 py-1 rounded-full">
            <Award className="w-4 h-4" />
            <span>Estudio de Capitán</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
            Crea tu Entrenamiento Grupal
          </h1>
          <p className="text-xs sm:text-sm text-[#1F4E5F]/70 mt-1 font-medium leading-relaxed">
            Diseña tu Crew en 7 pasos guiados. Los miembros de tu ciudad podrán descubrir tu propuesta y unirse.
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
            <span className="text-xs font-black text-[#00B894] capitalize bg-[#00B894]/10 px-3 py-1 rounded-full">
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
                  <span className="text-3xl">{s.emoji}</span>
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
              <span className="text-xs font-extrabold text-[#00B894]">{date}</span>
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
                    ? 'border-[#00B894] bg-[#00B894] text-white shadow-xs scale-[1.02]'
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
                            ? 'bg-[#00B894] text-white shadow-xs font-black scale-105'
                            : 'bg-white hover:bg-[#00B894]/20 text-[#1F4E5F]'
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
              <span className="text-xs font-extrabold text-[#00B894]">{time} h</span>
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
                    ? 'border-[#00B894] bg-[#00B894] text-white font-black shadow-xs scale-105'
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
                              ? 'bg-[#00B894] text-white font-black shadow-xs'
                              : 'bg-white text-[#1F4E5F] hover:bg-[#00B894]/10 border border-[#1F4E5F]/10'
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
            <span className="text-xs font-extrabold text-[#00B894]">{selectedCity}</span>
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
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 hover:border-[#00B894] cursor-pointer bg-[#F7F7F7] hover:bg-white flex items-center justify-between text-xs font-extrabold text-[#1F4E5F] transition-all relative text-left shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#00B894] absolute left-3 top-3" />
                <span className="truncate">{selectedCity}</span>
                <span className="text-[10px] font-black text-[#00B894] uppercase tracking-wider shrink-0 bg-[#00B894]/10 px-2 py-0.5 rounded-full">
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
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-white shadow-2xs"
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
                              <MapPin className="w-4 h-4 text-[#00B894] shrink-0" />
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
                        <div className="w-3 h-3 rounded-full border-2 border-[#00B894] border-t-transparent animate-spin" />
                        <span>Buscando en Google & OpenStreetMap...</span>
                      </div>
                    )}

                    {/* 2. Frequent Local Spots */}
                    <div className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50 flex items-center justify-between">
                      <span>Puntos frecuentes en {selectedCity}</span>
                      <span className="text-[#00B894] font-black">{displayPoints.length} sugeridos</span>
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
                            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00B894]' : 'text-[#7FB77E]'}`} />
                            <span className="truncate">{pt}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00B894] shrink-0" />}
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
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-black transition-all cursor-pointer flex items-center gap-2 bg-[#00B894]/10 text-[#1F4E5F] hover:bg-[#00B894]/20 border border-dashed border-[#00B894] mt-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
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

        {/* ⚡ Island 4: Nivel & Ritmo Deportivo */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
          <CimoSportPaceSelector
            sport={sport}
            selectedIndex={selectedPaceIndex}
            onSelectIndex={setSelectedPaceIndex}
          />
        </div>

        {/* 📝 Island 5: Instrucciones del Capitán */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
          <CimoCaptainInstructionsField
            value={instructions}
            onChange={setInstructions}
            sport={sport}
          />
        </div>

        {/* 👥 Island 6: Cupo de Plazas */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
          <CimoCapacityStepper
            value={maxMembers}
            onChange={setMaxMembers}
          />
        </div>

        {/* ☕ Island 7: Tercer Tiempo Post-Entreno (Opcional) */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
                7
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
                Tercer Tiempo Post-Entreno
              </span>
            </div>
            <span className="text-xs font-black text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full">
              Opcional
            </span>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-[#1F4E5F] block">
                  ¿Habrá plan social tras el entreno?
                </span>
                <span className="text-[11px] text-[#1F4E5F]/70 font-medium">
                  {hasThirdHalf
                    ? '¡Genial! Añade el local o plan para tomar algo y charlar juntos.'
                    : 'Entrenamiento puro 100% deportivo (sin sobremesa posterior).'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasThirdHalf(!hasThirdHalf)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center shrink-0 ${
                hasThirdHalf ? 'bg-[#00B894] justify-end' : 'bg-[#1F4E5F]/20 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {hasThirdHalf && (
            <div className="flex flex-col gap-4 pt-2 animate-in fade-in zoom-in-98 duration-150">
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
                          if (!thirdHalfVenue || thirdHalfVenue === 'Cafetería cercana con terraza') {
                            setThirdHalfVenue(tht.defaultVenue);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-[#00B894] bg-[#00B894]/10 ring-2 ring-[#00B894]/20 shadow-2xs'
                            : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                        }`}
                      >
                        <span className="text-xl">{tht.emoji}</span>
                        <span className="text-xs font-black">{tht.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Venue / Local */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Nombre del local, cafetería o punto social
                </label>
                <input
                  type="text"
                  value={thirdHalfVenue}
                  onChange={(e) => setThirdHalfVenue(e.target.value)}
                  placeholder="Ej: Café Murillo, Terraza Club Chamartín, Raw Bar..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Nota breve sobre el tercer tiempo
                </label>
                <input
                  type="text"
                  value={thirdHalfNotes}
                  onChange={(e) => setThirdHalfNotes(e.target.value)}
                  placeholder="Ej: Nos quedaremos 30 min a desayunar, rehidratarnos y charlar."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* 🌟 Island 8: Vista Previa en Vivo & Publicación */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#00B894]">
              <Eye className="w-4 h-4" />
              <span>Vista previa en vivo de tu tarjeta en el feed</span>
            </div>
            <span className="text-[10px] font-bold text-[#1F4E5F]/50 hidden sm:inline-block">
              Así lo descubrirán los demás deportistas
            </span>
          </div>

          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl overflow-hidden border border-[#1F4E5F]/15 shadow-md hover:shadow-lg transition-all">
            {/* Image Header with Gradient & Tags */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
              <img src={selectedSportObj.image} alt={finalTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/95 via-[#1F4E5F]/30 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] capitalize shadow-xs">
                    {sport}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#00B894] text-white shadow-xs">
                    {currentPace.title} • {currentPace.metric}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#1F4E5F]/80 text-white backdrop-blur-xs">
                    {currentPace.level}
                  </span>
                </div>
              </div>

              {/* Bottom Card Title & Location */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <h3 className="font-black text-base sm:text-lg leading-tight line-clamp-1 drop-shadow-xs">
                  {finalTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
                  <span className="truncate">{location} ({selectedCity})</span>
                </div>
              </div>
            </div>

            {/* Content & Details Footer */}
            <div className="p-4 flex flex-col gap-3">
              {/* Optional Captain Instructions Preview */}
              {instructions.trim() && (
                <div className="p-2.5 bg-[#00B894]/10 border border-[#00B894]/20 rounded-xl text-xs text-[#1F4E5F] font-bold flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00B894] shrink-0 mt-0.5" />
                  <p className="line-clamp-2">
                    <span className="font-black">Capitán: </span>"{instructions.trim()}"
                  </p>
                </div>
              )}

              {/* Optional Third Half Preview */}
              {hasThirdHalf && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 font-bold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-base">
                      {THIRD_HALF_TYPES.find((t) => t.id === thirdHalfType)?.emoji ?? '☕'}
                    </span>
                    <span className="truncate">
                      <strong>Tercer Tiempo:</strong> {thirdHalfVenue || 'Cafetería cercana'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                    Social
                  </span>
                </div>
              )}

              {/* Date, Time and Crew Spot Counters */}
              <div className="flex items-center justify-between text-xs text-[#1F4E5F] pt-1">
                <div className="flex items-center gap-2 font-black">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F7F7] border border-[#1F4E5F]/10">
                    📅 {date}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F7F7] border border-[#1F4E5F]/10">
                    ⏰ {time} h
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1F4E5F] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    AR
                  </div>
                  <span className="text-xs font-black text-[#00B894]">
                    1/{maxMembers} plazas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F4E5F]/10">
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
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publicar Entrenamiento</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
