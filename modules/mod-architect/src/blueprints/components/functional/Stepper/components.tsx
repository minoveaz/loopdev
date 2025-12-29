
import React from 'react';

// --- Types ---
interface StepIndicatorProps {
  stepNumber: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
  icon?: string;
}

// --- Components ---

export const StepperContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

export const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-0 -translate-y-1/2 rounded-full overflow-hidden">
    <div 
      className="h-full bg-primary transition-all duration-500 ease-in-out"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  stepNumber, 
  label, 
  isActive, 
  isComplete, 
  onClick,
  icon 
}) => {
  // Base circle styles
  const circleBase = "w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-surface-dark transition-colors duration-300";
  
  // Dynamic styles based on state
  let circleStateClasses = "";
  let textStateClasses = "";
  let content = null;

  if (isComplete) {
    // Completed State
    circleStateClasses = "bg-primary text-white cursor-pointer hover:bg-primary-dark";
    textStateClasses = "text-primary font-bold";
    content = <span className="material-symbols-outlined text-sm font-bold">check</span>;
  } else if (isActive) {
    // Active State
    circleStateClasses = "bg-primary text-white scale-110";
    textStateClasses = "text-primary font-bold";
    content = icon ? <span className="material-symbols-outlined text-sm">{icon}</span> : <span className="text-xs font-bold">{stepNumber}</span>;
  } else {
    // Pending State
    circleStateClasses = "bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600";
    textStateClasses = "text-slate-400 font-medium";
    content = <span className="text-xs font-bold">{stepNumber}</span>;
  }

  return (
    <div 
      className="relative z-10 flex flex-col items-center gap-2 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className={`${circleBase} ${circleStateClasses}`}>
        {content}
      </div>
      <span className={`text-xs transition-colors duration-300 ${textStateClasses}`}>
        {label}
      </span>
    </div>
  );
};

export const StepperControls: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}> = ({ onNext, onPrev, isFirst, isLast }) => (
  <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
    <button
      onClick={onPrev}
      disabled={isFirst}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isFirst 
          ? 'text-slate-300 cursor-not-allowed' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      Back
    </button>
    <button
      onClick={onNext}
      className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
    >
      {isLast ? 'Finish' : 'Continue'}
    </button>
  </div>
);
