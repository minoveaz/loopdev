
import React from 'react';
import { SearchResult, getIconForType, getIconStyles } from './utils';

export const AutocompleteContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm h-full flex flex-col justify-start ${className}`}>
    {children}
  </div>
);

export const SearchLabel: React.FC<{ text: string }> = ({ text }) => (
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
    {text}
  </label>
);

export const SearchInput: React.FC<{ 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}> = ({ value, onChange, onKeyDown, onFocus }) => (
  <div className="relative mb-6">
    <div className="absolute left-3 top-2.5 text-slate-400">
      <span className="material-symbols-outlined text-xl">search</span>
    </div>
    <input 
      className="w-full pl-10 pr-4 py-2.5 rounded-lg border-primary ring-1 ring-primary/20 bg-slate-50 dark:bg-slate-900 text-[#0d121b] dark:text-white placeholder-slate-400 focus:outline-none" 
      placeholder="Search..." 
      type="text" 
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    />
  </div>
);

export const DropdownContainer: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
      {children}
    </div>
  );
};

export const GroupHeader: React.FC<{ text: string }> = ({ text }) => (
  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
    {text}
  </div>
);

export const NoResults: React.FC = () => (
  <div className="px-4 py-6 text-center">
    <span className="material-symbols-outlined text-slate-300 text-2xl mb-2">search_off</span>
    <p className="text-sm text-slate-500">No matching results found.</p>
  </div>
);

// Dynamic Highlighting Component
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <span className="text-sm font-medium text-[#0d121b] dark:text-white">{text}</span>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <span className="text-sm font-medium text-[#0d121b] dark:text-white">
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="font-bold text-primary">{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const ResultItem: React.FC<{ 
  item: SearchResult; 
  isActive: boolean; 
  isHighlighted: boolean;
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
}> = ({ item, isActive, isHighlighted, query, onClick, onMouseEnter }) => {
  // Logic: 
  // isActive = Permanently selected (e.g. from previous choice)
  // isHighlighted = Currently focused (via mouse hover or keyboard arrows)
  
  let containerClasses = "flex items-center gap-3 py-3 cursor-pointer group px-4 border-l-2 transition-colors ";
  
  if (isActive) {
    // Replaced bg-blue-50/50 with bg-primary/10
    containerClasses += "bg-primary/10 border-primary ";
  } else if (isHighlighted) {
    containerClasses += "bg-slate-50 dark:bg-slate-700/50 border-transparent ";
  } else {
    containerClasses += "border-transparent ";
  }

  return (
    <li 
      className={containerClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={isActive}
    >
      <div className={`${getIconStyles(item.type)} p-1.5 rounded-md`}>
        <span className="material-symbols-outlined text-lg">{getIconForType(item.type)}</span>
      </div>
      <div className="flex flex-col">
        <HighlightedText text={item.title} query={query} />
        <span className="text-xs text-slate-500">{item.subtitle}</span>
      </div>
    </li>
  );
};

export const SearchFooter: React.FC = () => (
  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
    <p className="text-xs text-slate-500 leading-relaxed">
      <span className="font-bold text-primary">Note:</span> Search uses fuzzy matching logic. Highlighting is handled by the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-primary">HighlightSpan</code> component.
    </p>
  </div>
);
