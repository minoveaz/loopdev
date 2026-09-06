import React, { useMemo, useState } from 'react';
import { Check, MapPin, Plus, Search, X } from 'lucide-react';
import { SPANISH_CITIES, type SpanishCity } from '../data/spanishCitiesCatalog';

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
    <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/15 flex flex-col gap-3 animate-in fade-in zoom-in-98 duration-150 text-[#1F4E5F]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span>Buscar ciudad o municipio de España</span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white text-[#1F4E5F]/60 hover:text-[#1F4E5F] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
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
          className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none shadow-2xs"
          autoFocus
        />
        <Search className="w-4 h-4 text-[#1F4E5F]/40 absolute left-3 top-2.5" />
      </div>

      {/* Suggested Results List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto">
        {filteredCities.map((c) => {
          const isSelected = selectedCity === c.name;
          return (
            <button
              key={`${c.name}-${c.province}`}
              type="button"
              onClick={() => onSelectCity(c.name)}
              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                  : 'bg-white hover:bg-[#7FB77E]/10 border border-[#1F4E5F]/10 text-[#1F4E5F]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin
                  className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#7FB77E]' : 'text-[#7FB77E]'}`}
                />
                <div className="truncate">
                  <span className="text-xs font-extrabold block truncate">{c.name}</span>
                  <span
                    className={`text-[10px] block truncate ${isSelected ? 'text-white/70' : 'text-[#1F4E5F]/50'}`}
                  >
                    {c.province} • {c.region}
                  </span>
                </div>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />}
            </button>
          );
        })}

        {/* Custom Custom City Add Button if not in list */}
        {query.trim() && !hasExactMatch && (
          <button
            type="button"
            onClick={() => onSelectCity(query.trim())}
            className="p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2 bg-white hover:bg-[#7FB77E]/10 border border-dashed border-[#7FB77E] text-[#1F4E5F]"
          >
            <Plus className="w-4 h-4 text-[#7FB77E] shrink-0" />
            <div className="truncate">
              <span className="text-xs font-black block truncate">Usar "{query.trim()}"</span>
              <span className="text-[10px] text-[#1F4E5F]/50 block">
                Municipio personalizado de España
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
