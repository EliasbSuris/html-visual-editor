import { ObjectValues } from '@custom-types/utils.type';

export type CanvasCursor = 'crosshair' | 'default' | 'move' | 'pointer' | null;

export const CANVAS_MODES = {
  /** Apply pointer-events: none to every element. This allows canvas DIV to capture a user click on any point. Used to create a element on the point/cell clicked. */
  CLICKABLE: 'CLICKABLE',
  /** Normal mode elements can be selected, dragged & resized. */
  EDITABLE: 'EDITABLE',
  /** None editable mode elements can't be selected, dragged or resized. */
  NONE_EDITABLE: 'NONE_EDITABLE',
} as const;

export type CanvasMode = ObjectValues<typeof CANVAS_MODES>;

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasOptions {
  backgroundColor: string;
  /** Canvas CSS cursor style. */
  cursor: CanvasCursor;
  /** Canvas element min size. */
  elementMinSize: number;
  /** Width of the grid cell. */
  gridX: number;
  /** Height of the grid cell. */
  gridY: number;
  /** If true grid will be used on drag & drop and resizing elements. */
  hasGrid: boolean;
  /** Canvas height. */
  height: number;
  /** Canvas mode. */
  mode: CanvasMode;
  /** Whether to show or not the grid(Only visual effect). */
  showGrid: boolean;
  /** Canvas width. */
  width: number;
}
