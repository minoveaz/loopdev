import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import registry from '@architect-data/blueprint_registry.json';

// Error handling global para diagnóstico
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

// 3 saltos (../../../) para llegar a la carpeta de módulos desde loopdev/apps/loopdev-os/src/
const components = import.meta.glob('../../../modules/mod-architect/src/**/*.tsx');

const SandboxLoader = () => {
  const params = new URLSearchParams(window.location.search);
  const componentName = params.get('componentName');
  const theme = params.get('theme') || 'dark';

  // Intentar buscar el blueprint en el registro
  const blueprint = (registry as any[]).find(b => b.name === componentName) || 
                    (componentName === 'OFFICIAL: ActionMenu' ? { name: 'OFFICIAL: ActionMenu', filePath: '../components/common/ActionMenu/index.tsx', exports: ['ActionMenu'], category: 'Official' } : null);

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
    return <div className="p-10 text-slate-400 font-mono text-center">Component [{componentName}] not found.</div>;
  }

  const TargetComponent = lazy(async () => {
    // Reconstruir la ruta exacta
    const isOfficial = blueprint.filePath.startsWith('../');
    const fullPath = isOfficial 
      ? `../../../modules/mod-architect/src/${blueprint.filePath.replace('../', '')}`
      : `../../../modules/mod-architect/src/blueprints/${blueprint.filePath}`;
    
    const importer = components[fullPath];
    const layoutPath = '../../../modules/mod-architect/src/blueprints/components/layout/SystemLayout.tsx';
    const layoutImporter = components[layoutPath];

    if (!importer) {
      console.error('SandboxLoader: File not found in glob map:', fullPath);
      return { default: () => (
        <div className="p-10 text-red-500 font-mono">
          <h3 className="font-bold">Path Resolution Error</h3>
          <p>Target: {fullPath}</p>
        </div>
      )};
    }

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
          <div className={needsLayout || blueprint.name === 'LandingPage' 
            ? 'w-full min-h-screen' 
            : 'w-full min-h-screen flex items-center justify-center p-8'
          }>
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
    <Suspense fallback={<div className="p-10 text-indigo-500 font-bold animate-pulse text-center">Resolving Designer DNA...</div>}>
      <TargetComponent />
    </Suspense>
  );
};

const root = ReactDOM.createRoot(document.getElementById('sandbox-root')!);
root.render(<SandboxLoader />);
