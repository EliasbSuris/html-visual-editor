import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[aorResizeContainer]',
  standalone: true,
})
export class ResizeContainerDirective {
  elementRef: ElementRef<Element> = inject(ElementRef);
  constructor() {}
}
