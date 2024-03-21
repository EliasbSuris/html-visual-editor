import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MapObject } from '@models/map-object.interface';

@Component({
  selector: 'aor-simple-element',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './simple-element.component.html',
  styleUrl: './simple-element.component.scss',
})
export class SimpleElementComponent {
  @Input()
  element!: MapObject;
}
