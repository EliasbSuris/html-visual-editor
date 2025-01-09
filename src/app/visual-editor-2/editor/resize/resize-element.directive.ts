import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  Output,
  inject,
} from '@angular/core';
import { ObjectValues } from '../../../types/utils.type';
import { DEFAULT_GRID_X, DEFAULT_GRID_Y } from '../canvas/canvas-grid/canvas-grid.component';
import { calculateResizeContainerHeight } from './resize-container-height.pipe';
import { calculateResizeContainerWidth } from './resize-container-width.pipe';
import { ResizeContentDirective } from './resize-content.directive';

export const RESIZE_ACTION = {
  S: 'S',
  E: 'E',
  SE: 'SE',
  NONE: 'NONE',
} as const;

export type ResizeAction = ObjectValues<typeof RESIZE_ACTION>;

export interface ResizeEvent<T> {
  data: T;
  size: {
    width: number;
    height: number;
  };
}

const DEFAULT_ELEMENT_MIN_SIZE = 20;
const DEFAULT_CONTAINER_HEIGHT = 50;
const DEFAULT_CONTAINER_WIDTH = 50;
const DEFAULT_CONTAINER_OFFSET = 0;
const DEFAULT_ZOOM_LEVEL = 1;

/**
 * Element that can be resized freely or over a grid.
 */
@Directive({
  selector: '[aorResizeElement]',
})
export class ResizeElementDirective<T = unknown> {
  @ContentChild(ResizeContentDirective)
  public contentDirective!: ResizeContentDirective;

  /** Resize container height. */
  @Input('aorResizeElementContainerHeight')
  @HostBinding('style.height.px')
  public containerHeight = DEFAULT_CONTAINER_HEIGHT;

  /** Resize container width. */
  @Input('aorResizeElementContainerWidth')
  @HostBinding('style.width.px')
  public containerWidth = DEFAULT_CONTAINER_WIDTH;

  /** Resize container offset with its content.*/
  @Input('aorResizeElementContainerOffset')
  public containerOffset = DEFAULT_CONTAINER_OFFSET;

  /** If true, element will keep the aspect ratio. */
  @Input('aorResizeElementKeepRatio')
  public keepRatio = false;

  /** If no grid config passed, this will be the min width and height of a element. */
  @Input('aorResizeElementMinSize')
  public minSize = DEFAULT_ELEMENT_MIN_SIZE;

  /** If the container has an scale transform(zooming) use this to pass the scale to sync mouse move with resize move. */
  @Input('aorResizeElementZoomLevel')
  public zoomLevel = DEFAULT_ZOOM_LEVEL;

  /** Arbitrary data to attach to this resize instance. */
  @Input('aorResizeElementData')
  public data!: T;

  /** If true, element will be resized over a grid. */
  @Input('aorResizeElementHasGrid')
  public hasGrid = false;

  /** Grid cell width. */
  @Input('aorResizeElementGridX')
  public gridX = DEFAULT_GRID_X;

  /** Grid cell height. */
  @Input('aorResizeElementGridY')
  public gridY = DEFAULT_GRID_Y;

  /** Emits when a user is resizing the item. */
  @Output('aorResizeElementResized')
  public resized = new EventEmitter<ResizeEvent<T>>();

  private zone = inject(NgZone);
  private coords: { x: number; y: number } = { x: Infinity, y: Infinity };
  // If an element has rotation its content size is different than the container size
  private contentStartWidth!: number;
  private contentStartHeight!: number;

  private currentResizeDirection: ResizeAction = 'NONE';

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public initResize(event: MouseEvent, resizeAction: ResizeAction): void {
    this.currentResizeDirection = resizeAction;
    this.coords.x = event.clientX;
    this.coords.y = event.clientY;
    this.contentStartWidth = this.contentDirective.width;
    this.contentStartHeight = this.contentDirective.height;
  }

  public doResize(event: MouseEvent): void {
    this.zone.run(() => {
      this.resizeObject(event);
      this.cdr.markForCheck();
    });
  }

  public elementResizeEnded(): void {
    this.resized.emit({
      data: this.data,
      size: { height: this.contentDirective.height, width: this.contentDirective.width },
    });
  }

  private resizeObject(event: MouseEvent): void {
    // Calculate distance moved adjusted by zoom level, the adjustment is rounded to avoid decimal number complexity on zoomLevels not being 1
    const deltaX = Math.round((event.clientX - this.coords.x) / this.zoomLevel);
    const deltaY = Math.round((event.clientY - this.coords.y) / this.zoomLevel);
    const { resizedHeight, resizedWidth } = this.calculateResizedDimensions({
      currentResizeDirection: this.currentResizeDirection,
      deltaX,
      deltaY,
      keepRatio: this.keepRatio,
      startHeight: this.contentStartHeight,
      startWidth: this.contentStartWidth,
      hasGrid: this.hasGrid,
      gridX: this.gridX,
      gridY: this.gridY,
    });

    if (
      (!this.hasGrid && resizedHeight >= this.minSize && resizedWidth >= this.minSize) ||
      (this.hasGrid && resizedHeight >= this.gridY && resizedWidth >= this.gridX)
    ) {
      this.contentDirective.height = resizedHeight;
      this.contentDirective.width = resizedWidth;
      // If container offset != 0 content size will not be equal than container size. Content size will be used to calculate container size.
      // TODO: rotated elements resize.
      this.containerHeight = calculateResizeContainerHeight(
        this.contentDirective.height,
        this.contentDirective.width,
        this.contentDirective.rotation,
        this.containerOffset
      );
      this.containerWidth = calculateResizeContainerWidth(
        this.contentDirective.height,
        this.contentDirective.width,
        this.contentDirective.rotation,
        this.containerOffset
      );
    }
  }

  private calculateResizedDimensions({
    currentResizeDirection,
    deltaX,
    deltaY,
    startHeight,
    startWidth,
    keepRatio,
    hasGrid,
    gridX,
    gridY,
  }: {
    currentResizeDirection: ResizeAction;
    deltaX: number;
    deltaY: number;
    startHeight: number;
    startWidth: number;
    keepRatio: boolean;
    hasGrid: boolean;
    gridX: number;
    gridY: number;
  }): { resizedHeight: number; resizedWidth: number } {
    let resizedHeight = startHeight;
    let resizedWidth = startWidth;
    switch (currentResizeDirection) {
      case 'E':
        resizedWidth = startWidth + deltaX;
        if (keepRatio) {
          resizedHeight = startHeight + deltaX;
        }
        break;
      case 'S':
        resizedHeight = startHeight + deltaY;
        if (keepRatio) {
          resizedWidth = startWidth + deltaY;
        }
        break;
      case 'SE':
        if (keepRatio) {
          const keepRatioDelta = deltaX > deltaY ? deltaX : deltaY;
          resizedHeight = startHeight + keepRatioDelta;
          resizedWidth = startWidth + keepRatioDelta;
        } else {
          resizedHeight = startHeight + deltaY;
          resizedWidth = startWidth + deltaX;
        }
        break;
      case 'NONE':
      default:
        break;
    }

    if (hasGrid) {
      resizedHeight = Math.floor(resizedHeight / gridY) * gridY;
      resizedWidth = Math.floor(resizedWidth / gridX) * gridX;
    }
    return { resizedHeight, resizedWidth };
  }
}
