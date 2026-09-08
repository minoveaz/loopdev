import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface CimoCapacityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const CimoCapacityStepper: React.FC<CimoCapacityStepperProps> = ({
  value,
  onChange,
  min = 3,
  max = 12,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Unified Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1F4E5F]/10 text-[11px] font-black text-[#1F4E5F]">
            7
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80">
            Cupo máximo de personas
          </span>
        </div>
        <span className="text-xs font-extrabold text-[#7FB77E]">{value} plazas</span>
      </div>

      {/* Stepper Card */}
      <div className="shadow-2xs flex flex-col justify-between gap-3 rounded-2xl border border-[#1F4E5F]/15 bg-[#F7F7F7] p-4 sm:flex-row sm:items-center">
        <p className="text-xs font-medium leading-relaxed text-[#1F4E5F]/70">
          Recomendamos microgrupos de 4 a 6 personas para garantizar cercanía y conversación.
        </p>

        <div className="shadow-2xs flex shrink-0 items-center gap-3 self-start rounded-full border border-[#1F4E5F]/15 bg-white px-3 py-1.5 sm:self-auto">
          <button
            type="button"
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F7F7F7] font-bold text-[#1F4E5F] transition-colors hover:bg-[#1F4E5F]/10 disabled:opacity-30"
            aria-label="Reducir plazas"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="min-w-[75px] text-center text-sm font-black text-[#1F4E5F]">
            {value} plazas
          </span>

          <button
            type="button"
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="shadow-xs flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#7FB77E] font-bold text-white transition-colors hover:bg-[#6ea26d] active:scale-95 disabled:opacity-30"
            aria-label="Aumentar plazas"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
