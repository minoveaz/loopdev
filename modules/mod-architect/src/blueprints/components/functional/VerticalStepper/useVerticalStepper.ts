
import { useState, useCallback } from 'react';

export const useVerticalStepper = (totalSteps: number, initialStep: number = 0) => {
  const [activeStep, setActiveStep] = useState(initialStep);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setActiveStep(index);
    }
  }, [totalSteps]);

  const getStepState = useCallback((index: number) => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  }, [activeStep]);

  return {
    activeStep,
    goTo,
    getStepState
  };
};
