import React from 'react';

type EmptyStateSize = 'sm' | 'md';

export const EmptyStateIcon: React.FC<{ icon: string; badge?: string; size?: EmptyStateSize }> = ({ icon, badge, size = 'md' }) => {
  const wrapperClasses = size === 'sm' 
    ? 'w-12 h-12 mb-3' 
    : 'w-20 h-20 mb-6';
    
  const iconClasses = size === 'sm' 
    ? 'text-2xl' 
    : 'text-4xl';

  return (
    <div className={`${wrapperClasses} bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
      <span className={`material-symbols-outlined ${iconClasses} text-slate-400`}>
        {icon}
      </span>
      {badge && (
        <span className="absolute -right-1 -bottom-1 bg-[#FFD025] text-[#0d121b] text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-[#161e2e]">
          {badge}
        </span>
      )}
    </div>
  );
};

export const EmptyStateContent: React.FC<{ title: string; description: React.ReactNode; size?: EmptyStateSize }> = ({ title, description, size = 'md' }) => {
  const titleClasses = size === 'sm' 
    ? 'text-sm font-bold mb-1' 
    : 'text-xl font-bold mb-2';
    
  const descClasses = size === 'sm'
    ? 'text-xs mb-4 max-w-[200px]'
    : 'text-sm mb-8 max-w-xs';

  return (
    <>
      <h3 className={`text-[#0d121b] dark:text-white text-center ${titleClasses}`}>
        {title}
      </h3>
      <div className={`text-slate-500 text-center ${descClasses}`}>
        {description}
      </div>
    </>
  );
};

export const EmptyStateContainer: React.FC<{ children: React.ReactNode; className?: string; size?: EmptyStateSize }> = ({ children, className = '', size = 'md' }) => {
  const paddingClasses = size === 'sm' ? 'py-8 px-4' : 'py-16 px-4';
  
  return (
    <div className={`
      flex flex-col items-center justify-center ${paddingClasses}
      bg-white dark:bg-[#161e2e] 
      ${size === 'md' ? 'border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm' : ''}
      hover:border-primary/30 transition-colors group
      ${className}
    `}>
      {children}
    </div>
  );
};