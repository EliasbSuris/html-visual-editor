export interface MapObject {
  id: string;

  type: 'circle' | 'rectangle' | 'polygon' | 'svg' | 'component';

  svg?: string;

  position: {
    x: number;

    y: number;
  };
  imageUrl: string; // dudo si pasarla en Base64 para no dependencias externas
  fillColor: string;

  fillOpacity: number;

  borderColor: string;

  // borderThickness: number;

  borderType: 'solid' | 'dotted' | 'dashed';

  borderOpacity: number;

  text: string;

  textColor: string;

  textOpacity: number;

  fontSize: number;

  fontType: 'sans-serif' | 'serif' | 'monospace';

  rotation: number;

  // added
  backgroundColor: string;
  adjustPosition: {
    x: number;

    y: number;
  };
  size: {
    height: number;
    width: number;
  };
  borderWidth: number;
  borderRadius: number;
  zIndex: number;
  fontColor: string;
  keepRatio: boolean;
}
