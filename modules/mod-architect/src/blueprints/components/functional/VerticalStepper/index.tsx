
import React from 'react';
import { useVerticalStepper } from './useVerticalStepper';
import { StepperContainer, StepRow, StepLeftRail, StepIndicator, StepContentWrapper } from './components';
import { VerticalStep, PROJECT_SETUP_STEPS } from './utils';

interface VerticalStepperProps {
  steps?: VerticalStep[];
  initialStep?: number;
  className?: string;
  onStepClick?: (index: number) => void;
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({ 
  steps = PROJECT_SETUP_STEPS, 
  initialStep = 1, // Defaulting to 2nd step active to match visual reference
  className = "",
  onStepClick
}) => {
  const { activeStep, goTo, getStepState } = useVerticalStepper(steps.length, initialStep);

  const handleClick = (index: number) => {
    goTo(index);
    if (onStepClick) onStepClick(index);
  };

  return (
    <StepperContainer className={className}>
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;

        // Custom Render Logic for the demo "Integration" step to match source exactly
        // In a real app, you'd pass this via the 'content' prop of the step object
        let contentNode = step.content;
        
        // Demo specific: if content matches specific placeholder or if we want to mimic the exact card
        if (state === 'active' && !React.isValidElement(contentNode) && step.title === 'Integration') {
           contentNode = (
             <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
               <h4 className="text-sm font-bold text-primary">Integration</h4>
               <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 mb-2">Connect your data sources.</p>
               <button className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold rounded shadow-sm transition-colors">
                 Connect
               </button>
             </div>
           );
        }

        return (
          <StepRow key={step.id} onClick={() => handleClick(index)}>
            <StepLeftRail>
              <StepIndicator 
                stepNumber={index + 1} 
                state={state} 
                isLast={isLast} 
              />
            </StepLeftRail>
            <StepContentWrapper 
              title={step.title} 
              description={step.description} 
              state={state}
              isLast={isLast}
            >
              {contentNode}
            </StepContentWrapper>
          </StepRow>
        );
      })}
    </StepperContainer>
  );
};
