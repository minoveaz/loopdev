'use client';

import { useEffect } from 'react';

import { DocumentIntelligenceWorkbench } from '@/suites/document-intelligence/workbench/DocumentIntelligenceWorkbench';
import { useWorkbenchPrototype } from '@/suites/document-intelligence/workbench/workbench-context';

export default function DocumentExtractionPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { loadDemoDocument } = useWorkbenchPrototype();

  useEffect(() => {
    void params.then(({ documentId }) => loadDemoDocument(documentId));
  }, [loadDemoDocument, params]);

  return <DocumentIntelligenceWorkbench />;
}
