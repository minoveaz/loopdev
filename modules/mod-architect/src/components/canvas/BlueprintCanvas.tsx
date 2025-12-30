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
  // Ahora apuntamos al entry point independiente para aislamiento total
  const previewUrl = `/sandbox.html?componentName=${componentName}`;

  return (
    <Stack gap={0} className="h-full w-full">
      {/* El Iframe Aislado - Ahora con sandbox real */}
      <div className="flex-1 relative">
        <iframe 
          src={previewUrl}
          className="absolute inset-0 w-full h-full border-none bg-white"
          title={`Preview of ${componentName}`}
        />
      </div>
    </Stack>
  );
};
