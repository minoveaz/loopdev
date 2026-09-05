'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { PROTOTYPE_EXTRACTION_ERROR, SPANISH_DNI_FIXTURE_RESULT } from './fixtures';
import type {
  PrototypeExtractionError,
  PrototypeExtractionResult,
  WorkbenchFlowState,
} from './types';

const SIMULATED_PROCESSING_MS = 1600;

interface WorkbenchPrototypeContextValue {
  flowState: WorkbenchFlowState;
  result: PrototypeExtractionResult | null;
  error: PrototypeExtractionError | null;
  documentLoaded: boolean;
  loadDemoDocument: () => void;
  startExtraction: (scenario: 'success' | 'error') => void;
  retryExtraction: () => void;
  resetWorkbench: () => void;
  completeReview: (decision: 'approved' | 'rejected') => void;
}

const WorkbenchPrototypeContext = createContext<WorkbenchPrototypeContextValue | null>(null);

export function WorkbenchPrototypeProvider({ children }: { children: ReactNode }) {
  const [flowState, setFlowState] = useState<WorkbenchFlowState>('preparation');
  const [result, setResult] = useState<PrototypeExtractionResult | null>(null);
  const [error, setError] = useState<PrototypeExtractionError | null>(null);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (processingTimer.current) {
      clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
  };

  const loadDemoDocument = useCallback(() => {
    clearTimer();
    setDocumentLoaded(true);
    setResult(null);
    setError(null);
    setFlowState('preparation');
  }, []);

  const startExtraction = useCallback(
    (scenario: 'success' | 'error') => {
      clearTimer();
      setError(null);
      setResult(null);
      setFlowState('processing');
      processingTimer.current = setTimeout(() => {
        if (scenario === 'error') {
          setError(PROTOTYPE_EXTRACTION_ERROR);
          setFlowState('error');
          return;
        }
        setResult(SPANISH_DNI_FIXTURE_RESULT);
        const hasWarnings = SPANISH_DNI_FIXTURE_RESULT.validations.some((v) => !v.valid);
        setFlowState(hasWarnings ? 'review-with-warnings' : 'review');
      }, SIMULATED_PROCESSING_MS);
    },
    [],
  );

  const retryExtraction = useCallback(() => {
    startExtraction('success');
  }, [startExtraction]);

  const resetWorkbench = useCallback(() => {
    clearTimer();
    setDocumentLoaded(false);
    setResult(null);
    setError(null);
    setFlowState('preparation');
  }, []);

  const completeReview = useCallback(
    (decision: 'approved' | 'rejected') => {
      // El flujo operativo no persiste resultados: aprobar o rechazar cierra la
      // sesión de trabajo y libera los recursos temporales (cleanup).
      void decision;
      resetWorkbench();
    },
    [resetWorkbench],
  );

  const value = useMemo<WorkbenchPrototypeContextValue>(
    () => ({
      flowState,
      result,
      error,
      documentLoaded,
      loadDemoDocument,
      startExtraction,
      retryExtraction,
      resetWorkbench,
      completeReview,
    }),
    [
      flowState,
      result,
      error,
      documentLoaded,
      loadDemoDocument,
      startExtraction,
      retryExtraction,
      resetWorkbench,
      completeReview,
    ],
  );

  return (
    <WorkbenchPrototypeContext.Provider value={value}>
      {children}
    </WorkbenchPrototypeContext.Provider>
  );
}

export function useWorkbenchPrototype() {
  const context = useContext(WorkbenchPrototypeContext);
  if (!context) {
    throw new Error('useWorkbenchPrototype must be used within WorkbenchPrototypeProvider');
  }
  return context;
}
