import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';

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
          <span className="w-5 h-5 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-[11px] font-black flex items-center justify-center shrink-0">
            7
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/80">
            Cupo máximo de personas
          </span>
        </div>
        <span className="text-xs font-extrabold text-[#00B894]">
          {value} plazas
        </span>
      </div>

      {/* Stepper Card */}
      <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <p className="text-xs text-[#1F4E5F]/70 font-medium leading-relaxed">
          Recomendamos microgrupos de 4 a 6 personas para garantizar cercanía y conversación.
        </p>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-[#1F4E5F]/15 shadow-2xs">
          <button
            type="button"
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="w-8 h-8 rounded-full bg-[#F7F7F7] hover:bg-[#1F4E5F]/10 flex items-center justify-center text-[#1F4E5F] disabled:opacity-30 cursor-pointer font-bold transition-colors"
            aria-label="Reducir plazas"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="text-sm font-black text-[#1F4E5F] min-w-[75px] text-center">
            {value} plazas
          </span>

          <button
            type="button"
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="w-8 h-8 rounded-full bg-[#00B894] hover:bg-[#009678] text-white flex items-center justify-center disabled:opacity-30 cursor-pointer font-bold transition-colors shadow-xs active:scale-95"
            aria-label="Aumentar plazas"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
