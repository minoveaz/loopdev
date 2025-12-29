import React from 'react';
import { Box, Stack, Inline } from '@loopdev/ui';
import { Maximize2, ExternalLink } from 'lucide-react';

interface BlueprintCanvasProps {
  componentName: string;
}

/**
 * @component BlueprintCanvas
 * @description Renders the isolated visual preview of a blueprint using an Iframe.
 */
export const BlueprintCanvas = ({ componentName }: BlueprintCanvasProps) => {
  const previewUrl = `/admin/preview/${componentName}`;

  return (
    <Stack gap={0} className="h-full w-full bg-slate-50/50">
      {/* Toolbar del Canvas */}
      <Box paddingX={4} paddingY={2} background="base" className="border-b border-slate-100 shrink-0">
        <Inline justify="between" align="center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Sandbox</span>
          </div>
          <Inline gap={2}>
            <button 
              onClick={() => window.open(previewUrl, '_blank')}
              className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={14} />
            </button>
          </Inline>
        </Inline>
      </Box>

      {/* El Iframe Aislado */}
      <div className="flex-1 relative">
        <iframe 
          src={previewUrl}
          className="absolute inset-0 w-full h-full border-none"
          title={`Preview of ${componentName}`}
        />
      </div>
    </Stack>
  );
};
