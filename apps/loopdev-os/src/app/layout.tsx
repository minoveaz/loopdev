import type { Metadata } from 'next';
import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OrganizationProvider } from '@/providers/OrganizationProvider';
import { BrandProvider } from '@/providers/BrandProvider';
import { WorkspaceProvider } from '@/providers/WorkspaceProvider';
import { PermissionProvider } from '@/providers/PermissionProvider';
import { OrganizationRouteGuard } from '@/components/layout/OrganizationRouteGuard';
import { TransitionOverlay } from '@/components/layout/TransitionOverlay';
import { OrganizationThemeProvider } from '@/providers/OrganizationThemeProvider';
import { AppFeedbackProvider } from '@/providers/AppFeedbackProvider';
import { SimulationProvider } from '@/providers/SimulationProvider';
import { PlatformRuntimeProvider } from '@/providers/PlatformRuntimeProvider';

// Importamos los estilos globales de nuestro Design System
import '@loopdev/ui/styles/globals.css';
// Los estilos locales de la app (Tailwind)
import './globals.css';

export const metadata: Metadata = {
  title: 'LoopDev OS | Marketing Studio',
  description: 'The industrial operating system for modern brands.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <TransitionOverlay />
        <AppFeedbackProvider>
          <SimulationProvider>
            <QueryProvider>
              <AuthProvider>
                <OrganizationProvider>
                  <PermissionProvider>
                    <BrandProvider>
                      <WorkspaceProvider>
                        <PlatformRuntimeProvider>
                          <OrganizationRouteGuard>
                            <OrganizationThemeProvider>{children}</OrganizationThemeProvider>
                          </OrganizationRouteGuard>
                        </PlatformRuntimeProvider>
                      </WorkspaceProvider>
                    </BrandProvider>
                  </PermissionProvider>
                </OrganizationProvider>
              </AuthProvider>
            </QueryProvider>
          </SimulationProvider>
        </AppFeedbackProvider>
      </body>
    </html>
  );
}
