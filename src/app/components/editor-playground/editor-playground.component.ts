import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { MapObjectComponent } from '@components/map-object/map-object.component';
import { MapObject } from '@models/map-object.interface';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { ResizeContainerDirective } from '../../directives/resize-container.directive';
import { ResizeContentDirective } from '../../directives/resize-content.directive';
import { ResizeElementDirective } from '../../directives/resize-element.directive';
import { ResizeContainerHeightPipe } from '../../pipes/resize-container-height.pipe';
import { ResizeContainerWidthPipe } from '../../pipes/resize-container-width.pipe';

@Component({
  selector: 'aor-editor-playground',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    CdkDrag,
    MapObjectComponent,
    ResizeContainerDirective,
    ResizeElementDirective,
    ResizeContentDirective,
    ResizeContainerHeightPipe,
    ResizeContainerWidthPipe,
  ],
  templateUrl: './editor-playground.component.html',
  styleUrl: './editor-playground.component.scss',
})
export class EditorPlaygroundComponent implements OnInit {
  @ViewChild('map', { static: true }) map!: ElementRef;

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
      zIndex: 3,
      text: '1',
      fontSize: 16,
      fontColor: 'white',
      rotation: 45,
      keepRatio: false,
      borderOpacity: 1,
      borderType: 'solid',
      fillColor: 'red',
      fillOpacity: 1,
      fontType: 'monospace',
      imageUrl: '',
      textColor: 'red',
      textOpacity: 1,
      type: 'rectangle',
    },
    {
      id: '2',
      position: { x: 300, y: 300 },
      adjustPosition: { x: 300, y: 300 },
      size: { width: 200, height: 100 },
      backgroundColor: 'green',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 0,
      zIndex: 2,
      text: '2',
      fontSize: 16,
      fontColor: 'white',
      rotation: 0,
      keepRatio: false,
      borderOpacity: 1,
      borderType: 'solid',
      fillColor: 'red',
      fillOpacity: 1,
      fontType: 'monospace',
      imageUrl: '',
      textColor: 'red',
      textOpacity: 1,
      type: 'rectangle',
    },
    {
      id: '3',
      position: { x: 500, y: 500 },
      adjustPosition: { x: 500, y: 500 },
      size: { width: 100, height: 100 },
      backgroundColor: 'blue',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 50,
      zIndex: 1,
      text: '3',
      fontSize: 16,
      fontColor: 'white',
      rotation: 0,
      keepRatio: true,
      borderOpacity: 1,
      borderType: 'solid',
      fillColor: 'red',
      fillOpacity: 1,
      fontType: 'monospace',
      imageUrl: '',
      textColor: 'red',
      textOpacity: 1,
      type: 'rectangle',
    },
  ];

  zoomLevel = 1;
  zoomOrigin = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  panZoom!: PanzoomObject;
  selectedElementId: string | null = null;

  private zone = inject(NgZone);

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.panZoom = Panzoom(this.map.nativeElement, {
        maxScale: 5,
        minScale: 0.5,
        canvas: true,
        excludeClass: 'ls-map-object',
        contain: 'outside',
      });
      this.panZoom.pan(0, 0);
      this.panZoom.zoom(1, { animate: true });
    });
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
    element.style.transform = `translate(${mapObject.adjustPosition.x}px, ${mapObject.adjustPosition.y}px)`;
  }

  onDragStartMapObject(event: CdkDragStart, mapObject: MapObject): void {
    // Cuando el arrastre termina, actualiza la posición del objeto del mapa con la posición ajustada
    mapObject.position.x = mapObject.adjustPosition.x;
    mapObject.position.y = mapObject.adjustPosition.y;
  }

  zoom(event: WheelEvent): void {
    const zoom = this.panZoom.zoomWithWheel(event);
    this.zoomLevel = zoom.scale;
  }

  selectElement(elementId: string): void {
    this.selectedElementId = elementId;
  }

  unSelectElement(): void {
    this.selectedElementId = null;
  }

  isElementSelected(elementId: string): boolean {
    return this.selectedElementId === elementId;
  }
}
