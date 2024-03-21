import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ElementContainerComponent } from '@components/element-container/element-container.component';
import { ElementContentComponent } from '@components/element-content/element-content.component';
import { PanZoomCanvasDirective } from '@directives/pan-zoom-canvas.directive';
import { PanZoomVisorDirective } from '@directives/pan-zoom-visor.directive';
import { ResizeContainerDirective } from '@directives/resize-container.directive';
import { ResizeContentDirective } from '@directives/resize-content.directive';
import { ResizeElementDirective, ResizeEvent } from '@directives/resize-element.directive';
import { CanvasOptions } from '@models/canvas-options';
import { MapObject } from '@models/map-object.interface';
import { VisorOptions } from '@models/visor-options';
import { PanzoomObject } from '@panzoom/panzoom';
import { ResizeContainerHeightPipe } from '@pipes/resize-container-height.pipe';
import { ResizeContainerWidthPipe } from '@pipes/resize-container-width.pipe';

@Component({
  selector: 'aor-editor-playground',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    CdkDrag,
    ElementContainerComponent,
    ElementContentComponent,
    ResizeContainerDirective,
    ResizeElementDirective,
    ResizeContentDirective,
    PanZoomVisorDirective,
    PanZoomCanvasDirective,
    ResizeContainerHeightPipe,
    ResizeContainerWidthPipe,
    MatButton,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './editor-playground.component.html',
  styleUrl: './editor-playground.component.scss',
})
export class EditorPlaygroundComponent {
  @Input()
  canvasOptions!: CanvasOptions;
  @Input()
  visorOptions!: VisorOptions;
  @Input()
  mapObjects: MapObject[] = [];
  @Output()
  elementMoved = new EventEmitter<MapObject>();
  @Output()
  elementResized = new EventEmitter<MapObject>();

  @ViewChild('map', { static: true }) map!: ElementRef;
  @ViewChild(PanZoomVisorDirective)
  private panZoomDirective!: PanZoomVisorDirective;

  zoomLevel = 1;
  zoomOrigin = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  panZoom!: PanzoomObject;
  selectedElementId: string | null = null;

  private zone = inject(NgZone);

  onDragMapObject(event: CdkDragMove<MapObject>): void {
    const mapObject = event.source.data;
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

  onDragEnd(event: CdkDragEnd<MapObject>): void {
    const mapObject = event.source.data;
    mapObject.position.x = mapObject.adjustPosition.x;
    mapObject.position.y = mapObject.adjustPosition.y;
    this.elementMoved.next(mapObject);
  }

  onElementResized({ data, size: { height, width } }: ResizeEvent<MapObject>): void {
    this.elementResized.next({ ...data, size: { height, width } });
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

  resetPanzoom(): void {
    this.panZoomDirective.reset();
  }
}
