import { ObjectValues } from '@custom-types/utils.type';
import { VisualElement } from './editor/elements/visual-element';
import { ImgDynamicContentData } from './editor/dynamic-elements/img-dynamic-content/img-dynamic-content.component';
import { SvgDynamicContentData } from './editor/dynamic-elements/svg-dynamic-content/svg-dynamic-content.component';

export const ELEMENT_TYPE = {
  SIMPLE: 'simple',
  IMG: 'img',
  SVG: 'svg',
  NOT_FOUND: 'not-found',
  LINEAR_CHART: 'linear-chart',
} as const;

export type ElementType = ObjectValues<typeof ELEMENT_TYPE>;

export const DEFAULT_ELEMENTS: Array<VisualElement<ElementType>> = [
  {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    draggable: true,
    fontColor: 'black',
    fontOpacity: 1,
    fontSize: 12,
    fontType: 'sans-serif',
    height: 100,
    id: null,
    keepRatio: false,
    key: null,
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Default rectangle',
    type: 'simple',
    width: 100,
    x: 0,
    y: 0,
    zIndex: 0,
  },
  {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    draggable: true,
    fontColor: 'black',
    fontOpacity: 1,
    fontSize: 12,
    fontType: 'sans-serif',
    height: 100,
    id: null,
    keepRatio: false,
    key: null,
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Default circle',
    type: 'simple',
    width: 100,
    x: 0,
    y: 0,
    zIndex: 0,
  },
];

export const VISUAL_ELEMENTS: Array<VisualElement<ElementType>> = [
  {
    backgroundColor: 'red',
    borderColor: 'black',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    draggable: true,
    fontColor: 'black',
    fontOpacity: 1,
    fontSize: 12,
    fontType: 'sans-serif',
    height: 100,
    id: '1',
    keepRatio: false,
    key: '1',
    opacity: 1,
    resizable: true,
    rotation: 45,
    selectable: true,
    text: 'Rotated rect',
    type: 'simple',
    width: 100,
    x: 100,
    y: 100,
    zIndex: 0,
  },
  {
    backgroundColor: 'green',
    borderColor: '#006400',
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    draggable: true,
    fontColor: 'blue',
    fontOpacity: 0.7,
    fontRotation: 90,
    fontSize: 18,
    fontType: 'monospace',
    height: 200,
    id: '2',
    keepRatio: false,
    key: '2',
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Green rectangle rotated',
    type: 'simple',
    width: 100,
    x: 300,
    y: 100,
    zIndex: 0,
  },
  {
    backgroundColor: 'rgba(0,0,255,0.5)',
    borderColor: 'rgba(0,0,255,0.8)',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    draggable: true,
    fontColor: 'red',
    fontOpacity: 1,
    fontSize: 8,
    fontType: 'monospace',
    height: 100,
    id: '3',
    keepRatio: true,
    key: '3',
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Circle keep ratio',
    type: 'simple',
    width: 100,
    x: 500,
    y: 500,
    zIndex: 0,
  },
  {
    data: {
      imageUrl: 'https://img-9gag-fun.9cache.com/photo/aN0gO46_460s.jpg',
      objectFit: 'fill',
    } satisfies ImgDynamicContentData,
    draggable: false,
    height: 409,
    id: '4',
    keepRatio: true,
    key: '4',
    opacity: 1,
    resizable: false,
    rotation: 0,
    selectable: false,
    text: 'Image',
    type: 'img',
    width: 460,
    x: 200,
    y: 400,
    zIndex: 0,
  },
  {
    data: {
      fillColor: 'red',
      fillOpacity: 0.7,
      preserveAspectRatio: false,
      strokeColor: 'black',
      strokeWidth: 2,
      svg: '<svg viewBox="0 0 512 512" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><path d="M256,308.26a22.09,22.09,0,1,0,22.09,22.08A22.11,22.11,0,0,0,256,308.26Zm0,33.5a11.42,11.42,0,1,1,11.42-11.42A11.43,11.43,0,0,1,256,341.76Z"/><path d="M297.22,404.43a22.09,22.09,0,1,0-22.07-22.09A22.11,22.11,0,0,0,297.22,404.43Zm0-33.51a11.42,11.42,0,1,1-11.41,11.42A11.44,11.44,0,0,1,297.22,370.92Z"/><path d="M214.78,360.26a22.09,22.09,0,1,0,22.07,22.08A22.11,22.11,0,0,0,214.78,360.26Zm0,33.5a11.42,11.42,0,1,1,11.41-11.42A11.44,11.44,0,0,1,214.78,393.76Z"/><path d="M416.35,229.45v-53.7A21.35,21.35,0,0,0,395,154.42H332a78.53,78.53,0,0,0-151.94,0H117a21.35,21.35,0,0,0-21.33,21.33v53.7a22.2,22.2,0,0,0-14.36,20.71v23.91a5.34,5.34,0,1,0,10.67,0V250.16a11.49,11.49,0,0,1,10.9-11.42H133c.07,0,.12,0,.18,0a11.51,11.51,0,0,1,11.1,11.45v23.91a5.33,5.33,0,1,0,10.66,0V250.16a22.18,22.18,0,0,0-16.61-21.4V197.07h39V290.8a5.33,5.33,0,0,0,5.33,5.33h53.24a32.55,32.55,0,0,0-5.13,5.1l-50.1,62.41a32.34,32.34,0,0,0,25.21,52.57H306.1a32.34,32.34,0,0,0,25.21-52.57l-50.1-62.41a32.55,32.55,0,0,0-5.13-5.1h53.24a5.33,5.33,0,0,0,5.33-5.33V197.07H373.7v31.69a22.18,22.18,0,0,0-16.61,21.4v23.91a5.33,5.33,0,1,0,10.66,0V250.16a11.51,11.51,0,0,1,11.1-11.45c.06,0,.11,0,.18,0h30.11A11.49,11.49,0,0,1,420,250.16v23.91a5.34,5.34,0,1,0,10.67,0V250.16A22.2,22.2,0,0,0,416.35,229.45ZM323,370.32a21.67,21.67,0,0,1-16.9,35.23H205.9A21.67,21.67,0,0,1,189,370.32l50.1-62.41c8.27-10.3,25.53-10.3,33.8,0ZM384.36,228V194l20.8-20.81a10.33,10.33,0,0,1,.52,2.61V228Zm-256.72,0H106.32v-52.2a10.33,10.33,0,0,1,.52-2.61L127.64,194Zm7.54-41.54-20.8-20.8a10.36,10.36,0,0,1,2.6-.53h61a80.39,80.39,0,0,0-.61,9.36v12ZM324,285.47H188v-111a68,68,0,0,1,136,0Zm10.66-99.06v-12a80.39,80.39,0,0,0-.61-9.36h61a10.36,10.36,0,0,1,2.6.53l-20.8,20.8Z"/><path d="M293.06,152H218.94a5.32,5.32,0,0,0-5.33,5.33v34.37a5.32,5.32,0,0,0,5.33,5.33h74.12a5.32,5.32,0,0,0,5.33-5.33V157.37A5.32,5.32,0,0,0,293.06,152Zm-5.33,34.37H224.27V162.7h63.46Z"/></svg>',
    } satisfies SvgDynamicContentData,
    draggable: true,
    height: 100,
    id: '5',
    keepRatio: true,
    key: '5',
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Robot svg',
    type: 'svg',
    width: 100,
    x: 1000,
    y: 500,
    zIndex: 0,
  },
  {
    draggable: true,
    height: 300,
    id: '6',
    keepRatio: false,
    key: '6',
    opacity: 1,
    resizable: true,
    rotation: 0,
    selectable: true,
    text: 'Linear chart 1',
    type: 'linear-chart',
    width: 300,
    x: 550,
    y: 100,
    zIndex: 0,
  },
];
