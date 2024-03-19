import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

@Directive({
  selector: '[aorResizeContainer]',
  standalone: true,
})
export class ResizeContainerDirective {
  // Hide overflow to avoid child elements to exceed container
  @HostBinding('style.overflow')
  overflow = 'hidden';

  elementRef: ElementRef<Element> = inject(ElementRef);
  constructor() {}
}
