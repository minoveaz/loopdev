import type { DocumentViewerDocument, DocumentViewerLabels } from './types';

const PDF_FIXTURE = `%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Count 1/Kids[3 0 R]>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>
endobj
4 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>
endobj
5 0 obj
<</Length 47>>
stream
BT /F1 24 Tf 72 720 Td (Document viewer fixture) Tj ET
endstream
endobj
trailer
<</Root 1 0 R>>
%%EOF`;

const PNG_FIXTURE_BYTES = Uint8Array.from([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1,
  8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 248, 207,
  192, 240, 31, 0, 5, 0, 1, 255, 137, 153, 61, 29, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66,
  96, 130,
]);

const JPEG_FIXTURE_BYTES = Uint8Array.from([
  255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 255, 219, 0,
  67, 0, 8, 6, 6, 7, 6, 5, 8, 7, 7, 7, 9, 9, 8, 10, 12, 20, 13, 12, 11, 11, 12, 25, 18,
  19, 15, 20, 29, 26, 31, 30, 29, 26, 28, 28, 32, 36, 46, 39, 32, 34, 44, 35, 28, 28, 40,
  55, 41, 44, 48, 49, 52, 52, 52, 31, 39, 57, 61, 56, 50, 60, 46, 51, 52, 50, 255, 192, 0,
  17, 8, 0, 1, 0, 1, 3, 1, 17, 0, 2, 17, 1, 3, 17, 1, 255, 196, 0, 20, 0, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63,
  0, 255, 217,
]);

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
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf' = 'image/png',
): DocumentViewerDocument {
  const extension = mimeType === 'application/pdf' ? 'pdf' : 'png';
  const bytes =
    mimeType === 'application/pdf'
      ? new TextEncoder().encode(PDF_FIXTURE)
      : mimeType === 'image/jpeg'
        ? JPEG_FIXTURE_BYTES
        : PNG_FIXTURE_BYTES;
  const resolvedExtension = mimeType === 'image/jpeg' ? 'jpg' : extension;
  return {
    file: new File([bytes], `document-viewer-fixture.${resolvedExtension}`, {
      type: mimeType,
    }),
    name: `document-viewer-fixture.${resolvedExtension}`,
    mimeType,
  };
}

export function createDocumentViewerFixtures() {
  return {
    pdf: createDocumentViewerFixture('application/pdf'),
    jpeg: createDocumentViewerFixture('image/jpeg'),
    png: createDocumentViewerFixture('image/png'),
  };
}
