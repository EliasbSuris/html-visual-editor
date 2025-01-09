import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A action bar wrapper to style projected action buttons. */
@Component({
  selector: 'aor-element-action-bar',
  imports: [],
  templateUrl: './element-action-bar.component.html',
  styleUrl: './element-action-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementActionBarComponent {}
