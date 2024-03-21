import { Pipe, PipeTransform } from '@angular/core';
import { CONTAINER_OFFSET } from '@components/element-container/element-container.component';
import { MapObject } from '@models/map-object.interface';

@Pipe({
  name: 'resizeContainerWidth',
  standalone: true,
})
export class ResizeContainerWidthPipe implements PipeTransform {
  transform(value: MapObject): number {
    if (!value) {
      return 0;
    }
    return this.calculateWidth(value);
  }

  private calculateWidth({ size: { height, width }, rotation }: MapObject): number {
    return calculateResizeContainerWidth(height, width, rotation);
  }
}

export function calculateResizeContainerWidth(height: number, width: number, rotation: number): number {
  if (!rotation) {
    return width + CONTAINER_OFFSET;
  }
  const radians = (Math.PI * rotation) / 180;
  return height * Math.abs(Math.sin(radians)) + width * Math.abs(Math.cos(radians)) + CONTAINER_OFFSET;
}
