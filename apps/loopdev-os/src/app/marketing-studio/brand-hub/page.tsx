'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @page BrandHubLanding
 * @description Redirección al punto de anclaje operativo del módulo.
 */
export default function BrandHubLanding() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/marketing-studio/brand-hub/overview');
  }, [router]);

  return null;
}
