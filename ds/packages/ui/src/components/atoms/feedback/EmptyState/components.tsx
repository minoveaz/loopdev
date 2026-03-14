import React from 'react';

/**
 * @component EmptyStateVisual
 * @description Contenedor visual para el icono del EmptyState con estilo de plano técnico.
 * Se ha ampliado el margen para evitar solapamientos con iconos complejos.
 */
export const EmptyStateVisual: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBrackets?: boolean;
}> = ({ children, className = '', size = 'md', showBrackets = true }) => {
  const sizeClasses = {
    sm: 'w-24 h-24', // Antes 20x20
    md: 'w-32 h-32', // Antes 28x28
    lg: 'w-40 h-40'
  }[size];

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center mb-8 ${className}`}>
      {/* Micro-grid background for the icon */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 overflow-hidden shadow-inner">
        <div 
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]" 
          style={{ 
            backgroundImage: `radial-gradient(var(--lpd-color-brand-primary) 0.5px, transparent 0.5px)`, 
            backgroundSize: '12px 12px' 
          }} 
        />
      </div>
      
      {/* Icon focus brackets - More separation */}
      {showBrackets && (
        <>
          <div className="absolute -top-3 -left-3 w-5 h-5 border-t-2 border-l-2 border-primary/20 rounded-tl-sm" />
          <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b-2 border-r-2 border-primary/20 rounded-br-sm" />
        </>
      )}
      
      <div className="relative z-10 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-700 ease-momentum">
        {children}
      </div>
    </div>
  );
};

/**
 * @component AIBracketVisual
 * @description Variante de contenedor visual que usa llaves { } para el estado de IA.
 */
export const AIBracketVisual: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex items-center justify-center mb-10 group/ai">
    <div className="absolute inset-0 bg-innovation-purple/5 rounded-full blur-3xl animate-pulse" />
    <div className="relative flex items-center gap-6">
      <span className="text-5xl font-black text-innovation-purple animate-in fade-in slide-in-from-left-6 duration-1000">{"{"}</span>
      <div className="relative z-10">
        {children}
      </div>
      <span className="text-5xl font-black text-innovation-purple animate-in fade-in slide-in-from-right-6 duration-1000">{"}"}</span>
    </div>
  </div>
);
