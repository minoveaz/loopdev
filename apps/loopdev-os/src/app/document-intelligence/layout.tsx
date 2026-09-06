import type { ReactNode } from 'react';

import { DocumentIntelligenceShell } from '@/suites/document-intelligence/DocumentIntelligenceShell';
import { WorkbenchPrototypeProvider } from '@/suites/document-intelligence/workbench/workbench-context';

export default function DocumentIntelligenceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkbenchPrototypeProvider>
      <DocumentIntelligenceShell>{children}</DocumentIntelligenceShell>
    </WorkbenchPrototypeProvider>
  );
}
