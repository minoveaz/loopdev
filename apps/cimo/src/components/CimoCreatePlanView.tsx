import React, { useState } from 'react';
import { ArrowLeft, Award, Calendar, Check, Clock, MapPin, Plus, Sparkles, Users, Zap } from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCreatePlanViewProps {
  onBack: () => void;
  onCreate: (newPlan: Partial<ActivityCardData>) => void;
}

const sportsList = [
  { id: 'running', label: 'Running', emoji: '🏃', placeholder: 'Ej: Rodaje 8K suave por Madrid Río', defaultPace: '8 km • 5:20 min/km' },
  { id: 'padel', label: 'Pádel', emoji: '🎾', placeholder: 'Ej: Partido Pádel Mixto Nivel 3.5', defaultPace: 'Pista reservada 1h 30m • Nivel 3.5' },
  { id: 'hiking', label: 'Hiking / Trekking', emoji: '🥾', placeholder: 'Ej: Ruta La Pedriza & Canto Cochino', defaultPace: '12 km • Desnivel +450m' },
  { id: 'crossfit', label: 'Crossfit / WOD', emoji: '🏋️', placeholder: 'Ej: WOD en Parejas & Mobility', defaultPace: 'WOD escalable • Todos los niveles' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴', placeholder: 'Ej: Salida Carretera 40K', defaultPace: '40 km • Ritmo 26-28 km/h' },
];

export const CimoCreatePlanView: React.FC<CimoCreatePlanViewProps> = ({ onBack, onCreate }) => {
  const [sport, setSport] = useState('running');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Parque del Retiro, Madrid');
  const [date, setDate] = useState('Hoy');
  const [time, setTime] = useState('19:30');
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles'>('Intermedio');
  const [paceOrDetails, setPaceOrDetails] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSportObj = sportsList.find((s) => s.id === sport) ?? sportsList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const finalTitle = title.trim() || selectedSportObj.placeholder.replace('Ej: ', '');
    if (!location.trim()) newErrors.location = 'Indica el punto de encuentro.';
    if (!time.trim()) newErrors.time = 'Indica la hora del entreno.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate({
      title: finalTitle,
      sport,
      location,
      date,
      time,
      level,
      paceOrDetails: paceOrDetails.trim() || selectedSportObj.defaultPace,
      maxMembers,
      image:
        sport === 'running'
          ? 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200'
          : sport === 'padel'
          ? 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200'
          : sport === 'hiking'
          ? 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200'
          : 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    });
  };

  return (
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-[#1F4E5F]">
      {/* Header */}
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
          <span>Panel de Capitán</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4E5F]">Publica tu Entrenamiento</h1>
        <p className="text-xs text-[#1F4E5F]/70 mt-1">
          Crea tu Crew deportivo. Los demás deportistas podrán ver los detalles y unirse a tu entrenamiento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step 1: Sport Selection */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
            1. Selecciona el deporte
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {sportsList.map((s) => {
              const isSelected = sport === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSport(s.id);
                    if (!paceOrDetails) setPaceOrDetails(s.defaultPace);
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white shadow-xs scale-[1.02]'
                      : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-extrabold">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Title & Meeting Point */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F]">
              Título del entrenamiento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={selectedSportObj.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F] flex items-center justify-between">
              <span>Punto de encuentro</span>
              {errors.location && <span className="text-[10px] text-red-500 font-bold">{errors.location}</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Puerta de Alcalá (Retiro)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none"
              />
              <MapPin className="w-4 h-4 text-[#7FB77E] absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Step 3: Date, Time, Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F]">Cuándo</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#1F4E5F]/20 text-xs font-bold text-[#1F4E5F] bg-white outline-none"
            >
              <option value="Hoy">Hoy</option>
              <option value="Mañana">Mañana</option>
              <option value="Este Sábado">Este Sábado</option>
              <option value="Este Domingo">Este Domingo</option>
              <option value="Próxima semana">Próxima semana</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F] flex items-center justify-between">
              <span>Hora</span>
              {errors.time && <span className="text-[10px] text-red-500 font-bold">{errors.time}</span>}
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="19:30"
              className="w-full px-3 py-2.5 rounded-xl border border-[#1F4E5F]/20 text-xs font-bold text-[#1F4E5F] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F]">Nivel requerido</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles')}
              className="w-full px-3 py-2.5 rounded-xl border border-[#1F4E5F]/20 text-xs font-bold text-[#1F4E5F] bg-white outline-none"
            >
              <option value="Todos los niveles">Todos los niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Step 4: Pace & Max Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F]">
              Ritmo / Detalles técnicos
            </label>
            <input
              type="text"
              value={paceOrDetails}
              onChange={(e) => setPaceOrDetails(e.target.value)}
              placeholder={selectedSportObj.defaultPace}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 text-xs font-bold text-[#1F4E5F] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#1F4E5F]">
              Cupo máximo de personas ({maxMembers} plazas)
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[4, 5, 6, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxMembers(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    maxMembers === num
                      ? 'bg-[#1F4E5F] text-white shadow-xs'
                      : 'bg-[#F7F7F7] text-[#1F4E5F] hover:bg-[#1F4E5F]/10'
                  }`}
                >
                  {num} plazas
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#1F4E5F]/10 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#1F4E5F] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#00B894] hover:bg-[#009678] text-white transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publicar Entrenamiento</span>
          </button>
        </div>
      </form>
    </div>
  );
};
