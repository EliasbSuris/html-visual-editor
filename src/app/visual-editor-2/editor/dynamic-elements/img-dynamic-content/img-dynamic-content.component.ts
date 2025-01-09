import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VisualElement } from '@v2/editor/elements/visual-element';

export interface ImgDynamicContentData {
  imageUrl: string;
  objectFit: 'contain' | 'cover' | 'fill';
}

@Component({
  imports: [NgOptimizedImage],
  templateUrl: './img-dynamic-content.component.html',
  styleUrls: ['./img-dynamic-content.component.scss'],
})
export class ImgDynamicContentComponent {
  @Input()
  public element!: VisualElement<unknown, ImgDynamicContentData>;
}
