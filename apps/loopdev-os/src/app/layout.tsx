import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { OrganizationProvider } from "@/providers/OrganizationProvider";
import { BrandProvider } from "@/providers/BrandProvider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import { PermissionProvider } from "@/providers/PermissionProvider";
import { OrganizationRouteGuard } from "@/components/layout/OrganizationRouteGuard";
import { TransitionOverlay } from "@/components/layout/TransitionOverlay";
import { OrganizationThemeProvider } from "@/providers/OrganizationThemeProvider";

// Importamos los estilos globales de nuestro Design System
import "@loopdev/ui/styles/globals.css";
// Los estilos locales de la app (Tailwind)
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopDev OS | Marketing Studio",
  description: "The industrial operating system for modern brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="font-sans antialiased">
        <TransitionOverlay />
        <QueryProvider>
          <AuthProvider>
            <OrganizationProvider>
            <PermissionProvider>
            <BrandProvider>
            <WorkspaceProvider>
            <OrganizationRouteGuard>
              <OrganizationThemeProvider>{children}</OrganizationThemeProvider>
            </OrganizationRouteGuard>
            </WorkspaceProvider>
            </BrandProvider>
            </PermissionProvider>
            </OrganizationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
