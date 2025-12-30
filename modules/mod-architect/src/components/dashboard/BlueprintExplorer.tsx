import React, { useState, useMemo } from 'react';
import { Box, Stack, Inline } from '@loopdev/ui';
import { Folder, FileCode, AlertTriangle, ChevronRight, ChevronDown, Search } from 'lucide-react';
import registryData from '../../data/blueprint_registry.json';
import officialData from '../../data/official_registry.json';

interface BlueprintExplorerProps {
  onSelect: (id: string) => void;
  selectedId?: string;
}

export const BlueprintExplorer = ({ onSelect, selectedId }: BlueprintExplorerProps) => {
  const [searchTerm, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({ 'Official': true, 'Components': true, 'Layout': true });

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Agrupar componentes por categoría (Fusionando ambos registros)
  const groupedBlueprints = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const allData = [...officialData, ...registryData];
    
    allData.forEach(bp => {
      // Defensive check: Skip malformed entries
      if (!bp || !bp.name) return;

      if (searchTerm && !bp.name.toLowerCase().includes(searchTerm.toLowerCase())) return;
      
      const cat = bp.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(bp);
    });
    
    return groups;
  }, [searchTerm]);

  return (
    <Stack gap={0} className="h-full bg-slate-50/50 backdrop-blur-sm border-r border-slate-200/60">
      <Box padding={4} className="border-b border-slate-100 bg-white/80">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find blueprint..." 
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-100/50 border-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Box>

      <div className="flex-1 overflow-y-auto custom-scrollbar-thin py-4">
        {Object.entries(groupedBlueprints).map(([category, items]) => (
          <div key={category} className="mb-4">
            <button 
              onClick={() => toggleCat(category)}
              className="w-full px-4 py-1.5 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              {expandedCats[category] === false ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              {category} ({items.length})
            </button>

            {expandedCats[category] !== false && (
              <Stack gap={0.5} className="mt-1 px-2">
                {items.map((bp) => {
                  const isMigrating = bp.name === 'ActionMenu'; // Pilot component
                  const isSelected = selectedId === bp.name;

                  return (
                    <button
                      key={bp.id}
                      onClick={() => onSelect(bp.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex flex-col transition-all group ${
                        isSelected 
                          ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' 
                          : 'hover:bg-white/60 text-slate-600 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <FileCode size={14} className={isSelected ? 'text-indigo-500' : 'text-slate-400'} />
                          {isMigrating && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 border-2 border-slate-50 rounded-full shadow-sm animate-pulse" />
                          )}
                        </div>
                        <span className={`text-xs font-bold truncate ${isMigrating && !isSelected ? 'text-orange-600' : ''}`}>
                          {bp.name}
                        </span>
                        {bp.audit && bp.audit.hardcodedColors > 5 && (
                          <AlertTriangle size={12} className="text-amber-500 shrink-0" title="High technical debt" />
                        )}
                      </div>
                      
                      <div className="pl-6 mt-0.5">
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic leading-tight">
                          {isMigrating ? 'Migration in progress: Step 1 (Tokens)' : bp.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </Stack>
            )}
          </div>
        ))}
      </div>
    </Stack>
  );
};
