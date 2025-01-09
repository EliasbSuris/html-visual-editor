import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VisualElement } from '@v2/editor/elements/visual-element';

@Component({
  templateUrl: './simple-dynamic-content.component.html',
  styleUrls: ['./simple-dynamic-content.component.scss'],
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleDynamicContentComponent {
  public element = input<VisualElement>();
}
