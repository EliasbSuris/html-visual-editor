import { Pipe, PipeTransform } from '@angular/core';
import { CONTAINER_OFFSET } from '@v1/components/element-container/element-container.component';
import { MapObject } from '../models/map-object.interface';

@Pipe({
  name: 'resizeContainerHeight',
  standalone: true,
})
export class ResizeContainerHeightPipe implements PipeTransform {
  transform(value: MapObject): number {
    if (!value) {
      return 0;
    }
    return this.calculateHeight(value);
  }

  private calculateHeight({ size: { height, width }, rotation }: MapObject): number {
    return calculateResizeContainerHeight(height, width, rotation);
  }
}

export function calculateResizeContainerHeight(height: number, width: number, rotation: number): number {
  if (!rotation) {
    return height + CONTAINER_OFFSET;
  }
  const radians = (Math.PI * rotation) / 180;
  return width * Math.abs(Math.sin(radians)) + height * Math.abs(Math.cos(radians)) + CONTAINER_OFFSET;
}
