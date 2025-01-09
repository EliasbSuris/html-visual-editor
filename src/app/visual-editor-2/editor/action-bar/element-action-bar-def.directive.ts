import { Directive } from '@angular/core';

/** Directive to define an action bar for a visual element with the element itself injected as context. */
@Directive({
  selector: '[aorElementActionBarDef]',
})
export class ElementActionBarDefDirective {}
