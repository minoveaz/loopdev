import type { DocumentViewerDocument, DocumentViewerLabels } from './types';

export const DOCUMENT_VIEWER_FIXTURE_LABELS: DocumentViewerLabels = {
  toolbarLabel: 'Controles de documento',
  fitGroupLabel: 'Modo de ajuste',
  fitContain: 'Ajustar',
  fitWidth: 'Ancho',
  fitActual: 'Tamaño real',
  zoomOut: 'Alejar documento',
  zoomIn: 'Ampliar documento',
  resetZoom: (percentage) => `${percentage}%`,
  rotate: 'Girar 90 grados',
  crop: 'Recortar documento',
  openInNewTab: 'Abrir en pestaña nueva',
  pdfBadge: 'PDF',
  imageBadge: 'Imagen',
  panHint: 'Arrastra para mover',
  pdfFallbackTitle: 'Vista previa PDF',
  pdfFallbackDescription: 'Abre o descarga el documento para continuar.',
  pdfRenderError: 'No se pudo mostrar la vista previa del PDF.',
  download: 'Descargar documento',
  imageAlt: (name) => `Vista previa de ${name}`,
};

export function createDocumentViewerFixture(
  mimeType: 'image/png' | 'application/pdf' = 'image/png',
): DocumentViewerDocument {
  const extension = mimeType === 'application/pdf' ? 'pdf' : 'png';
  return {
    file: new File(['document-viewer-fixture'], `document-viewer-fixture.${extension}`, {
      type: mimeType,
    }),
    name: `document-viewer-fixture.${extension}`,
    mimeType,
  };
}
