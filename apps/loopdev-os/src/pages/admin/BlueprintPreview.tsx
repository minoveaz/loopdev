import React, { Suspense, lazy, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * @page BlueprintPreview
 * @description The Sandbox Frame. 
 * Emulates the designer's environment (Tailwind + Custom Styles).
 */
const BlueprintPreview = () => {
  const { componentName } = useParams();

  useEffect(() => {
    // 1. Inyectar Tailwind CDN
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(script);

    // 2. Inyectar Configuración de Tailwind del Diseñador
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              primary: { DEFAULT: '#135bec', dark: '#0b46be' },
              energy: { DEFAULT: '#fbbf24' },
              'surface-dark': '#181b21',
              'background-dark': '#0f1115',
              'border-dark': '#2d3442',
            }
          }
        }
      }
    `;
    document.head.appendChild(configScript);

    // 3. Inyectar Estilos Globales
    const style = document.createElement('style');
    style.innerHTML = `
      .bg-grid-pattern-custom {
        background-size: 40px 40px;
        background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
      }
      .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    `;
    document.head.appendChild(style);

    // 4. Inyectar Material Symbols
    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
    document.head.appendChild(link);

    document.documentElement.classList.add('dark');
  }, []);

  // Use absolute clean path for dynamic import
  const TargetComponent = componentName === 'ActivitySidebar' 
    ? lazy(() => import('@mock-loopdev/components/layout/ActivitySidebar').then(m => ({ default: m.ActivitySidebar })))
    : null;

  if (!TargetComponent) {
    return <div className="p-10 text-slate-400 font-mono">Component [{componentName}] not found.</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      <Suspense fallback={<div className="p-10 text-indigo-500">Loading Sandbox...</div>}>
        <TargetComponent isOpen={true} onClose={() => {}} />
      </Suspense>
    </div>
  );
};

export default BlueprintPreview;