import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  ChevronDown,
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
  { label: 'Viernes', sub: '4 Sep', value: 'Viernes 4 Sep' },
];

const quickTimes = [
  { label: '07:30', group: 'morning', icon: Sunrise },
  { label: '08:30', group: 'morning', icon: Sunrise },
  { label: '09:00', group: 'morning', icon: Sunrise },
  { label: '14:00', group: 'noon', icon: Sun },
  { label: '18:30', group: 'afternoon', icon: Sunset },
  { label: '19:00', group: 'afternoon', icon: Sunset },
  { label: '19:30', group: 'afternoon', icon: Sunset },
  { label: '20:00', group: 'afternoon', icon: Sunset },
];

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
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

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

        {/* 2. Selector de Fecha (Grid Adaptativo sin scroll horizontal) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              2. ¿Qué día entrenamos?
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#00B894]">{date}</span>
              <button
                type="button"
                onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                className="px-2.5 py-1 rounded-full border border-dashed border-[#1F4E5F]/30 bg-white text-[#1F4E5F] hover:bg-[#F7F7F7] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              >
                <Calendar className="w-3 h-3 text-[#7FB77E]" />
                <span>{showCustomCalendar ? 'Cerrar calendario' : 'Otro día'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {quickDates.map((qd) => {
              const isSelected = date === qd.value;
              return (
                <button
                  key={qd.value}
                  type="button"
                  onClick={() => {
                    setDate(qd.value);
                    setShowCustomCalendar(false);
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
          </div>

          {/* Custom Date Input when requested */}
          {showCustomCalendar && (
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10 flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1F4E5F]" />
                <label className="text-xs font-extrabold text-[#1F4E5F]">Selecciona la fecha exacta en el calendario:</label>
              </div>
              <input
                type="date"
                onChange={(e) => {
                  if (e.target.value) {
                    const d = new Date(e.target.value);
                    setDate(d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }));
                  }
                }}
                className="px-3.5 py-2 bg-white border border-[#1F4E5F]/20 rounded-xl text-xs font-bold text-[#1F4E5F] outline-none"
              />
            </div>
          )}
        </div>

        {/* 3. Selector Visual de Hora */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              3. ¿A qué hora?
            </span>
            <span className="text-xs font-extrabold text-[#00B894]">{time} h</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {quickTimes.map((qt) => {
              const isSelected = time === qt.label;
              const IconComp = qt.icon;
              return (
                <button
                  key={qt.label}
                  type="button"
                  onClick={() => setTime(qt.label)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white font-black shadow-2xs scale-105'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] font-bold hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <IconComp className="w-3 h-3 opacity-70" />
                  <span className="text-xs">{qt.label}</span>
                </button>
              );
            })}
          </div>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#00B894] bg-[#00B894]/10 text-[#1F4E5F] font-black'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F]/80 hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-[#7FB77E]" />
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
              placeholder="O escribe otro punto de encuentro..."
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
