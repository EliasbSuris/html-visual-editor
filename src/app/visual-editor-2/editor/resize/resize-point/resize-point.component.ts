import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ResizeAction } from '../resize-handle.directive';

export type ResizeActionClass = Lowercase<ResizeAction>;

export const MIN_SIZE = 10;
export const MIN_MARGIN = 4.5;

@Component({
  selector: 'aor-resize-point',
  template: '',
  styleUrl: './resize-point.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.height.px]': 'size()',
    '[style.width.px]': 'size()',
    '[class]': 'resizeActionClass()',
    '[style]': 'marginStyle()',
  },
})
export class ResizePointComponent {
  public size = input(10, {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'zoomLevel',
    transform: (value: number): number => (value < 1 ? MIN_SIZE / value : MIN_SIZE),
  });
  public resizeActionClass = input.required<ResizeActionClass>();

  public marginStyle = computed(() => this.marginStyleLookup[this.resizeActionClass()](this.size()));

  private marginStyleLookup: Record<ResizeActionClass, (size?: number) => string> = {
    e: (size?: number) => `margin-right: -${this.calculateMargin(size)}px;`,
    none: () => '',
    s: (size?: number) => `margin-bottom: -${this.calculateMargin(size)}px;`,
    se: (size?: number) =>
      `margin-bottom: -${this.calculateMargin(size)}px; margin-right: -${this.calculateMargin(size)}px;`,
  };

  private calculateMargin(size: number | undefined): number {
    if (!size) {
      return 0;
    }
    return (size * MIN_MARGIN) / MIN_SIZE;
  }
}
