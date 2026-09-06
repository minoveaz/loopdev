'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { DocumentIntelligenceWorkbench } from '@/suites/document-intelligence/workbench/DocumentIntelligenceWorkbench';
import { useWorkbenchPrototype } from '@/suites/document-intelligence/workbench/workbench-context';

export default function NewDocumentExtractionPage() {
  const router = useRouter();
  const { flowState, activeDocumentId } = useWorkbenchPrototype();

  useEffect(() => {
    if (flowState === 'review' && activeDocumentId) {
      router.replace(`/document-intelligence/${activeDocumentId}`);
    }
  }, [activeDocumentId, flowState, router]);

  return <DocumentIntelligenceWorkbench />;
}
