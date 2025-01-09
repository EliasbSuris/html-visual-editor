import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SvgDynamicContentData } from './svg-dynamic-content.component';

@Pipe({
  name: 'svgDynamicContent',
})
export class SvgDynamicContentPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(data: SvgDynamicContentData | undefined): SafeHtml | null {
    if (typeof data?.svg !== 'string') {
      throw new Error('A SVG Dynamic Content requires an inline svg as a string. Please provide one.');
    }

    return this.sanitizer.bypassSecurityTrustHtml(this.createSvgDynamicContent(data));
  }

  /**
   * Create a parent SVG element to wrap the VisualElement svg.
   * Parent SVG element assures VisualElement svg will
   * fill content setting width and height to 100%,
   * and handle preserve aspect ratio config to be synced with the VisualElement.
   *
   * @param data VisualElement config.
   * @returns a string containing a parent SVG element wrapping the VisualElement svg.
   */
  private createSvgDynamicContent(data: SvgDynamicContentData): string {
    return data.preserveAspectRatio
      ? `<svg height="100%" width="100%">${data.svg}</svg>`
      : // If viewBox isn't set, the preserveAspectRatio attribute has no effect on SVG
        `<svg viewBox="0 0 1 1" preserveAspectRatio="none" height="100%" width="100%">${data.svg}</svg>`;
  }
}
