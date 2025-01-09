import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './dynamic-content-not-found.component.html',
  styleUrls: ['./dynamic-content-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContentNotFoundComponent {}
