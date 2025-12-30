import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import registry from '@architect-data/blueprint_registry.json';

// Error handling global para diagnóstico en el sandbox
window.onerror = function(message, source, lineno, colno, error) {
  console.error('SANDBOX RUNTIME ERROR:', message, error);
  const root = document.getElementById('sandbox-root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #fff5f5; color: #c53030; border: 2px solid #feb2b2; border-radius: 8px; font-family: monospace; margin: 20px;">
        <h3 style="margin-top: 0">Sandbox Crash</h3>
        <p><strong>Error:</strong> ${message}</p>
        <pre style="font-size: 10px; background: #1a202c; color: white; padding: 10px; border-radius: 4px; overflow: auto;">${error?.stack || 'No stack trace'}</pre>
      </div>
    `;
  }
};

// 3 saltos (../../../) para llegar a la raíz del monorepo desde loopdev/apps/loopdev-os/src/
const components = import.meta.glob('../../../modules/mod-architect/src/blueprints/**/*.tsx');

const SandboxLoader = () => {
  const params = new URLSearchParams(window.location.search);
  const componentName = params.get('componentName');
  const theme = params.get('theme') || 'dark';

  const blueprint = (registry as any[]).find(b => b.name === componentName);

  // Aplicar tema al vuelo
  React.useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }, [theme]);

  if (!blueprint) {
    return <div className="p-10 text-slate-400 font-mono text-center">Component [{componentName}] not found in registry.</div>;
  }

  const TargetComponent = lazy(async () => {
    // Reconstruir la ruta EXACTA que Vite generó en el mapa de glob
    const fullPath = `../../../modules/mod-architect/src/blueprints/${blueprint.filePath}`;
    const importer = components[fullPath];
    
    // El layout siempre está en una ruta conocida relativa a este archivo
    const layoutPath = '../../../modules/mod-architect/src/blueprints/components/layout/SystemLayout.tsx';
    const layoutImporter = components[layoutPath];

    if (!importer) {
      console.error('SandboxLoader: File not found in glob map:', fullPath);
      console.log('Available glob keys:', Object.keys(components));
      return { default: () => (
        <div className="p-10 text-red-500 font-mono">
          <h3 className="font-bold">Path Resolution Error</h3>
          <p>Target: {fullPath}</p>
          <div className="mt-4 p-2 bg-slate-100 rounded text-[10px] text-slate-700">
            <strong>Check:</strong> Does the file exist in <code>modules/mod-architect/src/blueprints/</code>?
          </div>
        </div>
      )};
    }

    // Cargar componente y layout en paralelo
    const [module, layoutModule]: any = await Promise.all([
      importer(),
      layoutImporter ? layoutImporter() : Promise.resolve({ SystemLayout: ({ children }: any) => <>{children}</> })
    ]);
    
    const exportName = blueprint.exports[0] || 'default';
    const Component = module[exportName] || module.default || Object.values(module)[0];
    const SystemLayout = layoutModule.SystemLayout;

    const needsLayout = blueprint.category === 'Pages' && blueprint.name !== 'LandingPage';

    return {
      default: () => (
        <MemoryRouter>
          <div className={needsLayout || blueprint.name === 'LandingPage' ? 'w-full' : 'flex items-center justify-center min-h-screen'}>
            {needsLayout ? (
              <Routes>
                <Route element={<SystemLayout />}>
                  <Route path="*" element={<Component isOpen={true} onClose={() => {}} />} />
                </Route>
              </Routes>
            ) : (
              <Component isOpen={true} onClose={() => {}} />
            )}
          </div>
        </MemoryRouter>
      )
    };
  });

  return (
    <Suspense fallback={<div className="p-10 text-indigo-500 font-bold animate-pulse text-center">Resolving Component: {blueprint.name}...</div>}>
      <TargetComponent />
    </Suspense>
  );
};

const root = ReactDOM.createRoot(document.getElementById('sandbox-root')!);
root.render(<SandboxLoader />);
