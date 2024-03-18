import { ContentChild, Directive, HostBinding, Input, NgZone, inject } from '@angular/core';
import { CONTAINER_OFFSET } from '@components/map-object/map-object.component';
import { ObjectValues } from '@custom-types/utils.type';
import { ResizeContentDirective } from './resize-content.directive';

export const RESIZE_ACTION = {
  S: 'S',
  E: 'E',
  SE: 'SE',
  NONE: 'NONE',
} as const;

export type ResizeAction = ObjectValues<typeof RESIZE_ACTION>;

@Directive({
  selector: '[aorResizeElement]',
  standalone: true,
})
export class ResizeElementDirective {
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

  @ContentChild(ResizeContentDirective)
  contentDirective!: ResizeContentDirective;

  private zone = inject(NgZone);
  private coords: { x: number; y: number } = { x: Infinity, y: Infinity };
  // If an element has rotation its content size is different than the container size
  private contentStartWidth!: number;
  private contentStartHeight!: number;
  private containerStartWidth!: number;
  private containerStartHeight!: number;

  private currentResizeDirection: ResizeAction = 'NONE';

  initResize(event: MouseEvent, resizeAction: ResizeAction): void {
    this.currentResizeDirection = resizeAction;
    this.coords.x = event.clientX;
    this.coords.y = event.clientY;
    this.contentStartHeight = this.contentDirective.contentHeight;
    this.contentStartWidth = this.contentDirective.contentWidth;
    this.containerStartHeight = this.containerHeight;
    this.containerStartWidth = this.containerWidth;
  }

  doResize(event: MouseEvent): void {
    this.zone.run(() => {
      if (this.contentDirective.contentRotation !== 0) {
        // TODO: REFACTOR resize rotated object using this approach => https://shihn.ca/posts/2020/resizing-rotated-elements/
        this.resizeRotatedObject(event);
      } else {
        this.resizeObject(event);
      }
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
      this.containerHeight = resizedHeight + CONTAINER_OFFSET;
      this.containerWidth = resizedWidth + CONTAINER_OFFSET;
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

  private resizeRotatedObject(event: MouseEvent): void {
    const deltaX = (event.clientX - this.coords.x) / this.zoomLevel;
    const deltaY = (event.clientY - this.coords.y) / this.zoomLevel;
    const { rotatedDeltaX, rotatedDeltaY } = this.calculatedRotatedDelta(
      deltaX,
      deltaY,
      this.contentDirective.contentRotation,
      this.zoomLevel
    );

    const { containerResizedHeight, containerResizedWidth, contentResizedHeight, contentResizedWidth } =
      this.calculateRotatedResizedDimensions({
        currentResizeDirection: this.currentResizeDirection,
        deltaX,
        deltaY,
        containerStartHeight: this.containerStartHeight,
        containerStartWidth: this.containerStartWidth,
        contentStartHeight: this.contentStartHeight,
        contentStartWidth: this.contentStartWidth,
        rotatedDeltaX,
        rotatedDeltaY,
        keepRatio: this.keepRatio,
      });

    if (contentResizedHeight >= this.minSize && contentResizedWidth >= this.minSize) {
      this.contentDirective.contentHeight = contentResizedHeight;
      this.contentDirective.contentWidth = contentResizedWidth;
      this.containerHeight = containerResizedHeight;
      this.containerWidth = containerResizedWidth;
    }
  }

  private calculatedRotatedDelta(
    deltaX: number,
    deltaY: number,
    rotation: number,
    zoomLevel: number
  ): { rotatedDeltaX: number; rotatedDeltaY: number } {
    if (!rotation) {
      return { rotatedDeltaX: deltaX, rotatedDeltaY: deltaY };
    }

    const radians = (Math.PI * rotation) / 180;

    const rotatedDeltaX = (deltaY * Math.abs(Math.sin(radians)) + deltaX * Math.abs(Math.cos(radians))) / zoomLevel;
    const rotatedDeltaY = (deltaX * Math.abs(Math.sin(radians)) + deltaY * Math.abs(Math.cos(radians))) / zoomLevel;
    return { rotatedDeltaX, rotatedDeltaY };
  }

  private calculateRotatedResizedDimensions({
    currentResizeDirection,
    deltaX,
    deltaY,
    rotatedDeltaX,
    rotatedDeltaY,
    contentStartHeight,
    contentStartWidth,
    containerStartHeight,
    containerStartWidth,
    keepRatio,
  }: {
    currentResizeDirection: ResizeAction;
    deltaX: number;
    deltaY: number;
    rotatedDeltaX: number;
    rotatedDeltaY: number;
    contentStartHeight: number;
    contentStartWidth: number;
    containerStartHeight: number;
    containerStartWidth: number;
    keepRatio: boolean;
  }): {
    containerResizedHeight: number;
    containerResizedWidth: number;
    contentResizedHeight: number;
    contentResizedWidth: number;
  } {
    let containerResizedHeight = containerStartHeight;
    let containerResizedWidth = containerStartWidth;
    let contentResizedHeight = contentStartHeight;
    let contentResizedWidth = contentStartWidth;
    switch (currentResizeDirection) {
      case 'E':
        containerResizedWidth = containerStartWidth + deltaX;
        contentResizedWidth = contentStartWidth + rotatedDeltaX;
        if (keepRatio) {
          contentResizedHeight = contentStartHeight + rotatedDeltaX;
          containerResizedHeight = containerStartHeight + deltaX;
        }
        break;
      case 'S':
        containerResizedHeight = containerStartHeight + deltaY;
        contentResizedHeight = contentStartHeight + rotatedDeltaY;
        if (keepRatio) {
          contentResizedWidth = contentStartWidth + rotatedDeltaY;
          containerResizedWidth = containerStartWidth + deltaY;
        }
        break;
      case 'SE':
        if (keepRatio) {
          const keepRatioDelta = deltaX > deltaY ? deltaX : deltaY;
          const keepRatioRotatedDelta = deltaX > deltaY ? rotatedDeltaX : rotatedDeltaY;
          containerResizedHeight = containerStartHeight + keepRatioDelta;
          containerResizedWidth = containerStartWidth + keepRatioDelta;
          contentResizedHeight = contentStartHeight + keepRatioRotatedDelta;
          contentResizedWidth = contentStartWidth + keepRatioRotatedDelta;
        } else {
          containerResizedHeight = containerStartHeight + deltaY;
          containerResizedWidth = containerStartWidth + deltaX;
          contentResizedHeight = contentStartHeight + rotatedDeltaY;
          contentResizedWidth = contentStartWidth + rotatedDeltaX;
        }
        break;
      case 'NONE':
      default:
        break;
    }
    return { containerResizedHeight, containerResizedWidth, contentResizedHeight, contentResizedWidth };
  }
}
