
import React from 'react';
import { useStepper } from './useStepper';
import { StepperContainer, ProgressBar, StepIndicator, StepperControls } from './components';
import { StepItem, DEFAULT_STEPS } from './utils';

interface StepperProps {
  steps?: StepItem[];
  initialStep?: number;
  className?: string;
  showControls?: boolean;
  onComplete?: () => void;
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps = DEFAULT_STEPS, 
  initialStep = 0,
  className,
  showControls = true,
  onComplete
}) => {
  const { 
    currentStep, 
    progressPercentage, 
    next, 
    prev, 
    goTo, 
    isComplete, 
    isActive 
  } = useStepper(steps.length, initialStep);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      if (onComplete) onComplete();
    } else {
      next();
    }
  };

  return (
    <StepperContainer className={className}>
      {/* Header / Navigation */}
      <div className="relative flex justify-between mb-8 px-2">
        <ProgressBar percentage={progressPercentage} />
        {steps.map((step, index) => (
          <StepIndicator
            key={step.id}
            stepNumber={index + 1}
            label={step.label}
            isActive={isActive(index)}
            isComplete={isComplete(index)}
            onClick={() => goTo(index)}
            icon={step.icon} // Optional icon override if provided in data
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-6 min-h-[120px] animate-in fade-in duration-300">
        {steps[currentStep].content || (
          <div className="text-center py-4 text-slate-500">
            <h4 className="text-lg font-bold text-[#0d121b] dark:text-white mb-2">{steps[currentStep].label}</h4>
            <p className="text-sm">Step {currentStep + 1} content placeholder.</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <StepperControls 
          onNext={handleNext} 
          onPrev={prev} 
          isFirst={currentStep === 0} 
          isLast={currentStep === steps.length - 1} 
        />
      )}
    </StepperContainer>
  );
};
