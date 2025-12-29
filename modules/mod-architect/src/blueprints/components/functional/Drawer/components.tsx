
import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}

export const DrawerOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <div 
    className={`
      fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}
    onClick={onClose}
    aria-hidden="true"
  />
);

export const DrawerPanel: React.FC<DrawerProps> = ({ isOpen, onClose, children, title, size = 'md', actions }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div 
      className={`
        fixed inset-y-4 right-4 left-4 md:left-auto md:w-full ${sizeClasses[size]}
        bg-white dark:bg-[#1e293b] 
        rounded-2xl shadow-2xl 
        border border-slate-200 dark:border-slate-700 
        z-50 flex flex-col overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-[#0d121b] dark:text-white truncate mr-2">
          {title || 'Drawer'}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Mobile Actions Injection: Visible only on mobile/tablet */}
          {actions && (
            <div className="flex items-center gap-2 md:hidden">
              {actions}
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        {children}
      </div>

      {/* Desktop Footer: Visible only on desktop if actions are provided via prop */}
      {actions && (
        <div className="hidden md:flex flex-shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#161e2e] justify-end gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export const DrawerFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#161e2e] flex justify-end gap-3">
    {children}
  </div>
);
