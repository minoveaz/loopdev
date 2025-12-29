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
    <Stack gap={0} className="h-full w-full">
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
