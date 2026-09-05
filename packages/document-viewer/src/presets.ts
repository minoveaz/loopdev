import type { DocumentFitMode, DocumentViewerPreset, DocumentViewerPresetName } from './types';

export const DOCUMENT_VIEWER_ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3] as const;

export const DOCUMENT_VIEWER_PRESETS: Record<DocumentViewerPresetName, DocumentViewerPreset> = {
  document: {
    defaultFitMode: 'contain',
    zoomSteps: DOCUMENT_VIEWER_ZOOM_STEPS,
  },
};

export const DOCUMENT_FIT_MODES: readonly DocumentFitMode[] = ['contain', 'width', 'actual'];

export function resolveDocumentViewerPreset(
  preset: DocumentViewerPresetName | DocumentViewerPreset = 'document',
): DocumentViewerPreset {
  return typeof preset === 'string' ? DOCUMENT_VIEWER_PRESETS[preset] : preset;
}
