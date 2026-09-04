import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Sparkles, Users, X } from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newActivity: Partial<ActivityCardData>) => void;
}

const sportsOptions = [
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'padel', label: 'Pádel', emoji: '🎾' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'crossfit', label: 'Crossfit', emoji: '🏋️' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴' },
];

const levelsOptions: Array<'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles'> = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Todos los niveles',
];

export const CimoCreateActivityModal: React.FC<CimoCreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [sport, setSport] = useState('running');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Hoy');
  const [time, setTime] = useState('19:00');
  const [level, setLevel] = useState<
    'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles'
  >('Intermedio');
  const [paceOrDetails, setPaceOrDetails] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    onCreate({
      sport,
      title: title.trim(),
      location: location.trim(),
      date,
      time,
      level,
      paceOrDetails: paceOrDetails.trim() || undefined,
      maxMembers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-[#1F4E5F]/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#1F4E5F] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1F4E5F]/10 flex items-center justify-between bg-[#F7F7F7]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E] block">
              Crear Nuevo Plan
            </span>
            <h2 className="text-base font-extrabold text-[#1F4E5F]">Publica tu entrenamiento</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de creación"
            className="w-8 h-8 rounded-full bg-white border border-[#1F4E5F]/10 flex items-center justify-center hover:bg-[#1F4E5F]/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#1F4E5F]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {/* Sport Selector */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1.5">
              Deporte
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {sportsOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSport(s.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    sport === s.id
                      ? 'bg-[#1F4E5F] text-white shadow-xs'
                      : 'bg-[#F7F7F7] border border-[#1F4E5F]/10 text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  <span className="text-[10px] truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor="create-plan-title"
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
            >
              Título del entreno
            </label>
            <input
              id="create-plan-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Rodaje 10K suave por Madrid Río"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
            />
          </div>

          {/* Location Input */}
          <div>
            <label
              htmlFor="create-plan-location"
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
            >
              Punto de encuentro y Zona
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#1F4E5F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="create-plan-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Puente de Toledo, Madrid Río"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-plan-day"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
              >
                Día
              </label>
              <select
                id="create-plan-day"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
              >
                <option value="Hoy">Hoy</option>
                <option value="Mañana">Mañana</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
                <option value="Próxima semana">Próxima semana</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="create-plan-time"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
              >
                Hora de inicio
              </label>
              <input
                id="create-plan-time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="19:30"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
              />
            </div>
          </div>

          {/* Level & Max Members */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-plan-level"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
              >
                Nivel
              </label>
              <select
                id="create-plan-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
              >
                {levelsOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="create-plan-max-members"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
              >
                Cupo (4-8 personas)
              </label>
              <input
                id="create-plan-max-members"
                type="number"
                min={2}
                max={12}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
              />
            </div>
          </div>

          {/* Pace details */}
          <div>
            <label
              htmlFor="create-plan-pace"
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70 block mb-1"
            >
              Ritmo o detalles adicionales (opcional)
            </label>
            <input
              id="create-plan-pace"
              type="text"
              value={paceOrDetails}
              onChange={(e) => setPaceOrDetails(e.target.value)}
              placeholder="Ej: 10 km • Ritmo 5:15 min/km • Tomamos algo después"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB77E] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 text-xs font-extrabold text-white bg-[#1F4E5F] hover:bg-[#183e4c] rounded-2xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#7FB77E]" />
            <span>Publicar Plan en CIMO</span>
          </button>
        </form>
      </div>
    </div>
  );
};
