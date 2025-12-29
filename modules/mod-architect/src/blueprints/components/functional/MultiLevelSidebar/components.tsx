
import React from 'react';

// --- Types ---
interface SidebarContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItemProps {
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  onClick: () => void;
  depth?: number;
}

// --- Components ---

export const SidebarContainer: React.FC<SidebarContainerProps> = ({ children, className = '' }) => (
  <div className={`w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col overflow-hidden ${className}`}>
    {children}
  </div>
);

export const SidebarHeader: React.FC = () => (
  <div className="h-10 border-b border-slate-100 dark:border-slate-700 px-3 flex items-center gap-2 flex-shrink-0">
    <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
    <div className="h-2 w-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
  </div>
);

export const NavList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar" role="tree">
    {children}
  </div>
);

export const NavItem: React.FC<NavItemProps> = ({ 
  label, 
  isActive, 
  isExpanded, 
  hasChildren, 
  onClick, 
  depth = 0 
}) => {
  // Styles based strictly on pages/system/NavigationStructure.tsx patterns
  
  const baseClasses = "rounded flex items-center px-2 transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset";
  const heightClass = "h-6"; // Default height from source
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  // Active/Expanded Parent State
  // Updated to use primary token with opacity
  if (hasChildren && isExpanded) {
    return (
      <div className={`
        h-auto w-full rounded bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 flex flex-col gap-1 p-1
      `}>
        <div 
          className="flex items-center px-1 h-5 justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          onClick={onClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-expanded={true}
        >
          {/* Simulating text with a bar or real text if provided */}
          <span className="text-xs font-bold text-primary dark:text-primary-light truncate">{label}</span>
          <span className="material-symbols-outlined text-[16px] text-primary/70">expand_less</span>
        </div>
        {/* Children container logic is handled by parent composition usually, but for atomic styling here: */}
      </div>
    );
  }

  // Active Leaf State
  // Not explicitly detailed in the specific card in NavigationStructure, but inferring from active states elsewhere in system
  if (isActive && !hasChildren) {
    return (
      <div 
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="treeitem"
        aria-selected={true}
        tabIndex={0}
        className={`${baseClasses} ${heightClass} bg-primary/10 text-primary font-medium`}
      >
        <span className="text-xs truncate">{label}</span>
      </div>
    );
  }

  // Default / Inactive State
  // Source: hover:bg-slate-50 dark:hover:bg-slate-700/50
  return (
    <div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="treeitem"
      aria-selected={false}
      aria-expanded={hasChildren ? false : undefined}
      tabIndex={0}
      className={`${baseClasses} ${heightClass} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs truncate">{label}</span>
        {hasChildren && (
           <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
        )}
      </div>
    </div>
  );
};

export const NestedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pl-2 pr-1 py-1 flex flex-col gap-1" role="group">
    {children}
  </div>
);
