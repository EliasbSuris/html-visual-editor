import { Pipe, PipeTransform } from '@angular/core';
import { VisualElement } from '../elements/visual-element';

@Pipe({
  name: 'resizeContainerWidth',
})
export class ResizeContainerWidthPipe implements PipeTransform {
  /**
   * Calculates the resizable container width.
   * If container have offset then, container width and content width will not be the same.
   * Content will be of the desired width, but container will be calculated from content width + offset.
   */
  public transform(value: VisualElement, containerOffset = 0): number {
    if (!value) {
      return 0;
    }
    return this.calculateWidth(value, containerOffset);
  }

  private calculateWidth({ height, width, rotation }: VisualElement, containerOffset: number): number {
    return calculateResizeContainerWidth(height, width, rotation, containerOffset);
  }
}

export function calculateResizeContainerWidth(
  height: number,
  width: number,
  rotation: number,
  containerOffset = 0
): number {
  if (!rotation) {
    return width + containerOffset;
  }
  const radians = (Math.PI * rotation) / 180;
  return height * Math.abs(Math.sin(radians)) + width * Math.abs(Math.cos(radians)) + containerOffset;
}
