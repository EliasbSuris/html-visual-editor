import { CdkDrag, CdkDragEnd, CdkDragMove, Point } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  input,
  output,
  Renderer2,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CanvasGridComponent } from './canvas/canvas-grid/canvas-grid.component';
import { ElementContainerComponent } from './elements/element-container/element-container.component';
import { ElementContentComponent } from './elements/element-content/element-content.component';
import { ResizeContainerDirective } from './resize/resize-container.directive';
import { ResizeElementDirective, ResizeEvent } from './resize/resize-element.directive';
import { ResizeContentDirective } from './resize/resize-content.directive';
import { PanZoomDirective } from './panzoom/pan-zoom.directive';
import { PanZoomCanvasDirective } from './panzoom/pan-zoom-canvas.directive';
import { VisualElementContentDirective } from './elements/visual-element-content.directive';
import { ResizeContainerHeightPipe } from './resize/resize-container-height.pipe';
import { ResizeContainerWidthPipe } from './resize/resize-container-width.pipe';
import { VisualEditorPlaceholderComponent } from './placeholder/visual-editor-placeholder/visual-editor-placeholder.component';
import { CANVAS_MODES, CanvasOptions, CanvasPoint } from './canvas/canvas-options';
import { ElementActionBarDefDirective } from './action-bar/element-action-bar-def.directive';
import { VisualEditorPlaceholderDefDirective } from './placeholder/visual-editor-placeholder-def.directive';
import { VisualElement } from './elements/visual-element';
import { VisorOptions } from './visor/visor-options';
import { VisualEditorState } from './visual-editor-state';

/**
 * Component used to renderer an array of VisualElements inside a Canvas.
 *
 * An user can zoom & pan using a visor over the canvas. These actions can be adjusted to a grid.
 *
 * Each VisualElement can be editable(resizable & draggable).
 */
@Component({
  selector: 'aor-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.scss'],
  imports: [
    NgStyle,
    NgClass,
    NgTemplateOutlet,
    CdkDrag,
    CanvasGridComponent,
    ElementContainerComponent,
    ElementContentComponent,
    ResizeContainerDirective,
    ResizeElementDirective,
    ResizeContentDirective,
    PanZoomDirective,
    PanZoomCanvasDirective,
    VisualElementContentDirective,
    ResizeContainerHeightPipe,
    ResizeContainerWidthPipe,
    VisualEditorPlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualEditorComponent {
  /** Available canvas modes. */
  public CANVAS_MODES = CANVAS_MODES;

  /** Panzom.js wrapper. */
  public panZoomDirective = viewChild.required(PanZoomDirective);
  /** Visor element. */
  public visor = viewChild.required<ElementRef<HTMLDivElement>>('visor');
  /** Read the template ref of projected action bar def */
  public actionBar = contentChild(ElementActionBarDefDirective, { read: TemplateRef });
  /** Read the template ref of projected placeholder def */
  public placeholder = contentChild(VisualEditorPlaceholderDefDirective, { read: TemplateRef });

  /**
   * Canvas configuration options.
   */
  public canvasOptions = input.required<CanvasOptions>();
  /** Decides wether to display the placeholder blocking the interaction with the elements. */
  public loading = input(false, { transform: booleanAttribute });
  /**
   * Array of elements to be rendered on the canvas.
   */
  public visualElements = input<VisualElement[]>([]);
  /**
   * Visor configuration options
   */
  public visorOptions = input.required<VisorOptions>();
  /**
   * Emits when an element is moved using drag & drop.
   */
  public elementMoved = output<VisualElement>();
  /**
   * Emits when an element is resized.
   */
  public elementResized = output<VisualElement>();
  /**
   * Emits when an element is selected.
   */
  public elementSelected = output<string | null>();
  /**
   * Emits when a user clicks on the Canvas (CLICKABLE mode).
   */
  public canvasClicked = output<CanvasPoint>();

  /** Internal state of the editor. Only the editor should be able to modify this.*/
  private readonly _state = signal<VisualEditorState>({
    currentZoomLevel: 1,
    selectedElementKey: null,
  });
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly state = this._state.asReadonly();

  // If initialized drag & drop adjust position doesn't work as expected
  private _adjustedPosition!: { x: number; y: number };

  constructor(private readonly renderer: Renderer2) {}

  /**
   * Select an element by key (should be a selectable element).
   *
   * @param element element to be selected.
   */
  public selectVisualElement(element: VisualElement): void {
    if (element.selectable && this.state().selectedElementKey !== element.key) {
      this.emitElementSelected(element.key);
    }
  }

  /**
   * Unselect the current element selected if any.
   */
  public unselectVisualElement(): void {
    if (this.state().selectedElementKey) {
      this.emitElementSelected(null);
    }
  }

  /**
   * Check if the element key is selected.
   *
   * @param elementKey to check.
   * @returns true if element is selected, false otherwise.
   */
  public isElementSelected(elementKey: string | null): boolean {
    return this.state().selectedElementKey === elementKey;
  }

  /**
   * Pan to (x,y) coordinates.
   *
   * @param x coordinate.
   * @param y coordinate.
   */
  public panTo(x: number, y: number): void {
    this.panZoomDirective().panTo({ x, y });
  }

  /**
   * Pan leaving the selected element's center on the visor´s center.
   *
   * @param element to pan.
   */
  public panToElement(element: VisualElement): void {
    // We want to center the element relative to visor.
    const { height: visorHeight, width: visorWidth } = this.visor().nativeElement.getBoundingClientRect();
    this.panZoomDirective().panTo(this.transformElementPositionToVisorCenterPosition(element, visorHeight, visorWidth));
  }

  /**
   * Reset pan & zoom to its initial values.
   */
  public resetPanzoom(): void {
    this.panZoomDirective().reset();
  }

  /**
   * Canvas zoom in.
   */
  public zoomIn(): void {
    this.panZoomDirective().zoomIn();
  }

  /**
   * Canvas zoom out.
   */
  public zoomOut(): void {
    this.panZoomDirective().zoomOut();
  }

  // INTERNAL METHODS

  /**
   * !INTERNAL METHOD.
   *
   * Callback passed to Angular CDK cdkDragConstrainPosition to force Drag & Drop over a grid.
   *
   * !OUT OF SERVICE
   * not working as expected, objects can´t be dragged to canvas right/bottom edge. This issue is related with elements size.
   */
  protected dragConstrainPosition = (userPointerPosition: Point): Point => {
    if (!this.canvasOptions().hasGrid) {
      return userPointerPosition;
    }
    return {
      x: Math.floor(userPointerPosition.x / this.canvasOptions().gridX) * this.canvasOptions().gridX,
      y: Math.floor(userPointerPosition.y / this.canvasOptions().gridY) * this.canvasOptions().gridY,
    };
  };

  /**
   * !INTERNAL METHOD.
   *  Handle clicks event on canvas (CLICKABLE mode).
   *
   * @param event MouseEvent
   */
  protected onClickCanvas(event: MouseEvent): void {
    /*
        If canvas mode is CLICKABLE, all elements renderer inside canvas, have 'pointer-events: none'.
        This makes straightforward getting canvas position on click,
        because there are not other clickable elements inside the canvas.
      */
    if (this.canvasOptions().mode !== CANVAS_MODES.CLICKABLE) {
      return;
    }
    const pointerEvent = event as PointerEvent;
    const canvasPosition: CanvasPoint = { x: pointerEvent.offsetX, y: pointerEvent.offsetY };
    this.canvasClicked.emit(canvasPosition);
  }

  /**
   * !INTERNAL METHOD.
   *
   * Angular CDK Drag & Drop needs some help with container scale transformations,
   * otherwise the mouse pointer movement is not synchronized with the element movement.
   *
   * @param event CdkDragMove
   *
   */
  protected onDragVisualElement(event: CdkDragMove<VisualElement>): void {
    const visualElement = event.source.data;
    // Calculate distance moved adjusted by zoom level, the adjustment is rounded to avoid decimal number complexity on zoomLevels not being 1
    const movedDistanceX = Math.round(event.distance.x / this.state().currentZoomLevel);
    const movedDistanceY = Math.round(event.distance.y / this.state().currentZoomLevel);

    // Update the adjusted position based on initial element position plus moved distance
    let adjustedX: number;
    let adjustedY: number;
    if (this.canvasOptions().hasGrid) {
      adjustedX =
        visualElement.x + Math.floor(movedDistanceX / this.canvasOptions().gridX) * this.canvasOptions().gridX;
      adjustedY =
        visualElement.y + Math.floor(movedDistanceY / this.canvasOptions().gridY) * this.canvasOptions().gridY;
    } else {
      adjustedX = visualElement.x + movedDistanceX;
      adjustedY = visualElement.y + movedDistanceY;
    }
    // Negative coordinates put elements outside of cdkDragBoundary
    this._adjustedPosition = {
      x: adjustedX >= 0 ? adjustedX : 0,
      y: adjustedY >= 0 ? adjustedY : 0,
    };
    // Apply transformation to the element based on the accumulated position.
    const element = event.source.element.nativeElement;
    this.renderer.setStyle(
      element,
      'transform',
      `translate3d(${this._adjustedPosition.x}px, ${this._adjustedPosition.y}px, 0px)`
    );
  }

  /**
   * !INTERNAL METHOD.
   *
   * Triggered on the drag & drop end to emit elementMoved output.
   *
   * @param event CdkDragEnd
   */
  protected onDragVisualElementEnd(event: CdkDragEnd<VisualElement>): void {
    const visualElement = event.source.data;
    this.elementMoved.emit({ ...visualElement, ...this._adjustedPosition });
  }

  /**
   * !INTERNAL METHOD.
   *
   * Triggered on the resize end to emit elementResized output.
   *
   * @param event resize event.
   *
   */
  protected onElementResized({ data, size: { height, width } }: ResizeEvent<VisualElement>): void {
    this.elementResized.emit({ ...data, height, width });
  }

  /**
   * !INTERNAL METHOD.
   *
   * Triggered to update the zoom level handle by Panzoom.js lib.
   */
  protected onZoomLevelChanged(newZoomLevel: number): void {
    this.updateState({ currentZoomLevel: newZoomLevel });
  }

  /**
   * Get Canvas position at the center of the element relative to visor size.
   *
   * @param element to get position from.
   * @param  visorHeight visor height.
   * @param  visorWidth visor width.
   * @returns pan position.
   */
  private transformElementPositionToVisorCenterPosition(
    element: VisualElement,
    visorHeight: number,
    visorWidth: number
  ): { x: number; y: number } {
    /*
      We have to move the visor pan position leaving the same distance on all directions from the center of the element to visor's edges.
      Pan position is the top left corner of the element, we add the half of the element's width and height to move pan point to the center of the element.
      Now, we just need to move left/top (subtraction) or right/bottom (add operation) the pan point to visor's half width/height.
     */
    const x = visorWidth / 2 - (element.x + element.width / 2);
    const y = visorHeight / 2 - (element.y + element.height / 2);
    return { x, y };
  }

  /**
   * Update metadata before emitting elementSelected event.
   *
   * @param key of the selected element
   */
  private emitElementSelected(key: VisualElement['key'] | null): void {
    this.updateState({ selectedElementKey: key });
    this.elementSelected.emit(key);
  }

  private updateState(newState: Partial<VisualEditorState>): void {
    this._state.update(value => ({ ...value, ...newState }));
  }
}
