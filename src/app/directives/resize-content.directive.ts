import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[aorReiszetContent]',
  standalone: true,
})
export class ResizeContentDirective {
  @Input()
  @HostBinding('style.height.px')
  contentHeight!: number;

  @Input()
  @HostBinding('style.width.px')
  contentWidth!: number;

  @Input()
  @HostBinding('style.rotate.deg')
  contentRotation!: number;
}
