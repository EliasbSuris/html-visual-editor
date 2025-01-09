import { Component, ViewChild } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ElementActionBarDefDirective } from './editor/action-bar/element-action-bar-def.directive';
import { ElementActionBarComponent } from './editor/action-bar/element-action-bar/element-action-bar.component';
import { CANVAS_MODES, CanvasMode, CanvasOptions, CanvasPoint } from './editor/canvas/canvas-options';
import { VisualElement } from './editor/elements/visual-element';
import { VisualEditorPlaceholderDefDirective } from './editor/placeholder/visual-editor-placeholder-def.directive';
import { VisorOptions } from './editor/visor/visor-options';
import { VisualEditorComponent } from './editor/visual-editor.component';
import { DEFAULT_ELEMENTS, ElementType, VISUAL_ELEMENTS } from './visual-elements-mock-data';

const MODES: Array<{ text: string; mode: CanvasMode }> = [
  {
    text: 'Editable',
    mode: 'EDITABLE',
  },
  {
    text: 'Clickable',
    mode: 'CLICKABLE',
  },
  {
    text: 'None editable',
    mode: 'NONE_EDITABLE',
  },
];

@Component({
  selector: 'aor-visual-editor-2',
  imports: [
    VisualEditorComponent,
    ElementActionBarComponent,
    ElementActionBarDefDirective,
    VisualEditorPlaceholderDefDirective,
    MatMiniFabButton,
    MatIcon,
  ],
  templateUrl: './visual-editor-2.page.html',
  styleUrl: './visual-editor-2.page.scss',
})
export class VisualEditor2Page {
  @ViewChild(VisualEditorComponent)
  visualEditor!: VisualEditorComponent;
  MODES = MODES;
  CANVAS_MODES = CANVAS_MODES;

  canvasOptions: CanvasOptions = {
    backgroundColor: 'rgb(68, 140, 198)',
    cursor: null,
    elementMinSize: 20,
    gridX: 50,
    gridY: 50,
    hasGrid: false,
    height: 4000,
    mode: CANVAS_MODES.EDITABLE,
    showGrid: true,
    width: 4000,
  };
  visorOptions: VisorOptions = {
    disablePan: false,
    disableZoom: false,
    initialPan: { x: 0, y: 0 },
    initialZoom: 1,
    maxZoom: 5,
    minZoom: 0.125,
    zoomFactor: 0.5,
  };

  defaultElements: Array<VisualElement<ElementType>> = DEFAULT_ELEMENTS;

  elements: Array<VisualElement<ElementType>> = VISUAL_ELEMENTS;

  selectedElement: VisualElement | null = null;
  selectedDefaultElement: VisualElement | null = null;
  loading = false;

  currentId = 1000;

  onClickDeleteAction(element: VisualElement): void {
    console.log('DELETE ACTION', element);
  }
  onClickEditAction(element: VisualElement): void {
    console.log('EDIT ACTION', element);
  }
  onClickDuplicateAction(element: VisualElement): void {
    console.log('DUPLICATE ACTION', element);
  }

  onElementSelected(elementKey: string | null): void {
    if (!elementKey) {
      console.log('ELEMENT UNSELECTED');
      this.selectedElement = null;
      return;
    }
    this.selectedElement = this.elements.find(element => element.key === elementKey) ?? null;
    console.log('ELEMENT SELECTED', this.selectedElement);
  }

  public onElementMoved(movedElement: VisualElement<ElementType>): void {
    const element = this.elements.find(element => element.key === movedElement.key);
    if (!element) return;
    console.log('ELEMENT MOVED FROM', element.x, element.y);
    console.log('ELEMENT MOVED TO', movedElement.x, movedElement.y);
    this.updateElement(movedElement);
  }

  public onElementResized(resizedElement: VisualElement<ElementType>): void {
    const element = this.elements.find(element => element.key === resizedElement.key);
    if (!element) return;
    console.log('ELEMENT SIZE BEFORE RESIZE', element.height, element.width);
    console.log('ELEMENT SIZE AFTER RESIZE', resizedElement.height, resizedElement.width);
    this.updateElement(resizedElement);
  }

  onCanvasClicked(point: CanvasPoint): void {
    let x = point.x;
    let y = point.y;
    if (this.canvasOptions.hasGrid) {
      x = Math.floor(point.x / this.canvasOptions.gridX) * this.canvasOptions.gridX;
      y = Math.floor(point.y / this.canvasOptions.gridY) * this.canvasOptions.gridY;
    }
    console.log('CANVAS POINT CLICKED', point);
    if (this.selectedDefaultElement) {
      this.addElement({
        ...this.selectedDefaultElement,
        x: x,
        y: y,
        zIndex: 0,
        key: `${this.currentId++}`,
      });
    }
  }

  private updateElement(elementEdited: VisualElement): void {
    this.elements = this.elements.map(element => (element.key === elementEdited.key ? elementEdited : element));
    if (this.selectedElement && this.selectedElement.key === elementEdited.key) {
      this.selectedElement = elementEdited;
    }
  }

  private addElement(newElement: VisualElement): void {
    this.elements = [...this.elements, newElement];
  }
}
