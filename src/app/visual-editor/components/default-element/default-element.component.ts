import { Component, Input } from '@angular/core';
import { MapObject } from '../../models/map-object.interface';

@Component({
  selector: 'aor-default-element',
  imports: [],
  templateUrl: './default-element.component.html',
  styleUrl: './default-element.component.scss',
})
export class DefaultElementComponent {
  @Input()
  element!: MapObject;
}
