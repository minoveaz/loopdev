import React, { useEffect, useState } from 'react';
import { Bookmark, Check, Plus, X, Zap } from 'lucide-react';

export interface CimoCaptainInstructionsFieldProps {
  value: string;
  onChange: (val: string) => void;
  sport?: string;
  stepNumber?: string | number;
  className?: string;
}

const quickChipsBySport: Record<string, string[]> = {
  hiking: [
    'Quedamos en el aparcamiento principal',
    'Llegar 10 min antes para organizar el grupo',
    'Ruta circular con paradas de reagrupación',
    'Aparcamiento gratuito en la zona',
  ],
  running: [
    'Quedamos en el punto de acceso principal',
    'Llegar 5 min antes para calentar',
    'Rodaje continuo por zonas sombreadas',
    '5 min de estiramientos post-entreno',
  ],
  padel: [
    'Pista ya reservada por el capitán',
    'Estar en recepción 10 min antes',
    'Coste de pista compartido entre 4',
    'Pelotas nuevas y calentamiento',
  ],
  cycling: [
    'Punto de salida en la rotonda o gasolinera',
    'Salida puntual a la hora acordada',
    'Ritmo de grupeta con relevos suaves',
    'Parada intermedia en fuente',
  ],
  crossfit: [
    'Estar 10 min antes en la entrada',
    'Sesión guiada y adaptada por niveles',
    'Estiramientos y cierre deportivo',
  ],
};

const TEMPLATE_STORAGE_KEY = 'cimo_captain_instructions_preset';

export const CimoCaptainInstructionsField: React.FC<CimoCaptainInstructionsFieldProps> = ({
  value,
  onChange,
  sport = 'running',
  stepNumber = 7,
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
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-xs font-black text-[#7FB77E]">
            {stepNumber}
          </span>
          <span className="text-sm font-black uppercase tracking-wider text-[#1F4E5F]/85">
            Consejos e indicaciones del Capitán{' '}
            <span className="font-bold lowercase text-[#1F4E5F]/40">(opcional)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {value.trim() && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex cursor-pointer items-center gap-1 text-[11px] font-black text-rose-600 transition-colors hover:text-rose-700"
              title="Borrar todo el texto"
            >
              <X className="h-3 w-3" />
              <span>Limpiar</span>
            </button>
          )}
          <span className="text-[11px] font-bold text-[#1F4E5F]/50">{value.length}/300</span>
        </div>
      </div>

      {/* Suggested Quick Chips with Interactive Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Ideas rápidas con 1 clic
          </span>

          {savedTemplate && (
            <button
              type="button"
              onClick={handleLoadTemplate}
              className="flex cursor-pointer items-center gap-1 text-[11px] font-black text-[#7FB77E] transition-colors hover:text-[#6ea26d]"
            >
              <Zap className="h-3 w-3 fill-[#7FB77E]" />
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
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  isAdded
                    ? 'shadow-2xs border-[#7FB77E] bg-[#7FB77E]/15 font-black text-[#1F4E5F]'
                    : 'border-[#1F4E5F]/15 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-white'
                }`}
              >
                {isAdded ? (
                  <Check className="h-3.5 w-3.5 stroke-[3] text-[#7FB77E]" />
                ) : (
                  <Plus className="h-3.5 w-3.5 text-[#7FB77E]" />
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
          className="shadow-2xs w-full resize-none rounded-2xl border border-[#1F4E5F]/20 bg-[#F7F7F7]/50 p-4 text-xs font-bold leading-relaxed text-[#1F4E5F] outline-none transition-all focus:border-[#7FB77E] focus:bg-white focus:ring-2 focus:ring-[#7FB77E]/20"
        />

        {/* Action to Save current text as Captain Template */}
        {value.trim().length >= 10 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-medium text-[#1F4E5F]/50">
              {showSavedNotification ? (
                <span className="animate-in fade-in flex items-center gap-1 font-black text-[#7FB77E]">
                  <Check className="h-3 w-3" /> ¡Plantilla guardada para tus próximos entrenos!
                </span>
              ) : (
                '¿Sueles dar siempre estas mismas normas?'
              )}
            </span>

            <button
              type="button"
              onClick={handleSaveAsTemplate}
              className="flex cursor-pointer items-center gap-1 text-[11px] font-black text-[#1F4E5F]/70 transition-colors hover:text-[#1F4E5F]"
            >
              <Bookmark className="h-3 w-3 text-[#7FB77E]" />
              <span>Guardar como mi plantilla habitual</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
