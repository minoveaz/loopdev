
import React from 'react';
import { ComponentEntry } from '../types';

interface BentoCardProps {
  item: ComponentEntry;
}

const getGridSpan = (size: ComponentEntry['size']) => {
  switch (size) {
    case 'full': return 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-2';
    case 'wide': return 'md:col-span-2 row-span-1';
    case 'tall': return 'md:col-span-1 md:row-span-2';
    case 'large': return 'md:col-span-2 md:row-span-2';
    case 'medium': return 'md:col-span-1 row-span-1';
    case 'small': return 'md:col-span-1 row-span-1'; 
    default: return 'col-span-1';
  }
};

const BentoCardHeader: React.FC<{ title: string; category: string }> = ({ title, category }) => (
  <div className="relative p-6 flex justify-between items-start z-20 shrink-0">
    <div>
      <h3 className="text-xl font-bold text-[#0d121b] dark:text-white group-hover:text-primary transition-colors">
        {title}
      </h3>
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {category}
      </span>
    </div>
    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <span className="material-symbols-outlined text-sm text-primary">arrow_outward</span>
    </div>
  </div>
);

const BentoCardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-1 flex items-center justify-center px-4 pb-4 md:px-8 md:pb-8 pt-0 relative z-10 w-full overflow-hidden">
    {children}
  </div>
);

export const BentoCard: React.FC<BentoCardProps> = ({ item }) => {
  return (
    <div 
      className={`
        ${getGridSpan(item.size)} 
        group relative flex flex-col
        bg-white dark:bg-[#161e2e] 
        rounded-[2rem] overflow-hidden 
        border border-slate-200 dark:border-slate-800
        hover:border-primary/50 dark:hover:border-primary/50
        hover:shadow-2xl hover:shadow-blue-900/10
        transition-all duration-500 ease-out
      `}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <BentoCardHeader title={item.title} category={item.category} />
      
      <BentoCardContent>
        {item.component}
      </BentoCardContent>

      {/* Description Footer (Reveals on Hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#161e2e] dark:via-[#161e2e] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20 pointer-events-none">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {item.description}
        </p>
      </div>
    </div>
  );
};
