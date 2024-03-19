export interface VisorOptions {
  initialZoom: number;
  initialPan: { x: number; y: number };
  maxZoom: number;
  minZoom: number;
  excludeClass: string;
  disableZoom: boolean;
  disablePan: boolean;
  zoomFactor: number;
}
