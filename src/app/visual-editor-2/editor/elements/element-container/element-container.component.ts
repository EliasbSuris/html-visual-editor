import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResizeHandleDirective } from '@v2/editor/resize/resize-handle.directive';
import { ResizePointComponent } from '@v2/editor/resize/resize-point/resize-point.component';

/** Component used as container for an element. Will render the resize handle elements and apply styles not related to the content. */
@Component({
  selector: 'aor-element-container',
  templateUrl: './element-container.component.html',
  styleUrls: ['./element-container.component.scss'],
  imports: [ResizeHandleDirective, ResizePointComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementContainerComponent {
  /** If true, will show the resize handlers elements. */
  public resizable = input.required({ transform: booleanAttribute });
  /** If true, will show action bar element. */
  public selectable = input.required({ transform: booleanAttribute });
  /** Zoom level of the editor. */
  public zoomLevel = input.required<number>();
}
