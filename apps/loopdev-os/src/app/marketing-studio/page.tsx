'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SuiteHomeLayout } from '@loopdev/ui';
import type { SuiteHomeLayoutProps } from '@loopdev/ui';
import { getMarketingStudioHomeConfig } from '@/suites/marketing-studio/home.config';

/**
 * @page MarketingStudioHome
 * @description Punto de entrada principal a la suite de Marketing.
 * Implementación real usando el template SuiteHomeLayout.
 */
export default function MarketingStudioPage() {
  const router = useRouter();
  const config = getMarketingStudioHomeConfig(router);
  const homeProps: SuiteHomeLayoutProps = {
    ...config,
    userState: 'active'
  };

  return <SuiteHomeLayout {...homeProps} />;
}