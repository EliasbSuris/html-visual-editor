import { Pipe, PipeTransform } from '@angular/core';
import { VisualElement } from '../elements/visual-element';

@Pipe({
  name: 'resizeContainerHeight',
})
export class ResizeContainerHeightPipe implements PipeTransform {
  /**
   * Calculates the resizable container height.
   * If container have offset then, container height and content height will not be the same.
   * Content will be of the desired height, but container will be calculated from content height + offset.
   */
  public transform(value: VisualElement, containerOffset = 0): number {
    if (!value) {
      return 0;
    }
    return this.calculateHeight(value, containerOffset);
  }

  private calculateHeight({ height, width, rotation }: VisualElement, containerOffset: number): number {
    return calculateResizeContainerHeight(height, width, rotation, containerOffset);
  }
}

export function calculateResizeContainerHeight(
  height: number,
  width: number,
  rotation: number,
  containerOffset = 0
): number {
  if (!rotation) {
    return height + containerOffset;
  }
  const radians = (Math.PI * rotation) / 180;
  return width * Math.abs(Math.sin(radians)) + height * Math.abs(Math.cos(radians)) + containerOffset;
}
