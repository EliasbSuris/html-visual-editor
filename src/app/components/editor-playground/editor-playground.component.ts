import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { JsonPipe, NgStyle } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild, inject, signal } from '@angular/core';
import { MapObjectComponent } from '@components/map-object/map-object.component';

interface Point {
  x: number;
  y: number;
}

interface MapObject {
  id: string;
  position: Point;
  size: { width: number; height: number };
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  borderRadius?: number;
  zIndex?: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  adjustPosition: Point;
  rotation?: number;
}

@Component({
  selector: 'aor-editor-playground',
  standalone: true,
  imports: [NgStyle, CdkDrag, MapObjectComponent, JsonPipe],
  templateUrl: './editor-playground.component.html',
  styleUrl: './editor-playground.component.scss',
})
export class EditorPlaygroundComponent {
  @ViewChild('zoomContainer') zoomContainer!: ElementRef;
  @ViewChild('visor') visor!: ElementRef;
  readonly renderer = inject(Renderer2);

  mapObjects: MapObject[] = [
    {
      id: '1',
      position: { x: 100, y: 100 },
      adjustPosition: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      backgroundColor: 'red',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '1',
      fontSize: 16,
      fontColor: 'white',
      rotation: 45,
    },
    {
      id: '2',
      position: { x: 300, y: 300 },
      adjustPosition: { x: 300, y: 300 },
      size: { width: 200, height: 100 },
      backgroundColor: 'green',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '2',
      fontSize: 16,
      fontColor: 'white',
    },
    {
      id: '3',
      position: { x: 500, y: 500 },
      adjustPosition: { x: 500, y: 500 },
      size: { width: 100, height: 100 },
      backgroundColor: 'blue',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '3',
      fontSize: 16,
      fontColor: 'white',
    },
  ];

  zoomLevel = 1;
  zoomOrigin = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  adjustZoom(event: WheelEvent, element: HTMLDivElement): void {
    const delta = event.deltaY;
    // max zoom level 4 min zoom level 0.5
    if (delta > 0 && this.zoomLevel <= 0.5) {
      return;
    }

    if (delta < 0 && this.zoomLevel >= 4) {
      return;
    }

    this.zoomLevel = delta > 0 ? this.zoomLevel - 0.1 : this.zoomLevel + 0.1;

    const targetElement = event.target as Element;
    const style = window.getComputedStyle(targetElement);
    const matrix = new DOMMatrixReadOnly(style.transform);

    // if (matrix?.is2D) {
    //   const x = matrix.e;
    //   const y = matrix.f;
    //   console.log('translate X', x, event.offsetX);
    //   console.log(event.clientX);
    //   console.log('translate Y', y, event.offsetY);
    //   console.log(event.clientY);
    //   console.log('zoom factor', this.zoomLevel);
    //   this.zoomOrigin.y = +y + event.offsetY;
    //   this.zoomOrigin.x = +x + event.offsetX;
    // } else {
    //   // Ajusta el origen del zoom basándote en la posición del ratón
    //   this.zoomOrigin.x = event.offsetX;
    //   this.zoomOrigin.y = event.offsetY;
    // }

    // 36px left paddings
    // 84px header height and paddings
    this.zoomOrigin.x = event.clientX - 36;
    this.zoomOrigin.y = event.clientY - 84;

    this.renderer.setStyle(element, 'transform', `scale(${this.zoomLevel})`);
    this.renderer.setStyle(element, 'transform-origin', `${this.zoomOrigin.x}px ${this.zoomOrigin.y}px`);
    // console.log(this.zoomOrigin);
  }

  moveObject(event: any): void {
    // console.log(event);
  }

  onDrag(event: CdkDragMove<any>): void {
    // console.log(event, event.source.data);
    // Calcula la distancia movida ajustada por el nivel de zoom
    const adjustedX = event.distance.x / this.zoomLevel;
    const adjustedY = event.distance.y / this.zoomLevel;

    // Actualiza la posición ajustada basándote en la posición inicial más la distancia movida
    this.adjustedPosition.x = this.position.x + adjustedX;
    this.adjustedPosition.y = this.position.y + adjustedY;

    // Aplica la transformación al elemento basándote en la posición ajustada acumulada
    const element = event.source.element.nativeElement;
    this.zoomContainer.nativeElement.style.left = `${event.source.getFreeDragPosition().x}px`;
    this.zoomContainer.nativeElement.style.top = `${event.source.getFreeDragPosition().y}px`;
    element.style.transform = `translate(${0}px, ${0}px)`;

    console.log(this.visor.nativeElement.offsetWidth / 2);

    // La parte izquierda del zoomContainer no puede ser mayor al centro del visor y la parte superior no puede ser mayor a la mitad del visor. Usa
    if (event.source.getFreeDragPosition().x > this.visor.nativeElement.offsetWidth / 2) {
      this.zoomContainer.nativeElement.style.left = `${this.visor.nativeElement.offsetWidth / 2}px`;
    }
    if (event.source.getFreeDragPosition().y > this.visor.nativeElement.offsetHeight / 2) {
      this.zoomContainer.nativeElement.style.top = `${this.visor.nativeElement.offsetHeight / 2}px`;
    }

    // if (event.source.getFreeDragPosition().x > 0) {
    //   this.zoomContainer.nativeElement.style.left = `${0}px`;
    // }
    // if (event.source.getFreeDragPosition().y > 0) {
    //   this.zoomContainer.nativeElement.style.top = `${0}px`;
    // }

    // if (event.source.getFreeDragPosition().x < this.visor.nativeElement.offsetWidth - this.zoomContainer.nativeElement.offsetWidth) {
    //   this.zoomContainer.nativeElement.style.left = `${this.visor.nativeElement.offsetWidth - this.zoomContainer.nativeElement.offsetWidth}px`;
    // }
    // if (event.source.getFreeDragPosition().y < this.visor.nativeElement.offsetHeight - this.zoomContainer.nativeElement.offsetHeight) {
    //   this.zoomContainer.nativeElement.style.top = `${this.visor.nativeElement.offsetHeight - this.zoomContainer.nativeElement.offsetHeight}px`;
    // }
  }

  onDragEnd(event: CdkDragEnd): void {}

  onDragStart(event: CdkDragStart): void {
    // Cuando el arrastre comienza, guarda la posición actual como la posición inicial
    this.position.x = this.adjustedPosition.x;
    this.position.y = this.adjustedPosition.y;
  }

  onDragMapObject(event: CdkDragMove<any>, mapObject: MapObject): void {
    // Calcula la distancia movida ajustada por el nivel de zoom
    const adjustedX = event.distance.x / this.zoomLevel;
    const adjustedY = event.distance.y / this.zoomLevel;

    // Actualiza la posición ajustada basándote en la posición inicial más la distancia movida
    mapObject.adjustPosition.x = mapObject.position.x + adjustedX;
    mapObject.adjustPosition.y = mapObject.position.y + adjustedY;

    // Aplica la transformación al elemento basándote en la posición ajustada acumulada
    const element = event.source.element.nativeElement;
    element.style.transform = `translate(${mapObject.adjustPosition.x}px, ${mapObject.adjustPosition.y}px) rotate(${mapObject.rotation || 0}deg)`;
  }

  onDragStartMapObject(event: CdkDragStart, mapObject: MapObject): void {
    // Cuando el arrastre termina, actualiza la posición del objeto del mapa con la posición ajustada
    mapObject.position.x = mapObject.adjustPosition.x;
    mapObject.position.y = mapObject.adjustPosition.y;
  }
}
