import { Component, Input } from '@angular/core';
import { MapObject } from '@models/map-object.interface';
import { ElementToSvgPipe } from '@pipes/element-to-svg.pipe';

@Component({
  selector: 'aor-svg-element',
  standalone: true,
  imports: [ElementToSvgPipe],
  templateUrl: './svg-element.component.html',
  styleUrl: './svg-element.component.scss',
})
export class SvgElementComponent {
  @Input()
  element!: MapObject;
}
