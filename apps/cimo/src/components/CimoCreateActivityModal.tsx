import React, { useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
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
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div
        className="animate-in zoom-in-95 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#1F4E5F]/15 bg-white text-[#1F4E5F] shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F4E5F]/10 bg-[#F7F7F7] px-6 py-4">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E]">
              Crear Nuevo Plan
            </span>
            <h2 className="text-base font-extrabold text-[#1F4E5F]">Publica tu entrenamiento</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de creación"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#1F4E5F]/10 bg-white transition-colors hover:bg-[#1F4E5F]/5"
          >
            <X className="h-4 w-4 text-[#1F4E5F]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto p-6">
          {/* Sport Selector */}
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70">
              Deporte
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {sportsOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSport(s.id)}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-bold transition-all ${
                    sport === s.id
                      ? 'shadow-xs bg-[#1F4E5F] text-white'
                      : 'border border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5'
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  <span className="truncate text-[10px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor="create-plan-title"
              className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
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
              className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
            />
          </div>

          {/* Location Input */}
          <div>
            <label
              htmlFor="create-plan-location"
              className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
            >
              Punto de encuentro y Zona
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F4E5F]/40" />
              <input
                id="create-plan-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Puente de Toledo, Madrid Río"
                className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] py-2.5 pl-10 pr-3.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-plan-day"
                className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
              >
                Día
              </label>
              <select
                id="create-plan-day"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
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
                className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
              >
                Hora de inicio
              </label>
              <input
                id="create-plan-time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="19:30"
                className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
              />
            </div>
          </div>

          {/* Level & Max Members */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-plan-level"
                className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
              >
                Nivel
              </label>
              <select
                id="create-plan-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
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
                className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
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
                className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
              />
            </div>
          </div>

          {/* Pace details */}
          <div>
            <label
              htmlFor="create-plan-pace"
              className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
            >
              Ritmo o detalles adicionales (opcional)
            </label>
            <input
              id="create-plan-pace"
              type="text"
              value={paceOrDetails}
              onChange={(e) => setPaceOrDetails(e.target.value)}
              placeholder="Ej: 10 km • Ritmo 5:15 min/km • Tomamos algo después"
              className="min-h-[40px] w-full rounded-xl border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3.5 py-2.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="active:scale-98 mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#1F4E5F] px-4 py-3.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#183e4c]"
          >
            <Plus className="h-4 w-4 text-[#7FB77E]" />
            <span>Publicar Plan en CIMO</span>
          </button>
        </form>
      </div>
    </div>
  );
};
