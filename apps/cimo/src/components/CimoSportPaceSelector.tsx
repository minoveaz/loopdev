import React from 'react';
import { Check, Timer } from 'lucide-react';
import { getSportPaces, SPORT_PACES_CATALOG, type SportPaceOption } from '../data/sportsCatalog';

export { SPORT_PACES_CATALOG, type SportPaceOption };

export interface CimoSportPaceSelectorProps {
  sport: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  stepNumber?: string | number;
  className?: string;
}

export const CimoSportPaceSelector: React.FC<CimoSportPaceSelectorProps> = ({
  sport,
  selectedIndex,
  onSelectIndex,
  stepNumber = 2,
  className = '',
}) => {
  const activePaces = getSportPaces(sport);
  const currentPace = activePaces[selectedIndex] ?? activePaces[0];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[11px] font-black flex items-center justify-center shrink-0">
            {stepNumber}
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80">
            Ritmo y nivel del grupo
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#7FB77E]">{currentPace.level}</span>
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
                  ? 'border-[#7FB77E] bg-[#7FB77E]/10 ring-2 ring-[#7FB77E]/30 shadow-sm'
                  : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white hover:border-[#1F4E5F]/30'
              }`}
            >
              <div className="flex flex-col gap-2 w-full">
                {/* Top Row: Title + Metric + Radio Check */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-sm font-black leading-tight block ${isSelected ? 'text-[#1F4E5F]' : 'text-[#1F4E5F]/90'}`}
                    >
                      {p.title}
                    </span>
                    <span className="text-xs font-black text-[#7FB77E] flex items-center gap-1 mt-0.5">
                      <Timer className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.metric}</span>
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                      isSelected
                        ? 'bg-[#7FB77E] text-white shadow-xs'
                        : 'border-2 border-[#1F4E5F]/20 group-hover:border-[#1F4E5F]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border w-fit ${levelBadgeStyle}`}
                >
                  {p.level}
                </span>
              </div>

              <p className="text-[11px] text-[#1F4E5F]/70 leading-relaxed font-medium">{p.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
