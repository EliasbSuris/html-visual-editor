import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CanvasOptions } from '../canvas-options';

export const DEFAULT_GRID_X = 50;
export const DEFAULT_GRID_Y = 50;

/** Component used to render a grid. */
@Component({
  selector: 'aor-canvas-grid',
  template: ``,
  styleUrls: ['./canvas-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasGridComponent {
  /** Canvas configuration to build the grid. */
  @Input()
  public canvasOptions!: CanvasOptions;

  @HostBinding('style.backgroundSize')
  private get backgroundSize(): string {
    return `${this.canvasOptions?.gridX ?? DEFAULT_GRID_X}px ${this.canvasOptions?.gridY ?? DEFAULT_GRID_Y}px`;
  }

  @HostBinding('class.show')
  private get show(): boolean {
    return this.canvasOptions?.showGrid;
  }
}
