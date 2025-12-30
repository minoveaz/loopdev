
import React, { useState, useMemo } from 'react';
import { ComponentCategory } from '@blueprints/pages/functional/types';
import { BentoCard } from '@blueprints/components/BentoCard';
import { EmptyState } from '@blueprints/components/functional/EmptyState/index';

// Import Modular Data
import { formsData } from '@blueprints/data/forms';
import { navigationData } from '@blueprints/data/navigation';
import { overlaysData } from '@blueprints/data/overlays';
import { feedbackData } from '@blueprints/data/feedback';
import { tablesData } from '@blueprints/data/tables';
import { actionsData } from '@blueprints/data/actions';

// Combine all data sources
const COMPONENT_REGISTRY = [
  ...formsData,
  ...navigationData,
  ...overlaysData,
  ...feedbackData,
  ...tablesData,
  ...actionsData
];

export const FunctionalLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('All');

  const filteredComponents = useMemo(() => {
    return activeCategory === 'All' 
      ? COMPONENT_REGISTRY 
      : COMPONENT_REGISTRY.filter(c => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f17] p-6 md:p-12 pb-32">
      
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-fit">
            <span className="material-symbols-outlined text-sm">science</span>
            <span className="text-xs font-bold uppercase tracking-wide">Experimental Lab</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0d121b] dark:text-white tracking-tighter mb-4">
            Component <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Showcase</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            A curated collection of atomic functional units. <br className="hidden md:block"/>
            Interactive, stateless, and ready for integration.
          </p>
        </div>

        {/* Minimal Category Filter */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Forms', 'Data', 'Navigation', 'Overlays', 'Feedback', 'Actions'] as ComponentCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-xs font-bold transition-all duration-300
                ${activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
        {filteredComponents.map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State Fallback */}
      {filteredComponents.length === 0 && (
        <div className="h-96 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <span className="material-symbols-outlined text-4xl text-slate-300">science</span>
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No experiments found</h3>
          <p className="text-slate-500">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
};
