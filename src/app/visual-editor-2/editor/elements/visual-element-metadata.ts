import { VisualEditorState } from '../visual-editor-state';

export interface VisualElementMetadata {
  selectedElementKey: string | null;
  currentZoomLevel: number;
}

export function convertToVisualElementMetadata(visualEditorState: VisualEditorState): VisualElementMetadata {
  return {
    currentZoomLevel: visualEditorState.currentZoomLevel,
    selectedElementKey: visualEditorState.selectedElementKey,
  };
}
