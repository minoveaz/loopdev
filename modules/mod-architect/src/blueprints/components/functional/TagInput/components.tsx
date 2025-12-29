
import React from 'react';
import { Tag } from './utils';

// --- Styles extracted from pages/system/ComplexForms.tsx ---

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm h-full flex flex-col ${className}`}>
    {children}
  </div>
);

export const Label: React.FC<{ text: string }> = ({ text }) => (
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
    {text}
  </label>
);

export const InputWrapper: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <div 
    onClick={onClick}
    className="w-full p-2 min-h-[50px] bg-white dark:bg-slate-900 border border-primary ring-1 ring-primary/20 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary/40 transition-all cursor-text"
  >
    {children}
  </div>
);

export const TagItem: React.FC<{ tag: Tag; onRemove: (id: string) => void }> = ({ tag, onRemove }) => {
  const baseClasses = "flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-md text-sm font-medium shadow-sm transition-all animate-in zoom-in-95 duration-200";
  
  const variants = {
    primary: "bg-primary text-white",
    warning: "bg-energy/20 border border-energy text-[#b39700] dark:text-energy"
  };

  const closeHoverClasses = tag.variant === 'warning' 
    ? "hover:bg-black/10 dark:hover:bg-white/10" 
    : "hover:bg-white/20";

  return (
    <div className={`${baseClasses} ${variants[tag.variant || 'primary']}`}>
      {tag.variant === 'warning' && (
        <span className="material-symbols-outlined text-xs">warning</span>
      )}
      <span>{tag.label}</span>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(tag.id); }}
        className={`${closeHoverClasses} rounded p-0.5 transition-colors`}
      >
        <span className="material-symbols-outlined text-xs block">close</span>
      </button>
    </div>
  );
};

export const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input 
    ref={ref}
    className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 p-1 text-sm text-[#0d121b] dark:text-white placeholder-slate-400 focus:outline-none" 
    type="text" 
    {...props} 
  />
));

export const HelperText: React.FC = () => (
  <p className="text-xs text-slate-400 mt-2">
    Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">Enter</kbd> to create a tag.
  </p>
);

export const ApiInfo: React.FC<{ maxTags?: number }> = ({ maxTags }) => (
  <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
    <h5 className="text-xs font-bold text-[#0d121b] dark:text-white mb-2">Component API</h5>
    <div className="font-mono text-xs text-slate-500 flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-purple-600 dark:text-purple-400">maxTags</span>
        <span className="text-slate-600 dark:text-slate-300">{maxTags || 10}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-purple-600 dark:text-purple-400">validate</span>
        <span className="text-slate-600 dark:text-slate-300">email | string</span>
      </div>
      <div className="flex justify-between">
        <span className="text-purple-600 dark:text-purple-400">onAdd</span>
        <span className="text-slate-600 dark:text-slate-300">(tag) =&gt; void</span>
      </div>
    </div>
  </div>
);
