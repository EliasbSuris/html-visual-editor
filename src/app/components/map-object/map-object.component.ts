import { Component } from '@angular/core';
import { ResizeHandleDirective } from '../../directives/resize-handle.directive';

export const CONTAINER_OFFSET = 6;

@Component({
  selector: 'aor-map-object',
  standalone: true,
  imports: [ResizeHandleDirective],
  templateUrl: './map-object.component.html',
  styleUrl: './map-object.component.scss',
})
export class MapObjectComponent {}
