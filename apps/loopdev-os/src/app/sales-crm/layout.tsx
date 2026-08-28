import type { ReactNode } from 'react';

import { SalesCrmShell } from '@/suites/sales-crm/SalesCrmShell';

export default function SalesCrmLayout({ children }: { children: ReactNode }) {
  return <SalesCrmShell>{children}</SalesCrmShell>;
}
