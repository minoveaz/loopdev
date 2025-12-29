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
    console.log('BlueprintPreview: Mounted for component:', componentName);
    
    // 1. Inyectar Configuración de Tailwind del Diseñador (Primero para que el CDN la tome)
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.tailwind = {
        config: {
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
      }
    `;
    document.head.appendChild(configScript);

    // 2. Inyectar Tailwind CDN
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(script);

    // 3. Inyectar Estilos Globales y Centrado
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background-color: transparent;
      }
      /* Forzar que componentes 'fixed' se comporten como relativos para poder centrarlos */
      .fixed, [class*="fixed"] {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
        left: auto !important;
        transform: none !important;
        margin: 0 auto;
      }
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
  }, [componentName]);

  // Use the @blueprints alias configured in vite.config.ts
  const TargetComponent = componentName === 'ActivitySidebar' 
    ? lazy(() => import('@blueprints/components/layout/ActivitySidebar').then(m => {
        console.log('BlueprintPreview: Component loaded successfully');
        return { default: m.ActivitySidebar };
      }).catch(err => {
        console.error('BlueprintPreview: Error loading component:', err);
        throw err;
      }))
    : null;

  if (!TargetComponent) {
    return <div className="p-10 text-slate-400 font-mono text-center">Component [{componentName}] not found or not mapped.</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      <Suspense fallback={<div className="p-10 text-indigo-500 font-bold animate-pulse text-center">Loading Blueprint...</div>}>
        <TargetComponent isOpen={true} onClose={() => {}} />
      </Suspense>
    </div>
  );
};

export default BlueprintPreview;
