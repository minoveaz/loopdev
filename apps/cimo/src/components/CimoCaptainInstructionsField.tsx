import React from 'react';
import { AlertCircle, FileText, Plus, Sparkles } from 'lucide-react';

export interface CimoCaptainInstructionsFieldProps {
  value: string;
  onChange: (val: string) => void;
  sport?: string;
  className?: string;
}

const quickChipsBySport: Record<string, string[]> = {
  running: ['💧 Traer agua', '⏰ Llegar 5 min antes', '👟 Calzado de asfalto/trail', '🧘 Estiramientos al terminar'],
  padel: ['🎾 Traer pala propia', '🪙 Pista a medias (3€ aprox)', '⏰ Estar en recepción 10 min antes', '🎾 Bolas nuevas'],
  hiking: ['🥾 Calzado de montaña', '💧 Mínimo 1.5L de agua', '🧥 Cortavientos / Abrigo', '🥪 Snack / Fruta'],
  crossfit: ['💧 Botella de agua y toalla', '⏰ Calentamiento previo 10 min', '🏋️ Magnesio'],
  cycling: ['⛑️ Casco obligatorio', '🔧 Kit de pinchazos y bomba', '💧 2 bidones de agua', '💡 Luces delantera/trasera'],
};

export const CimoCaptainInstructionsField: React.FC<CimoCaptainInstructionsFieldProps> = ({
  value,
  onChange,
  sport = 'running',
  className = '',
}) => {
  const chips = quickChipsBySport[sport] ?? quickChipsBySport.running;

  const handleAddChip = (chip: string) => {
    if (value.includes(chip)) return;
    const cleanChip = chip.replace(/^[^\w\s]+/u, '').trim(); // Strip emoji for cleaner text append or keep emoji
    const updated = value.trim() ? `${value.trim()}. ${chip}` : chip;
    onChange(updated);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#00B894]" />
          <span>Instrucciones adicionales del Capitán (Opcional)</span>
        </span>
        <span className="text-[10px] font-bold text-[#1F4E5F]/50">
          {value.length}/300 caracteres
        </span>
      </div>

      {/* Suggested Quick Chips */}
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const isAdded = value.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => handleAddChip(c)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isAdded
                  ? 'border-[#00B894] bg-[#00B894]/10 text-[#1F4E5F] font-black opacity-60'
                  : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
              }`}
            >
              <Plus className="w-3 h-3 text-[#00B894]" />
              <span>{c}</span>
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          maxLength={300}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe recomendaciones para el Crew: punto exacto de encuentro, qué llevar, coste compartido de pistas..."
          className="w-full p-3.5 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-white shadow-2xs resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};
