
import React from 'react';

// --- Styles extracted from NavigationStructure.tsx ---

export const TabContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const TabList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
    {children}
  </div>
);

export const TabTrigger: React.FC<{ 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ label, isActive, onClick }) => {
  // Styles match: 
  // Active: px-4 py-3 text-sm text-primary font-bold border-b-2 border-primary bg-blue-50/50 dark:bg-blue-900/10 cursor-pointer
  // Inactive: px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer
  
  const baseClasses = "px-4 py-3 text-sm cursor-pointer whitespace-nowrap transition-colors duration-200";
  
  // Replaced bg-blue-50/50 with bg-primary/5
  const activeClasses = "text-primary font-bold border-b-2 border-primary bg-primary/5 dark:bg-primary/10";
  const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-b-2 border-transparent";

  return (
    <div 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
    >
      {label}
    </div>
  );
};

export const TabContentContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // Styles match: p-4 bg-slate-50/50 dark:bg-slate-800/20
  <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 min-h-[4rem]">
    {children}
  </div>
);
