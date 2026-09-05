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

const SIMULATED_PROCESSING_MS = 1600;
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
  loadDemoDocument: (documentId?: string) => void;
  selectDocumentFile: (file: File, side?: 'front' | 'back') => boolean;
  startExtraction: (scenario: 'success' | 'error') => void;
  retryExtraction: () => void;
  resetWorkbench: () => void;
  completeReview: (decision: 'approved' | 'rejected') => void;
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
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setFileError(null);
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
    (scenario: 'success' | 'error') => {
      clearTimer();
      setError(null);
      setResult(null);
      setFlowState('processing');
      if (activeDocumentId)
        updateHistory(activeDocumentId, {
          flowState: 'processing',
          updatedAt: new Date().toISOString(),
        });
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
        setFlowState('review');
        if (activeDocumentId) {
          updateHistory(activeDocumentId, {
            flowState: 'review',
            documentType: SPANISH_DNI_FIXTURE_RESULT.classification.type,
            provider: SPANISH_DNI_FIXTURE_RESULT.provider,
            updatedAt: new Date().toISOString(),
          });
        }
      }, SIMULATED_PROCESSING_MS);
    },
    [activeDocumentId, clearTimer, updateHistory],
  );

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
    setFileError(null);
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
      loadDemoDocument,
      selectDocumentFile,
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
      activeDocumentId,
      documentFiles,
      history,
      fileError,
      loadDemoDocument,
      selectDocumentFile,
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
