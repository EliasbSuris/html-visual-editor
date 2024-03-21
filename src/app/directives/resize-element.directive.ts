import { ContentChild, Directive, EventEmitter, HostBinding, Input, NgZone, Output, inject } from '@angular/core';
import { ObjectValues } from '@custom-types/utils.type';
import { calculateResizeContainerHeight } from '../pipes/resize-container-height.pipe';
import { calculateResizeContainerWidth } from '../pipes/resize-container-width.pipe';
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

@Directive({
  selector: '[aorResizeElement]',
  standalone: true,
})
export class ResizeElementDirective<T> {
  @Input()
  @HostBinding('style.height.px')
  containerHeight = 100;
  @Input()
  @HostBinding('style.width.px')
  containerWidth = 100;
  @Input()
  keepRatio = false;
  @Input()
  minSize = 20;
  @Input()
  zoomLevel = 1;
  @Input()
  resizeData!: T;
  @Output()
  elementResized = new EventEmitter<ResizeEvent<T>>();

  @ContentChild(ResizeContentDirective)
  contentDirective!: ResizeContentDirective;

  private zone = inject(NgZone);
  private coords: { x: number; y: number } = { x: Infinity, y: Infinity };
  // If an element has rotation its content size is different than the container size
  private contentStartWidth!: number;
  private contentStartHeight!: number;

  private currentResizeDirection: ResizeAction = 'NONE';

  initResize(event: MouseEvent, resizeAction: ResizeAction): void {
    this.currentResizeDirection = resizeAction;
    this.coords.x = event.clientX;
    this.coords.y = event.clientY;
    this.contentStartWidth = this.contentDirective.contentWidth;
    this.contentStartHeight = this.contentDirective.contentHeight;
  }

  doResize(event: MouseEvent): void {
    this.zone.run(() => {
      this.resizeObject(event);
    });
  }

  elementResizeEnded(): void {
    this.elementResized.next({
      data: this.resizeData,
      size: { height: this.contentDirective.contentHeight, width: this.contentDirective.contentWidth },
    });
  }

  private resizeObject(event: MouseEvent): void {
    const deltaX = (event.clientX - this.coords.x) / this.zoomLevel;
    const deltaY = (event.clientY - this.coords.y) / this.zoomLevel;
    const { resizedHeight, resizedWidth } = this.calculateResizedDimensions({
      currentResizeDirection: this.currentResizeDirection,
      deltaX,
      deltaY,
      keepRatio: this.keepRatio,
      startHeight: this.contentStartHeight,
      startWidth: this.contentStartWidth,
    });

    if (resizedHeight >= this.minSize && resizedWidth >= this.minSize) {
      this.contentDirective.contentHeight = resizedHeight;
      this.contentDirective.contentWidth = resizedWidth;
      this.containerHeight = calculateResizeContainerHeight(
        this.contentDirective.contentHeight,
        this.contentDirective.contentWidth,
        this.contentDirective.contentRotation
      );
      this.containerWidth = calculateResizeContainerWidth(
        this.contentDirective.contentHeight,
        this.contentDirective.contentWidth,
        this.contentDirective.contentRotation
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
  }: {
    currentResizeDirection: ResizeAction;
    deltaX: number;
    deltaY: number;
    startHeight: number;
    startWidth: number;
    keepRatio: boolean;
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
    return { resizedHeight, resizedWidth };
  }
}
