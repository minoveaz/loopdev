import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import registry from '@architect-data/blueprint_registry.json';

/**
 * @page BlueprintPreview
 * @description The Sandbox Frame. 
 * Resolves and renders ANY blueprint dynamically from the registry.
 */
const BlueprintPreview = () => {
  const { componentName } = useParams();

  // 1. Encontrar metadatos del componente en el registry
  const blueprint = useMemo(() => {
    return (registry as any[]).find(b => b.name === componentName);
  }, [componentName]);

  useEffect(() => {
    if (!blueprint) return;
    console.log('BlueprintPreview: Loading', blueprint.name, 'from', blueprint.filePath);
    
    // Inyectar Fuentes e Iconos (Basado en lo que detectó el script)
    const fontLink = document.createElement('link');
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(fontLink);

    const materialLink = document.createElement('link');
    materialLink.rel = "stylesheet";
    materialLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    document.head.appendChild(materialLink);

    // Inyectar Configuración de Tailwind del Diseñador
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.tailwind = {
        config: {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: { DEFAULT: '#135bec', dark: '#0b46be', light: '#4f85f0' },
                accent: { DEFAULT: '#FFD025', hover: '#eac026' },
                energy: { DEFAULT: '#FFD025', vivid: '#FFD025', subtle: '#fbbf24' },
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

    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(script);

    const style = document.createElement('style');
    style.innerHTML = `
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background-color: transparent;
        font-family: 'Inter', sans-serif;
      }
      .fixed, [class*="fixed"] {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
        left: auto !important;
        transform: none !important;
        margin: 0 auto;
      }
      .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    `;
    document.head.appendChild(style);

    document.documentElement.classList.add('dark');
  }, [blueprint]);

  // 2. Cargador Dinámico Universal (Usando Glob para que Vite encuentre los archivos)
  const TargetComponent = useMemo(() => {
    if (!blueprint) return null;

    // Vite pre-carga las rutas de todos los archivos .tsx en la carpeta de blueprints
    const components = import.meta.glob('../../../../../modules/mod-architect/src/blueprints/**/*.tsx');

    return lazy(() => {
      // Reconstruir la ruta completa que Vite reconoce en el glob
      const fullPath = `../../../../../modules/mod-architect/src/blueprints/${blueprint.filePath}`;
      const importer = components[fullPath];

      if (!importer) {
        console.error('Path not found in glob:', fullPath);
        throw new Error(`File ${blueprint.filePath} not found`);
      }

      return (importer() as Promise<any>).then(m => {
        const exportName = blueprint.exports[0] || 'default';
        const component = m[exportName] || m.default || Object.values(m)[0];
        return { default: component };
      });
    });
  }, [blueprint]);

  if (!blueprint) {
    return <div className="p-10 text-slate-400 font-mono text-center">Blueprint [{componentName}] not registered.</div>;
  }

  if (!TargetComponent) {
    return <div className="p-10 text-rose-500 font-mono text-center">Failed to resolve component factory.</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      <Suspense fallback={<div className="p-10 text-indigo-500 font-bold animate-pulse text-center">Resolving Blueprint: {blueprint.name}...</div>}>
        <TargetComponent isOpen={true} onClose={() => {}} />
      </Suspense>
    </div>
  );
};

export default BlueprintPreview;