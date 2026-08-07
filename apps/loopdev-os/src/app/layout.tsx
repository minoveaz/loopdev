import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { OrganizationProvider } from "@/providers/OrganizationProvider";
import { BrandProvider } from "@/providers/BrandProvider";
import { OrganizationRouteGuard } from "@/components/layout/OrganizationRouteGuard";
import { DynamicThemeProvider } from "@loopdev/ui";

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
        <QueryProvider>
          <AuthProvider>
            <OrganizationProvider>
            <BrandProvider>
            <OrganizationRouteGuard>
                      <DynamicThemeProvider config={{
                        fontFamily: 'var(--lpd-font-sans)',
                        colors: {
                          primary: '#135bec',
                          energy: '#FFD025',
                        }
                      }}>              {children}
            </DynamicThemeProvider>
            </OrganizationRouteGuard>
            </BrandProvider>
            </OrganizationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
