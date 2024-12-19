import { Component, Input } from '@angular/core';
import { MapObject } from '@models/map-object.interface';
import { ElementToSvgPipe } from '@pipes/element-to-svg.pipe';

@Component({
  selector: 'aor-svg-element',
  imports: [ElementToSvgPipe],
  templateUrl: './svg-element.component.html',
  styleUrl: './svg-element.component.scss',
})
export class SvgElementComponent {
  @Input()
  element!: MapObject;

  private cdCounter = 0;

  cdFired(): void {
    console.log(`%cCD FOR SVG ELEMENT ${this.element.text}`, 'color: #2f9e44');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #2f9e44; font-size: 18px');
  }
}
