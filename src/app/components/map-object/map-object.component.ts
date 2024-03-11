import { Component, ElementRef, HostBinding, Input, Renderer2, inject } from '@angular/core';

// export type ResizeDirection = 's' | 'e' | 'se' | 'none';

export const RESIZE_DIRECTION = {
  S: 'S',
  E: 'E',
  SE: 'SE',
  NONE: 'NONE',
} as const;

export type ResizeDirection = (typeof RESIZE_DIRECTION)[keyof typeof RESIZE_DIRECTION];

@Component({
  selector: 'aor-map-object',
  standalone: true,
  imports: [],
  templateUrl: './map-object.component.html',
  styleUrl: './map-object.component.scss',
})
export class MapObjectComponent {
  @Input()
  @HostBinding('style.height.px')
  height = '100';

  @Input()
  @HostBinding('style.width.px')
  width = '100';
  @Input()
  keepRatio = false;

  elementRef: ElementRef<Element> = inject(ElementRef);
  renderer = inject(Renderer2);
  coords: { x: number; y: number } = { x: Infinity, y: Infinity };
  startWidth!: number;
  startHeight!: number;
  currentResizeDirection: ResizeDirection = RESIZE_DIRECTION.NONE;

  moveListener = (event: MouseEvent): void => this.doDrag(event);
  stopListener = (): void => this.stopDrag();

  initDrag(event: MouseEvent, direction: ResizeDirection): void {
    console.log(this.elementRef.nativeElement, this.height, this.width);
    this.currentResizeDirection = direction;
    this.coords.x = event.clientX;
    this.coords.y = event.clientY;
    this.startWidth = parseInt(this.width, 10);
    this.startHeight = parseInt(this.height, 10);
    document.addEventListener('mousemove', this.moveListener, false);
    document.addEventListener('mouseup', () => this.stopDrag(), false);
    event.stopPropagation();
  }

  doDrag(event: MouseEvent): void {
    if (this.currentResizeDirection === 'E' || this.currentResizeDirection === 'SE') {
      const deltaX = event.clientX - this.coords.x;
      this.width = `${this.startWidth + deltaX}`;
      if (this.keepRatio) {
        console.log('hola', deltaX);
        this.height = `${this.startHeight + deltaX}`;
      }
    }
    if (this.currentResizeDirection === 'S' || this.currentResizeDirection === 'SE') {
      const deltaY = event.clientY - this.coords.y;
      this.height = `${this.startHeight + deltaY}`;
      if (this.keepRatio) {
        console.log('hola', deltaY);
        this.width = `${this.startWidth + deltaY}`;
      }
    }
    console.log(this.width, this.height);
    event.stopPropagation();
  }

  stopDrag(): void {
    this.currentResizeDirection = RESIZE_DIRECTION.NONE;
    document.removeEventListener('mousemove', this.moveListener, false);
    document.removeEventListener('mouseup', () => this.stopDrag.bind(this), false);
  }
}
