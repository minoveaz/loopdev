
import { useState, useCallback } from 'react';

export const useStepper = (totalSteps: number, initialStep: number = 0) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);

  const isComplete = useCallback((stepIndex: number) => {
    return stepIndex < currentStep;
  }, [currentStep]);

  const isActive = useCallback((stepIndex: number) => {
    return stepIndex === currentStep;
  }, [currentStep]);

  const progressPercentage = Math.min(
    100, 
    Math.max(0, (currentStep / (totalSteps - 1)) * 100)
  );

  return {
    currentStep,
    progressPercentage,
    next,
    prev,
    goTo,
    isComplete,
    isActive
  };
};
