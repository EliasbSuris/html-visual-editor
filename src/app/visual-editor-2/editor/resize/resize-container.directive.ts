import { Directive, ElementRef } from '@angular/core';

/** Element that will be used to determine the element to which the resizable's position will be constrained. */
@Directive({
  selector: '[aorResizeContainer]',
})
export class ResizeContainerDirective {
  constructor(public elementRef: ElementRef<Element>) {}
}
