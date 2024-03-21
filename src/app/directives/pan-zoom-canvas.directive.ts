import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[aorPanZoomCanvas]',
  standalone: true,
})
export class PanZoomCanvasDirective {
  @Input()
  @HostBinding('style.height.px')
  canvasHeight!: number;

  @Input()
  @HostBinding('style.width.px')
  canvasWidth!: number;
}
