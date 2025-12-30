import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * @page BlueprintPreview (Legacy Replacement)
 * @description Redirects or informs about the new isolated sandbox.
 */
const BlueprintPreview = () => {
  const { componentName } = useParams();
  const previewUrl = `/sandbox.html?componentName=${componentName}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-10 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md">
        <h1 className="text-xl font-bold text-slate-900 mb-4">Isolated Sandbox</h1>
        <p className="text-slate-600 mb-6 text-sm">
          Este componente ha sido migrado a un motor de ejecución independiente para garantizar fidelidad 1:1 con el diseño original.
        </p>
        <button 
          onClick={() => window.location.href = previewUrl}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          Abrir Sandbox Independiente
        </button>
      </div>
    </div>
  );
};

export default BlueprintPreview;