import React, { useMemo, useState } from 'react';
import { Check, MapPin, Plus, Search, X } from 'lucide-react';
import { SPANISH_CITIES } from '../data/spanishCitiesCatalog';

export interface CimoCitySearchComboboxProps {
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  onClose?: () => void;
}

// Accent normalization helper
function normalizeStr(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export const CimoCitySearchCombobox: React.FC<CimoCitySearchComboboxProps> = ({
  selectedCity,
  onSelectCity,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const filteredCities = useMemo(() => {
    const q = normalizeStr(query.trim());
    if (!q) {
      return SPANISH_CITIES.slice(0, 8);
    }
    return SPANISH_CITIES.filter((city) => {
      const name = normalizeStr(city.name);
      const prov = normalizeStr(city.province);
      const reg = normalizeStr(city.region);
      const matchesCp = city.postalCodes?.some((cp) => cp.includes(q));
      return name.includes(q) || prov.includes(q) || reg.includes(q) || matchesCp;
    }).slice(0, 8);
  }, [query]);

  const hasExactMatch = filteredCities.some(
    (c) => normalizeStr(c.name) === normalizeStr(query.trim()),
  );

  return (
    <div className="animate-in fade-in zoom-in-98 flex flex-col gap-3 rounded-2xl border border-[#1F4E5F]/15 bg-[#F7F7F7] p-4 text-[#1F4E5F] duration-150">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
          <Search className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span>Buscar ciudad o municipio de España</span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-[#1F4E5F]/60 transition-colors hover:bg-white hover:text-[#1F4E5F]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe tu ciudad (ej. Granada, Santander, Marbella, Alcobendas...)"
          className="shadow-2xs w-full rounded-xl border border-[#1F4E5F]/20 bg-white py-2 pl-9 pr-4 text-xs font-bold text-[#1F4E5F] outline-none focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20"
          autoFocus
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#1F4E5F]/40" />
      </div>

      {/* Suggested Results List */}
      <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
        {filteredCities.map((c) => {
          const isSelected = selectedCity === c.name;
          return (
            <button
              key={`${c.name}-${c.province}`}
              type="button"
              onClick={() => onSelectCity(c.name)}
              className={`flex cursor-pointer items-center justify-between rounded-xl p-2.5 text-left transition-all ${
                isSelected
                  ? 'shadow-xs bg-[#1F4E5F] font-black text-white'
                  : 'border border-[#1F4E5F]/10 bg-white text-[#1F4E5F] hover:bg-[#7FB77E]/10'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <MapPin
                  className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-[#7FB77E]' : 'text-[#7FB77E]'}`}
                />
                <div className="truncate">
                  <span className="block truncate text-xs font-extrabold">{c.name}</span>
                  <span
                    className={`block truncate text-[10px] ${isSelected ? 'text-white/70' : 'text-[#1F4E5F]/50'}`}
                  >
                    {c.province} • {c.region}
                  </span>
                </div>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />}
            </button>
          );
        })}

        {/* Custom Custom City Add Button if not in list */}
        {query.trim() && !hasExactMatch && (
          <button
            type="button"
            onClick={() => onSelectCity(query.trim())}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#7FB77E] bg-white p-2.5 text-left text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/10"
          >
            <Plus className="h-4 w-4 shrink-0 text-[#7FB77E]" />
            <div className="truncate">
              <span className="block truncate text-xs font-black">Usar "{query.trim()}"</span>
              <span className="block text-[10px] text-[#1F4E5F]/50">
                Municipio personalizado de España
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
