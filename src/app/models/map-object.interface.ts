export interface MapObject {
  adjustPosition: { x: number; y: number };
  backgroundColor: string;
  borderColor: string;
  borderOpacity: number;
  borderRadius: number;
  borderType: 'solid' | 'dotted' | 'dashed';
  borderWidth: number;
  fillColor: string;
  fillOpacity: number;
  fontColor: string;
  fontSize: number;
  fontType: 'sans-serif' | 'serif' | 'monospace';
  id: string;
  imageUrl: string;
  keepRatio: boolean;
  position: { x: number; y: number };
  rotation: number;
  size: { height: number; width: number };
  svg?: string;
  text: string;
  textColor: string;
  textOpacity: number;
  type: 'circle' | 'rectangle' | 'polygon' | 'svg' | 'component';
  zIndex: number;
}
