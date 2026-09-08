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
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[11px] font-black text-[#7FB77E]">
            {stepNumber}
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80">
            Ritmo y nivel del grupo
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#7FB77E]">{currentPace.level}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              className={`group relative flex cursor-pointer flex-col justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-[#7FB77E] bg-[#7FB77E]/10 shadow-sm ring-2 ring-[#7FB77E]/30'
                  : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:border-[#1F4E5F]/30 hover:bg-white'
              }`}
            >
              <div className="flex w-full flex-col gap-2">
                {/* Top Row: Title + Metric + Radio Check */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`block text-sm font-black leading-tight ${isSelected ? 'text-[#1F4E5F]' : 'text-[#1F4E5F]/90'}`}
                    >
                      {p.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs font-black text-[#7FB77E]">
                      <Timer className="h-3.5 w-3.5 shrink-0" />
                      <span>{p.metric}</span>
                    </span>
                  </div>

                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'shadow-xs bg-[#7FB77E] text-white'
                        : 'border-2 border-[#1F4E5F]/20 group-hover:border-[#1F4E5F]/40'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <span
                  className={`w-fit rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${levelBadgeStyle}`}
                >
                  {p.level}
                </span>
              </div>

              <p className="text-[11px] font-medium leading-relaxed text-[#1F4E5F]/70">{p.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
