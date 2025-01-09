/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VisualElement<T = any, D = any> {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderStyle?: BorderStyle;
  borderWidth?: number;
  data?: D;
  draggable: boolean;
  fontColor?: string;
  fontOpacity?: number;
  fontRotation?: number;
  fontSize?: number;
  fontType?: FontType;
  height: number;
  id: string | null;
  keepRatio: boolean;
  key: string | null;
  opacity: number;
  resizable: boolean;
  rotation: number;
  selectable: boolean;
  text: string;
  type: T;
  width: number;
  x: number;
  y: number;
  zIndex: number;
}

export type BorderStyle = 'none' | 'dashed' | 'dotted' | 'solid';

export type FontType = 'monospace' | 'sans-serif' | 'serif';
