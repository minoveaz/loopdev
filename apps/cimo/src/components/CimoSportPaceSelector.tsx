import React from 'react';
import { Check, Timer } from 'lucide-react';

export interface SportPaceOption {
  title: string;
  metric: string;
  label: string;
  desc: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
}

export const SPORT_PACES_CATALOG: Record<string, SportPaceOption[]> = {
  running: [
    { title: 'Suave', metric: '+5:45 min/km', label: 'Suave (+5:45 min/km)', desc: 'Ritmo conversacional, ideal para rodar y charlar', level: 'Principiante' },
    { title: 'Medio', metric: '5:00 - 5:30 min/km', label: 'Medio (5:00 - 5:30 min/km)', desc: 'Ritmo constante para corredores habituales', level: 'Intermedio' },
    { title: 'Alegre', metric: 'Sub 4:45 min/km', label: 'Alegre (Sub 4:45 min/km)', desc: 'Ritmo vivo para series o tempo run', level: 'Avanzado' },
  ],
  padel: [
    { title: 'Iniciación', metric: 'Nivel 2.0 - 2.5', label: 'Iniciación (Nivel 2.0 - 2.5)', desc: 'Partidos amistosos para aprender y coger confianza', level: 'Principiante' },
    { title: 'Intermedio', metric: 'Nivel 3.0 - 3.5', label: 'Intermedio (Nivel 3.0 - 3.5)', desc: 'Peloteo fluido, voleas y globos controlados', level: 'Intermedio' },
    { title: 'Avanzado', metric: 'Nivel 4.0+', label: 'Avanzado (Nivel 4.0+)', desc: 'Partida competitiva con buena pegada y táctica', level: 'Avanzado' },
  ],
  hiking: [
    { title: 'Paseo Fácil', metric: '6 - 8 km', label: 'Paseo Fácil (6 - 8 km)', desc: 'Senderismo suave por senderos llanos', level: 'Principiante' },
    { title: 'Media Montaña', metric: '10 - 14 km (+400m)', label: 'Media Montaña (10 - 14 km)', desc: 'Desnivel medio (+400m), ritmo activo', level: 'Intermedio' },
    { title: 'Alta Exigencia', metric: '+16 km (Técnico)', label: 'Alta Exigencia (+16 km)', desc: 'Cumbres y terreno técnico con buen desnivel', level: 'Avanzado' },
  ],
  crossfit: [
    { title: 'WOD Escalable', metric: 'Todos los pesos', label: 'WOD Todos los Niveles', desc: 'Pesos y movimientos escalables para todos', level: 'Todos los niveles' },
    { title: 'RX Scaled', metric: 'Gimnásticos + Barra', label: 'Intermedio / RX Scaled', desc: 'Manejo de movimientos gimnásticos y barra', level: 'Intermedio' },
    { title: 'RX Competitivo', metric: 'Pesos oficiales', label: 'RX Competitivo', desc: 'Pesos oficiales y alta intensidad', level: 'Avanzado' },
  ],
  cycling: [
    { title: 'Rodaje Suave', metric: '22 - 25 km/h', label: 'Rodaje Suave (22 - 25 km/h)', desc: 'Salida en grupeta para sumar kilómetros', level: 'Principiante' },
    { title: 'Ritmo Medio', metric: '26 - 29 km/h', label: 'Ritmo Medio (26 - 29 km/h)', desc: 'Salida con algún puerto de montaña', level: 'Intermedio' },
    { title: 'Ritmo Fuerte', metric: '> 30 km/h', label: 'Ritmo Fuerte (> 30 km/h)', desc: 'Entrenamiento rápido con relevos', level: 'Avanzado' },
  ],
};

export interface CimoSportPaceSelectorProps {
  sport: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
}

export const CimoSportPaceSelector: React.FC<CimoSportPaceSelectorProps> = ({
  sport,
  selectedIndex,
  onSelectIndex,
  className = '',
}) => {
  const activePaces = SPORT_PACES_CATALOG[sport] ?? SPORT_PACES_CATALOG.running;
  const currentPace = activePaces[selectedIndex] ?? activePaces[0];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-[11px] font-black flex items-center justify-center shrink-0">
            5
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80">
            Nivel & Ritmo del entrenamiento
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#00B894]">
          {currentPace.level}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {activePaces.map((p, idx) => {
          const isSelected = selectedIndex === idx;

          // Color-coded difficulty badges
          const levelBadgeStyle =
            p.level === 'Principiante'
              ? 'bg-[#7FB77E]/15 text-[#2E7D32] border-[#7FB77E]/30'
              : p.level === 'Intermedio'
              ? 'bg-[#1F4E5F]/10 text-[#1F4E5F] border-[#1F4E5F]/20'
              : p.level === 'Avanzado'
              ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';

          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                isSelected
                  ? 'border-[#00B894] bg-white ring-2 ring-[#00B894]/20 shadow-sm'
                  : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white hover:border-[#1F4E5F]/30'
              }`}
            >
              <div className="flex flex-col gap-2 w-full">
                {/* Top Row: Title + Metric + Radio Check */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-sm font-black leading-tight block ${isSelected ? 'text-[#1F4E5F]' : 'text-[#1F4E5F]/90'}`}>
                      {p.title}
                    </span>
                    <span className="text-xs font-black text-[#00B894] flex items-center gap-1 mt-0.5">
                      <Timer className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.metric}</span>
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                      isSelected
                        ? 'bg-[#00B894] text-white shadow-xs'
                        : 'border-2 border-[#1F4E5F]/20 group-hover:border-[#1F4E5F]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border w-fit ${levelBadgeStyle}`}>
                  {p.level}
                </span>
              </div>

              <p className="text-[11px] text-[#1F4E5F]/70 leading-relaxed font-medium">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
