import { Directive, HostBinding, Input } from '@angular/core';

/** Element that will be used as content for the ResizeElementDirective. */
@Directive({
  selector: '[aorResizeContent]',
})
export class ResizeContentDirective {
  /** Resizable content height. */
  @Input('aorResizeContentHeight')
  @HostBinding('style.height.px')
  public height!: number;

  /** Resizable content width. */
  @Input('aorResizeContentWidth')
  @HostBinding('style.width.px')
  public width!: number;

  /** Resizable content rotation. */
  @Input('aorResizeContentRotation')
  @HostBinding('style.rotate.deg')
  public rotation!: number;
}
