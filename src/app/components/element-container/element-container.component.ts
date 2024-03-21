import { Component } from '@angular/core';
import { ResizeHandleDirective } from '@directives/resize-handle.directive';

export const CONTAINER_OFFSET = 6;

@Component({
  selector: 'aor-element-container',
  standalone: true,
  imports: [ResizeHandleDirective],
  templateUrl: './element-container.component.html',
  styleUrl: './element-container.component.scss',
})
export class ElementContainerComponent {}
