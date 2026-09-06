export type DocumentViewerMimeType = 'image/jpeg' | 'image/png' | 'application/pdf';

export type DocumentFitMode = 'contain' | 'width' | 'actual';

export type DocumentViewerPresetName = 'document';

export interface DocumentViewerDocument {
  file: File;
  name: string;
  mimeType: DocumentViewerMimeType;
}

export interface DocumentViewerLabels {
  toolbarLabel: string;
  fitGroupLabel: string;
  fitContain: string;
  fitWidth: string;
  fitActual: string;
  zoomOut: string;
  zoomIn: string;
  resetZoom: (percentage: number) => string;
  rotate: string;
  crop: string;
  openInNewTab: string;
  pdfBadge: string;
  imageBadge: string;
  panHint: string;
  pdfFallbackTitle: string;
  pdfFallbackDescription: string;
  pdfRenderError: string;
  download: string;
  imageAlt?: (name: string) => string;
}

export interface DocumentViewerPreset {
  defaultFitMode: DocumentFitMode;
  zoomSteps: readonly number[];
}

export interface DocumentViewerProps {
  document: DocumentViewerDocument;
  labels: DocumentViewerLabels;
  preset?: DocumentViewerPresetName | DocumentViewerPreset;
  className?: string;
  initialFitMode?: DocumentFitMode;
  fitMode?: DocumentFitMode;
  onFitModeChange?: (fitMode: DocumentFitMode) => void;
  onCrop?: () => void;
  cropLabel?: string;
}

export interface DocumentFitResult {
  scale: number;
  width: number;
  height: number;
}
