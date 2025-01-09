import { Directive, HostBinding, Input } from '@angular/core';
import { CANVAS_MODES, CanvasOptions } from '../canvas/canvas-options';

const DEFAULT_CANVAS_OPTIONS = {
  height: 0,
  width: 0,
  backgroundColor: 'grey',
  cursor: 'move',
  opacity: 1,
} as const;

/**
 * Element that will be used as a canvas.
 */
@Directive({
  selector: '[aorPanZoomCanvas]',
})
export class PanZoomCanvasDirective {
  /** Canvas configuration options to change height, width & background color. */
  @Input('aorPanZoomCanvasOptions')
  public options!: CanvasOptions;

  @HostBinding('style.height.px')
  public get height(): number {
    return this.options?.height ?? DEFAULT_CANVAS_OPTIONS.height;
  }

  @HostBinding('style.width.px')
  public get width(): number {
    return this.options?.width ?? DEFAULT_CANVAS_OPTIONS.width;
  }

  @HostBinding('style.backgroundColor')
  public get backgroundColor(): string {
    return this.options?.backgroundColor ?? DEFAULT_CANVAS_OPTIONS.backgroundColor;
  }

  @HostBinding('style.cursor')
  public get cursor(): string {
    return this.options?.cursor ?? DEFAULT_CANVAS_OPTIONS.cursor;
  }

  @HostBinding('style.opacity')
  public get opacity(): number {
    return this.options?.mode === CANVAS_MODES.CLICKABLE ? 0.8 : DEFAULT_CANVAS_OPTIONS.opacity;
  }
}
