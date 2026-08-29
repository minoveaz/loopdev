import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCreatePlanViewProps {
  onBack: () => void;
  onCreate: (newPlan: Partial<ActivityCardData>) => void;
}

const sportsList = [
  { id: 'running', label: 'Running', emoji: '🏃', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200' },
  { id: 'padel', label: 'Pádel', emoji: '🎾', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200' },
  { id: 'hiking', label: 'Hiking / Trekking', emoji: '🥾', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200' },
  { id: 'crossfit', label: 'Crossfit / WOD', emoji: '🏋️', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200' },
];

const suggestedLocations = [
  'Parque del Retiro (Puerta de Alcalá)',
  'Madrid Río (Puente de Segovia)',
  'Club Tenis Chamartín',
  'Casa de Campo (Lago)',
  'Box Singular Chamberí',
  'Sierra de Guadarrama / Navacerrada',
];

const quickDates = [
  { label: 'Hoy', sub: 'Sáb 29 Ago', value: 'Hoy' },
  { label: 'Mañana', sub: 'Dom 30 Ago', value: 'Mañana' },
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

const sportPaces: Record<string, { label: string; desc: string; level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles' }[]> = {
  running: [
    { label: 'Suave (> 5:45 min/km)', desc: 'Ritmo conversacional, ideal para rodar y charlar', level: 'Principiante' },
    { label: 'Medio (5:00 - 5:30 min/km)', desc: 'Ritmo constante para corredores habituales', level: 'Intermedio' },
    { label: 'Alegre (< 4:45 min/km)', desc: 'Ritmo vivo para series o tempo run', level: 'Avanzado' },
  ],
  padel: [
    { label: 'Iniciación (Nivel 2.0 - 2.5)', desc: 'Partidos amistosos para aprender y coger confianza', level: 'Principiante' },
    { label: 'Intermedio (Nivel 3.0 - 3.5)', desc: 'Peloteo fluido, voleas y globos controlados', level: 'Intermedio' },
    { label: 'Avanzado (Nivel 4.0+)', desc: 'Partida competitiva con buena pegada y táctica', level: 'Avanzado' },
  ],
  hiking: [
    { label: 'Paseo Fácil (6 - 8 km)', desc: 'Senderismo suave por senderos llanos', level: 'Principiante' },
    { label: 'Media Montaña (10 - 14 km)', desc: 'Desnivel medio (+400m), ritmo activo', level: 'Intermedio' },
    { label: 'Alta Exigencia (+16 km)', desc: 'Cumbres y terreno técnico con buen desnivel', level: 'Avanzado' },
  ],
  crossfit: [
    { label: 'WOD Todos los Niveles', desc: 'Pesos y movimientos escalables para todos', level: 'Todos los niveles' },
    { label: 'Intermedio / RX Scaled', desc: 'Manejo de movimientos gimnásticos y barra', level: 'Intermedio' },
    { label: 'RX Competitivo', desc: 'Pesos oficiales y alta intensidad', level: 'Avanzado' },
  ],
  cycling: [
    { label: 'Rodaje Suave (22 - 25 km/h)', desc: 'Salida en grupeta para sumar kilómetros', level: 'Principiante' },
    { label: 'Ritmo Medio (26 - 29 km/h)', desc: 'Salida con algún puerto de montaña', level: 'Intermedio' },
    { label: 'Ritmo Fuerte (> 30 km/h)', desc: 'Entrenamiento rápido con relevos', level: 'Avanzado' },
  ],
};

export const CimoCreatePlanView: React.FC<CimoCreatePlanViewProps> = ({ onBack, onCreate }) => {
  const [sport, setSport] = useState('running');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Parque del Retiro (Puerta de Alcalá)');
  const [date, setDate] = useState('Hoy');
  const [time, setTime] = useState('19:30');
  const [selectedPaceIndex, setSelectedPaceIndex] = useState(1);
  const [maxMembers, setMaxMembers] = useState(5);

  // Custom Visual Pickers State
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState('Septiembre 2026');
  const [selectedHour, setSelectedHour] = useState('19');
  const [selectedMinute, setSelectedMinute] = useState('30');

  const selectedSportObj = sportsList.find((s) => s.id === sport) ?? sportsList[0];
  const activePaces = sportPaces[sport] ?? sportPaces.running;
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
      paceOrDetails: currentPace.label,
      maxMembers,
      image: selectedSportObj.image,
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
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-8 text-[#1F4E5F]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1F4E5F]/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Explorar</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-black text-[#7FB77E] uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Estudio de Capitán</span>
        </div>
      </div>

      {/* Title & Introduction */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1F4E5F] tracking-tight">
          Crea tu Entrenamiento Grupal
        </h1>
        <p className="text-xs sm:text-sm text-[#1F4E5F]/70 mt-1 font-medium">
          Configura tu Crew con controles personalizados. Los miembros podrán descubrirlo en el feed y unirse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* 1. Selector Visual de Deporte */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-2">
            <span>1. Elige el deporte</span>
          </span>
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

        {/* 2. Selector Visual de Fecha (Grid Adaptativo + Mini-Calendario Interactivo) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              2. ¿Qué día entrenamos?
            </span>
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
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth('Agosto 2026')}
                    className="p-1.5 rounded-full hover:bg-white text-[#1F4E5F] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth('Septiembre 2026')}
                    className="p-1.5 rounded-full hover:bg-white text-[#1F4E5F] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid Header */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <span key={i} className="text-[10px] font-black text-[#1F4E5F]/50 py-1">
                    {d}
                  </span>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((item, idx) => {
                  if (item.empty) {
                    return <div key={idx} className="h-9" />;
                  }
                  const isSelected = date === item.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDate(item.name!);
                        setIsCustomCalendarOpen(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black scale-105'
                          : 'bg-white hover:bg-[#00B894]/10 hover:text-[#00B894] text-[#1F4E5F] border border-[#1F4E5F]/5'
                      }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Selector Visual de Hora (Píldoras Rápidas + Selector Digital de Horas/Minutos) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              3. ¿A qué hora?
            </span>
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

            {/* 8th item: Custom Time Tuner Trigger Button */}
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

        {/* 4. Punto de Encuentro con Píldoras Sugeridas */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
            4. Punto de encuentro
          </span>

          <div className="flex flex-wrap gap-2">
            {suggestedLocations.map((loc) => {
              const isSelected = location === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#00B894] bg-[#00B894]/10 text-[#1F4E5F] font-black'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F]/80 hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
                  <span>{loc}</span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-1">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Escribe otro punto de encuentro"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-white"
            />
            <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 top-3" />
          </div>
        </div>

        {/* 5. Nivel & Ritmo Deportivo */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
            5. Nivel & Ritmo del entrenamiento
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activePaces.map((p, idx) => {
              const isSelected = selectedPaceIndex === idx;
              return (
                <div
                  key={p.label}
                  onClick={() => setSelectedPaceIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-[#1F4E5F] bg-[#1F4E5F]/5 ring-2 ring-[#1F4E5F]/20'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#1F4E5F]">{p.label}</span>
                      <span className="text-[9px] font-black uppercase text-[#7FB77E] bg-[#7FB77E]/20 px-2 py-0.5 rounded-full">
                        {p.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1F4E5F]/70 leading-relaxed font-medium">
                      {p.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#1F4E5F]/50 pt-1 border-t border-[#1F4E5F]/5">
                    <Zap className="w-3 h-3 text-[#7FB77E]" />
                    <span>Seleccionado</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Cupo Máximo con Stepper Interactivo */}
        <div className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] block">
              6. Cupo máximo de personas
            </span>
            <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
              Recomendamos microgrupos de 4 a 6 personas para garantizar cercanía y conversación.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              disabled={maxMembers <= 3}
              onClick={() => setMaxMembers((prev) => Math.max(3, prev - 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#1F4E5F]/20 flex items-center justify-center text-[#1F4E5F] hover:bg-[#1F4E5F]/5 disabled:opacity-30 cursor-pointer font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-black text-[#1F4E5F] w-20 text-center">
              {maxMembers} plazas
            </span>
            <button
              type="button"
              disabled={maxMembers >= 10}
              onClick={() => setMaxMembers((prev) => Math.min(10, prev + 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#1F4E5F]/20 flex items-center justify-center text-[#1F4E5F] hover:bg-[#1F4E5F]/5 disabled:opacity-30 cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#7FB77E]">
            <Eye className="w-4 h-4" />
            <span>Vista previa de tu tarjeta en el feed</span>
          </div>

          <div className="max-w-md bg-white rounded-3xl overflow-hidden border border-[#1F4E5F]/15 shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
              <img src={selectedSportObj.image} alt={finalTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] capitalize">
                  {sport}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#1F4E5F]/80 text-white">
                  {currentPace.level}
                </span>
              </div>
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <h3 className="font-extrabold text-sm line-clamp-1">{finalTitle}</h3>
                <div className="flex items-center gap-1 text-[11px] text-white/90 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#7FB77E]" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between text-[#1F4E5F]">
              <div className="text-xs font-bold">
                <span>{date} • {time} h</span>
              </div>
              <div className="text-xs font-extrabold text-[#00B894]">
                1/{maxMembers} plazas (Tú como Capitán)
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1F4E5F]/10">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#1F4E5F] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-full text-xs font-black bg-[#00B894] hover:bg-[#009678] text-white transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publicar Entrenamiento</span>
          </button>
        </div>
      </form>
    </div>
  );
};
