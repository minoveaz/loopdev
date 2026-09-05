'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useSyncExternalStore, ReactNode } from 'react';

const isVisualCertification = process.env.NEXT_PUBLIC_VISUAL_CERTIFICATION === 'true';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Always stale - allows refetchInterval to work (real-time polling)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
  );
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isMounted && process.env.NODE_ENV === 'development' && !isVisualCertification ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
