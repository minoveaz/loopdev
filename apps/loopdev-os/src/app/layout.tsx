import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { DynamicThemeProvider } from "@loopdev/ui";

// Importamos los estilos globales de nuestro Design System
import "@loopdev/ui/styles/globals.css";
// Los estilos locales de la app (Tailwind)
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_forward,close,progress_activity,dark_mode,light_mode,hub,groups,payments,logout,dashboard,auto_awesome_motion,edit_note,inventory_2,insights,arrow_back,lock,palette,history,error,all_inclusive" />
      </head>
      <body className={`${inter.variable} antialiased font-sans`}>
        <QueryProvider>
          <AuthProvider>
                      <DynamicThemeProvider config={{
                        fontFamily: 'var(--font-inter)',
                        colors: {
                          primary: '#135bec',
                          energy: '#FFD025',
                        }
                      }}>              {children}
            </DynamicThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}