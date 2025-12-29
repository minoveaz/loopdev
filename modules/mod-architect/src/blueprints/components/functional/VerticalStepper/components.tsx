
import React from 'react';

type StepState = 'completed' | 'active' | 'pending';

interface IndicatorProps {
  stepNumber: number;
  state: StepState;
  isLast: boolean;
}

export const StepperContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

export const StepRow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <div className="flex gap-4 group" onClick={onClick}>
    {children}
  </div>
);

export const StepLeftRail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center">
    {children}
  </div>
);

export const StepIndicator: React.FC<IndicatorProps> = ({ stepNumber, state, isLast }) => {
  // Styles based on NotificationsAndWorkflows.tsx reference
  const baseCircle = "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-300";
  
  let circleClass = "";
  if (state === 'completed') {
    // Completed: Solid Primary
    circleClass = "bg-primary text-white";
  } else if (state === 'active') {
    // Active: White with Primary Border
    circleClass = "bg-white dark:bg-surface-dark border-2 border-primary text-primary shadow-[0_0_0_2px_rgba(19,91,236,0.1)]";
  } else {
    // Pending: Gray
    circleClass = "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
  }

  // Connector Line
  const lineBase = "w-0.5 flex-1 min-h-[24px] transition-colors duration-300";
  let lineClass = "";
  
  if (isLast) {
    lineClass = "hidden"; // No line after last step
  } else if (state === 'completed') {
    lineClass = "bg-primary";
  } else {
    lineClass = "bg-slate-200 dark:bg-slate-700";
  }

  return (
    <>
      <div className={`${baseCircle} ${circleClass}`}>
        {state === 'completed' ? stepNumber : stepNumber} 
        {/* Could swap to checkmark icon for completed if desired, keeping numbers to match source */}
      </div>
      {!isLast && <div className={lineBase + " " + lineClass}></div>}
    </>
  );
};

export const StepContentWrapper: React.FC<{ 
  title: string; 
  description?: string; 
  children?: React.ReactNode; 
  state: StepState;
  isLast: boolean;
}> = ({ title, description, children, state, isLast }) => {
  
  const titleClass = state === 'pending' 
    ? "text-slate-400 dark:text-slate-500" 
    : "text-[#0d121b] dark:text-white";
    
  const descClass = state === 'pending'
    ? "text-slate-400 dark:text-slate-500"
    : "text-slate-500 dark:text-slate-400";

  // Add padding-bottom to match the rail height unless it's the last item
  const spacingClass = isLast ? "" : "pb-8";

  return (
    <div className={`flex flex-col pt-0.5 flex-1 ${spacingClass}`}>
      <div>
        <h4 className={`text-sm font-bold transition-colors ${titleClass}`}>{title}</h4>
        {description && <p className={`text-[10px] mt-1 transition-colors ${descClass}`}>{description}</p>}
      </div>
      
      {/* Active Content Area (Expanded) */}
      {state === 'active' && children && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
