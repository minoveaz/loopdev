import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";

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
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}