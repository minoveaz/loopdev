import React, { useEffect, useState } from 'react';
import { Bookmark, Check, FileText, Plus, RotateCcw, Sparkles, X, Zap } from 'lucide-react';

export interface CimoCaptainInstructionsFieldProps {
  value: string;
  onChange: (val: string) => void;
  sport?: string;
  className?: string;
}

const quickChipsBySport: Record<string, string[]> = {
  running: ['Traer agua personal', 'Llegar 5 min antes', 'Calzado adecuado', 'Estiramientos al terminar'],
  padel: ['Traer pala propia', 'Pista reservada', 'Estar en recepción 10 min antes', 'Bolas nuevas incluidas'],
  hiking: ['Calzado de montaña', 'Mínimo 1.5L de agua', 'Cortavientos / Abrigo', 'Snack / Frutos secos'],
  crossfit: ['Botella de agua y toalla', 'Calentamiento previo 10 min', 'Magnesio'],
  cycling: ['Casco obligatorio', 'Kit de pinchazos y bomba', '2 bidones de agua', 'Luces delantera/trasera'],
};

const TEMPLATE_STORAGE_KEY = 'cimo_captain_instructions_preset';

export const CimoCaptainInstructionsField: React.FC<CimoCaptainInstructionsFieldProps> = ({
  value,
  onChange,
  sport = 'running',
  className = '',
}) => {
  const chips = quickChipsBySport[sport] ?? quickChipsBySport.running;
  const [savedTemplate, setSavedTemplate] = useState<string>('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (stored) setSavedTemplate(stored);
    } catch {
      // safe fallback
    }
  }, []);

  const handleToggleChip = (chip: string) => {
    if (value.includes(chip)) {
      // Remove chip cleanly
      const updated = value
        .replace(new RegExp(`\\.?\\s*${chip.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.?`, 'g'), '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*\.\s*/, '')
        .trim();
      onChange(updated);
    } else {
      // Append chip cleanly
      const updated = value.trim() ? `${value.trim()}. ${chip}` : chip;
      onChange(updated);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!value.trim()) return;
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, value.trim());
      setSavedTemplate(value.trim());
      setShowSavedNotification(true);
      setTimeout(() => setShowSavedNotification(false), 2500);
    } catch {
      // safe fallback
    }
  };

  const handleLoadTemplate = () => {
    if (savedTemplate) {
      onChange(savedTemplate);
    }
  };

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {/* Unified Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] text-xs font-black flex items-center justify-center shrink-0">
            6
          </span>
          <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
            Instrucciones del Capitán <span className="text-[#1F4E5F]/40 font-bold lowercase">(opcional)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {value.trim() && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] font-black text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Borrar todo el texto"
            >
              <X className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
          <span className="text-[11px] font-bold text-[#1F4E5F]/50">
            {value.length}/300
          </span>
        </div>
      </div>

      {/* Suggested Quick Chips with Interactive Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-[#1F4E5F]/60 uppercase tracking-wider">
            Recomendaciones rápidas en 1 clic
          </span>

          {savedTemplate && (
            <button
              type="button"
              onClick={handleLoadTemplate}
              className="text-[11px] font-black text-[#7FB77E] hover:text-[#6ea26d] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-[#7FB77E]" />
              <span>Usar mi plantilla habitual</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {chips.map((c) => {
            const isAdded = value.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleToggleChip(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAdded
                    ? 'border-[#7FB77E] bg-[#7FB77E]/15 text-[#1F4E5F] font-black shadow-2xs'
                    : 'border-[#1F4E5F]/15 bg-[#F7F7F7] hover:bg-white text-[#1F4E5F]'
                }`}
              >
                {isAdded ? (
                  <Check className="w-3.5 h-3.5 text-[#7FB77E] stroke-[3]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-[#7FB77E]" />
                )}
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea Input Card */}
      <div className="relative flex flex-col gap-2">
        <textarea
          rows={3}
          maxLength={300}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe recomendaciones para el Crew: punto exacto de encuentro, qué llevar, coste compartido de pistas..."
          className="w-full p-4 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7]/50 focus:bg-white shadow-2xs resize-none leading-relaxed transition-all"
        />

        {/* Action to Save current text as Captain Template */}
        {value.trim().length >= 10 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-[#1F4E5F]/50 font-medium">
              {showSavedNotification ? (
                <span className="text-[#7FB77E] font-black flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" /> ¡Plantilla guardada para tus próximos entrenos!
                </span>
              ) : (
                '¿Sueles dar siempre estas mismas normas?'
              )}
            </span>

            <button
              type="button"
              onClick={handleSaveAsTemplate}
              className="text-[11px] font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3 h-3 text-[#7FB77E]" />
              <span>Guardar como mi plantilla habitual</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
