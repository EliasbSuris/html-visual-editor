import { Directive, HostBinding, Input } from '@angular/core';
import { VisualElement } from './visual-element';

/** Element will apply common VisualElement content styles. */
@Directive({
  selector: '[aorVisualElementContent]',
})
export class VisualElementContentDirective {
  /** VisualElement configuration to apply common content styles. */
  @Input('aorVisualElementContent')
  public content!: VisualElement;

  @HostBinding('style.opacity')
  public get opacity(): number {
    return this.content.opacity;
  }
  @HostBinding('style.backgroundColor')
  public get backgroundColor(): string {
    return this.content.backgroundColor ?? 'transparent';
  }
  @HostBinding('style.borderColor')
  public get borderColor(): string {
    return this.content.borderColor ?? 'black';
  }
  @HostBinding('style.borderRadius.%')
  public get borderRadius(): number {
    return this.content.borderRadius ?? 0;
  }
  @HostBinding('style.borderStyle')
  public get borderStyle(): string {
    return this.content.borderStyle ?? 'none';
  }
  @HostBinding('style.borderWidth.px')
  public get borderWidth(): number {
    return this.content.borderWidth ?? 0;
  }
}
