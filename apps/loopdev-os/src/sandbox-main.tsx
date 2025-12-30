import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import registry from '@architect-data/blueprint_registry.json';

// Importamos todos los componentes dinámicamente
const components = import.meta.glob('../../../modules/mod-architect/src/blueprints/**/*.tsx');

const SandboxLoader = () => {
  const params = new URLSearchParams(window.location.search);
  const componentName = params.get('componentName');

  const blueprint = (registry as any[]).find(b => b.name === componentName);

  if (!blueprint) {
    return <div className="p-10 text-slate-400 font-mono text-center">Component [{componentName}] not found.</div>;
  }

  const TargetComponent = lazy(async () => {
    const fullPath = `../../../modules/mod-architect/src/blueprints/${blueprint.filePath}`;
    const importer = components[fullPath];
    const layoutImporter = components['../../../modules/mod-architect/src/blueprints/components/layout/SystemLayout.tsx'];

    const [module, layoutModule]: any = await Promise.all([importer(), layoutImporter()]);
    
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
    <Suspense fallback={<div className="p-10 text-indigo-500 font-bold animate-pulse text-center">Resolving Designer DNA...</div>}>
      <TargetComponent />
    </Suspense>
  );
};

const root = ReactDOM.createRoot(document.getElementById('sandbox-root')!);
root.render(<SandboxLoader />);
