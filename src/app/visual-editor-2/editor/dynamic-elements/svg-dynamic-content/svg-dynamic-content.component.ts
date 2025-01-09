import { Component, Input } from '@angular/core';
import { SvgDynamicContentPipe } from './svg-dynamic-content.pipe';
import { VisualElement } from '@v2/editor/elements/visual-element';

export interface SvgDynamicContentData {
  fillColor: string;
  fillOpacity: number;
  preserveAspectRatio: boolean;
  strokeColor: string;
  strokeWidth: number;
  svg: string;
}

@Component({
  templateUrl: './svg-dynamic-content.component.html',
  styleUrls: ['./svg-dynamic-content.component.scss'],
  imports: [SvgDynamicContentPipe],
})
export class SvgDynamicContentComponent {
  @Input()
  public element!: VisualElement<unknown, SvgDynamicContentData>;
}
