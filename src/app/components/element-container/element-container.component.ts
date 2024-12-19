import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResizeHandleDirective } from '@directives/resize-handle.directive';

export const CONTAINER_OFFSET = 6;

@Component({
  selector: 'aor-element-container',
  imports: [ResizeHandleDirective],
  templateUrl: './element-container.component.html',
  styleUrl: './element-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementContainerComponent {
  @Input()
  text!: string;

  private cdCounter = 0;

  cdFired(): void {
    console.log(`%cCD FOR CONTAINER ${this.text}`, 'color: #f08c00');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #f08c00; font-size: 18px');
  }
}
