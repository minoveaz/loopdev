
import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
}

interface HeaderProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
}

interface ContentProps {
  children: React.ReactNode;
  isOpen: boolean;
}

// Extracted from pages/system/NavigationStructure.tsx
// Logic handles swapping classes between the "Closed" visual state and "Open" visual state found in the source.

export const AccordionWrapper: React.FC<WrapperProps> = ({ children, isOpen }) => {
  const baseClasses = "bg-white dark:bg-surface-dark rounded-lg shadow-sm transition-all duration-200";
  const borderClasses = isOpen 
    ? "border border-primary/30 dark:border-primary/30 overflow-hidden" 
    : "border border-slate-200 dark:border-slate-700";

  return (
    <div className={`${baseClasses} ${borderClasses}`}>
      {children}
    </div>
  );
};

export const AccordionHeader: React.FC<HeaderProps> = ({ title, isOpen, onClick }) => {
  // Uses primary token with opacity for background instead of hardcoded blue-50
  const containerClasses = isOpen 
    ? "p-3 flex items-center justify-between bg-primary/5 dark:bg-primary/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
    : "p-3 flex items-center justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset rounded-lg";
  
  const textClasses = isOpen
    ? "text-xs font-bold text-primary"
    : "text-xs font-bold text-slate-700 dark:text-slate-300";

  const iconClasses = isOpen
    ? "text-sm text-primary"
    : "text-sm text-slate-400";

  const iconName = isOpen ? "remove" : "add";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={containerClasses} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={handleKeyDown}
    >
      <span className={textClasses}>{title}</span>
      <span className={`material-symbols-outlined ${iconClasses}`}>{iconName}</span>
    </div>
  );
};

export const AccordionBody: React.FC<ContentProps> = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="p-3 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-1 duration-200"
      role="region"
    >
      {children}
    </div>
  );
};

export const AccordionContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full flex flex-col gap-2 ${className}`}>
    {children}
  </div>
);
