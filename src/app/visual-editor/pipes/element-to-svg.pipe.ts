import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MapObject } from '../models/map-object.interface';

@Pipe({
  name: 'elementToSvg',
  standalone: true,
})
export class ElementToSvgPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(element: MapObject): SafeHtml | null {
    if (typeof element?.svg !== 'string') {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(element.svg);
  }
}
