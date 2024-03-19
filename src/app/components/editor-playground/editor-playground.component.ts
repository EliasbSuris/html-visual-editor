import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, Input, NgZone, ViewChild, inject } from '@angular/core';
import { MapObjectComponent } from '@components/map-object/map-object.component';
import { PanZoomVisorDirective } from '@directives/pan-zoom-visor.directive';
import { ResizeContainerDirective } from '@directives/resize-container.directive';
import { ResizeContentDirective } from '@directives/resize-content.directive';
import { ResizeElementDirective } from '@directives/resize-element.directive';
import { MapObject } from '@models/map-object.interface';
import { PanzoomObject } from '@panzoom/panzoom';
import { ResizeContainerHeightPipe } from '@pipes/resize-container-height.pipe';
import { ResizeContainerWidthPipe } from '@pipes/resize-container-width.pipe';
import { MAP_OBJECTS } from './mock-data';
import { PanZoomCanvasDirective } from '@directives/pan-zoom-canvas.directive';
import { CanvasOptions } from '@models/canvas-options';
import { VisorOptions } from '@models/visor-options';

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
    PanZoomVisorDirective,
    PanZoomCanvasDirective,
    ResizeContainerHeightPipe,
    ResizeContainerWidthPipe,
  ],
  templateUrl: './editor-playground.component.html',
  styleUrl: './editor-playground.component.scss',
})
export class EditorPlaygroundComponent {
  @Input()
  canvasOptions!: CanvasOptions;
  @Input()
  visorOptions!: VisorOptions;

  @ViewChild('map', { static: true }) map!: ElementRef;

  mapObjects: MapObject[] = MAP_OBJECTS;

  zoomLevel = 1;
  zoomOrigin = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  panZoom!: PanzoomObject;
  selectedElementId: string | null = null;

  private zone = inject(NgZone);

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

  updateZoomLevel(newZoomLevel: number): void {
    this.zoomLevel = newZoomLevel;
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
