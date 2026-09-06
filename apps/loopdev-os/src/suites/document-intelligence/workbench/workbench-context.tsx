'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { DocumentExtractionError, DocumentExtractionResult } from '@loopdev/contracts';

import {
  DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE,
  PROTOTYPE_EXTRACTION_ERROR,
  SPANISH_DNI_FIXTURE_RESULT,
} from './fixtures';
import type {
  PrototypeDocumentFile,
  PrototypeDocumentHistoryItem,
  PrototypeExtractionError,
  PrototypeExtractionResult,
  WorkbenchFlowState,
} from './types';

const SIMULATED_PROCESSING_MS = 7400;
const RESULTS_TRANSITION_MS = 3000;
const HISTORY_STORAGE_KEY = 'loopdev.document-intelligence.operational-history.v1';

interface WorkbenchPrototypeContextValue {
  flowState: WorkbenchFlowState;
  result: PrototypeExtractionResult | null;
  error: PrototypeExtractionError | null;
  documentLoaded: boolean;
  activeDocumentId: string | null;
  documentFiles: { front: PrototypeDocumentFile | null; back: PrototypeDocumentFile | null };
  history: PrototypeDocumentHistoryItem[];
  fileError: string | null;
  isContextPanelOpen: boolean;
  loadDemoDocument: (documentId?: string) => void;
  selectDocumentFile: (file: File, side?: 'front' | 'back') => boolean;
  startExtraction: (
    scenario: 'success' | 'error',
    realExtraction?: {
      organizationId: string;
      front: File;
      back?: File;
    },
  ) => void;
  retryExtraction: () => void;
  resetWorkbench: () => void;
  openContextPanel: () => void;
  closeContextPanel: () => void;
  completeReview: (decision: 'approved' | 'rejected') => void;
  markProcessingVisualComplete: () => void;
}

const WorkbenchPrototypeContext = createContext<WorkbenchPrototypeContextValue | null>(null);

function createDocumentId() {
  return globalThis.crypto?.randomUUID?.() ?? `document-${Date.now()}`;
}

function readHistory(): PrototypeDocumentHistoryItem[] {
  if (typeof window === 'undefined') return DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE;

  try {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE;
    const parsed = JSON.parse(stored) as PrototypeDocumentHistoryItem[];
    return Array.isArray(parsed) ? parsed : DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE;
  } catch {
    return DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE;
  }
}

function toPrototypeResult(result: DocumentExtractionResult): PrototypeExtractionResult {
  return {
    classification: {
      type: result.classification.type,
      confidence: result.classification.confidence ?? 0,
    },
    fields: result.fields,
    fieldConfidence: {},
    validations: result.validations.map((validation) => ({
      field: validation.field,
      valid: validation.valid,
      message: validation.message ?? '',
    })),
    provider: result.provider,
    usage: result.usage ?? {
      promptTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
    },
  };
}

export function WorkbenchPrototypeProvider({ children }: { children: ReactNode }) {
  const [flowState, setFlowState] = useState<WorkbenchFlowState>('preparation');
  const [result, setResult] = useState<PrototypeExtractionResult | null>(null);
  const [error, setError] = useState<PrototypeExtractionError | null>(null);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<{
    front: PrototypeDocumentFile | null;
    back: PrototypeDocumentFile | null;
  }>({ front: null, back: null });
  const [history, setHistory] = useState<PrototypeDocumentHistoryItem[]>(
    DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE,
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [providerReady, setProviderReady] = useState(false);
  const [visualProcessingComplete, setVisualProcessingComplete] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hydrationTimer = window.setTimeout(() => setHistory(readHistory()), 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  const clearTimer = useCallback(() => {
    if (processingTimer.current) {
      clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const updateHistory = useCallback((id: string, patch: Partial<PrototypeDocumentHistoryItem>) => {
    setHistory((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const loadDemoDocument = useCallback(
    (documentId = 'fixture-spanish-dni') => {
      clearTimer();
      setActiveDocumentId(documentId);
      setDocumentLoaded(true);
      setDocumentFiles({ front: null, back: null });
      setResult(null);
      setError(null);
      setProviderReady(false);
      setVisualProcessingComplete(false);
      setFileError(null);
      setIsContextPanelOpen(false);
      setFlowState('preparation');
      setHistory((current) => {
        if (current.some((item) => item.id === documentId)) return current;
        return [...DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE, ...current];
      });
    },
    [clearTimer],
  );

  const selectDocumentFile = useCallback(
    (file: File, side: 'front' | 'back' = 'front') => {
      clearTimer();
      setFileError(null);
      const id = activeDocumentId ?? createDocumentId();
      setActiveDocumentId(id);
      setDocumentFiles((current) => ({
        ...current,
        [side]: {
          file,
          name: file.name,
          mimeType: file.type as PrototypeDocumentFile['mimeType'],
          size: file.size,
          side,
        },
      }));
      setDocumentLoaded(true);
      setResult(null);
      setError(null);
      setProviderReady(false);
      setVisualProcessingComplete(false);
      setIsContextPanelOpen(false);
      setFlowState('preparation');
      setHistory((current) => {
        const nextItem: PrototypeDocumentHistoryItem = {
          id,
          fileName: file.name,
          mimeType: file.type,
          documentType: 'unknown',
          flowState: 'preparation',
          provider: 'fixture',
          updatedAt: new Date().toISOString(),
        };
        const withoutCurrent = current.filter((item) => item.id !== id);
        return [nextItem, ...withoutCurrent];
      });
      return true;
    },
    [activeDocumentId, clearTimer],
  );

  const startExtraction = useCallback(
    (
      scenario: 'success' | 'error',
      realExtraction?: {
        organizationId: string;
        front: File;
        back?: File;
      },
    ) => {
      clearTimer();
      setError(null);
      setResult(null);
      setProviderReady(false);
      setVisualProcessingComplete(false);
      setIsContextPanelOpen(false);
      setFlowState('processing');
      if (activeDocumentId)
        updateHistory(activeDocumentId, {
          flowState: 'processing',
          updatedAt: new Date().toISOString(),
        });
      if (realExtraction) {
        const body = new FormData();
        body.append('front', realExtraction.front);
        if (realExtraction.back) body.append('back', realExtraction.back);
        void fetch('/api/document-intelligence/extract', {
          method: 'POST',
          headers: { 'x-loopdev-organization-id': realExtraction.organizationId },
          body,
        })
          .then(async (response) => {
            const payload = (await response.json()) as {
              classification?: DocumentExtractionResult['classification'];
              fields?: DocumentExtractionResult['fields'];
              validations?: DocumentExtractionResult['validations'];
              provider?: DocumentExtractionResult['provider'];
              usage?: DocumentExtractionResult['usage'];
              error?: DocumentExtractionError;
            };
            if (!response.ok || payload.error) {
              throw (
                payload.error ?? {
                  status: response.status,
                  message: 'No se pudo completar la extracción.',
                }
              );
            }
            return toPrototypeResult(payload as DocumentExtractionResult);
          })
          .then((nextResult) => {
            setResult(nextResult);
            setProviderReady(true);
          })
          .catch((nextError: DocumentExtractionError) => {
            setError({
              status: nextError.status ?? 502,
              message: nextError.message ?? 'No se pudo completar la extracción.',
            });
            setFlowState('error');
            if (activeDocumentId) {
              updateHistory(activeDocumentId, {
                flowState: 'error',
                updatedAt: new Date().toISOString(),
              });
            }
          });
        return;
      }

      processingTimer.current = setTimeout(() => {
        if (scenario === 'error') {
          setError(PROTOTYPE_EXTRACTION_ERROR);
          setFlowState('error');
          if (activeDocumentId)
            updateHistory(activeDocumentId, {
              flowState: 'error',
              updatedAt: new Date().toISOString(),
            });
          return;
        }
        setResult(SPANISH_DNI_FIXTURE_RESULT);
        setProviderReady(true);
      }, SIMULATED_PROCESSING_MS);
    },
    [activeDocumentId, clearTimer, updateHistory],
  );

  const markProcessingVisualComplete = useCallback(() => {
    setVisualProcessingComplete(true);
  }, []);

  useEffect(() => {
    if (flowState !== 'processing' || !providerReady || !visualProcessingComplete) return;

    transitionTimer.current = setTimeout(() => {
      setFlowState('loading-results');
      transitionTimer.current = null;
    }, 0);

    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
    };
  }, [flowState, providerReady, visualProcessingComplete]);

  useEffect(() => {
    if (flowState !== 'loading-results') return;

    transitionTimer.current = setTimeout(() => {
      setFlowState('review');
      if (activeDocumentId && result) {
        updateHistory(activeDocumentId, {
          flowState: 'review',
          documentType: result.classification.type,
          provider: result.provider,
          updatedAt: new Date().toISOString(),
        });
      }
      transitionTimer.current = null;
    }, RESULTS_TRANSITION_MS);

    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
    };
  }, [activeDocumentId, flowState, result, updateHistory]);

  const retryExtraction = useCallback(() => {
    startExtraction('success');
  }, [startExtraction]);

  const resetWorkbench = useCallback(() => {
    clearTimer();
    setDocumentLoaded(false);
    setActiveDocumentId(null);
    setDocumentFiles({ front: null, back: null });
    setResult(null);
    setError(null);
    setProviderReady(false);
    setVisualProcessingComplete(false);
    setFileError(null);
    setIsContextPanelOpen(false);
    setFlowState('preparation');
  }, [clearTimer]);

  const completeReview = useCallback(
    (decision: 'approved' | 'rejected') => {
      if (activeDocumentId) {
        updateHistory(activeDocumentId, {
          flowState: decision === 'approved' ? 'review' : 'error',
          updatedAt: new Date().toISOString(),
        });
      }
      resetWorkbench();
    },
    [activeDocumentId, resetWorkbench, updateHistory],
  );

  const openContextPanel = useCallback(() => setIsContextPanelOpen(true), []);
  const closeContextPanel = useCallback(() => setIsContextPanelOpen(false), []);

  const value = useMemo<WorkbenchPrototypeContextValue>(
    () => ({
      flowState,
      result,
      error,
      documentLoaded,
      activeDocumentId,
      documentFiles,
      history,
      fileError,
      isContextPanelOpen,
      loadDemoDocument,
      selectDocumentFile,
      startExtraction,
      retryExtraction,
      resetWorkbench,
      openContextPanel,
      closeContextPanel,
      completeReview,
      markProcessingVisualComplete,
    }),
    [
      flowState,
      result,
      error,
      documentLoaded,
      activeDocumentId,
      documentFiles,
      history,
      fileError,
      isContextPanelOpen,
      loadDemoDocument,
      selectDocumentFile,
      startExtraction,
      retryExtraction,
      resetWorkbench,
      openContextPanel,
      closeContextPanel,
      completeReview,
      markProcessingVisualComplete,
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
