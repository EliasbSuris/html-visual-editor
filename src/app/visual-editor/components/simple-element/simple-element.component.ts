import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MapObject } from '../../models/map-object.interface';

@Component({
  selector: 'aor-simple-element',
  imports: [NgStyle],
  templateUrl: './simple-element.component.html',
  styleUrl: './simple-element.component.scss',
})
export class SimpleElementComponent {
  @Input()
  element!: MapObject;

  private cdCounter = 0;

  cdFired(): void {
    console.log(`%cCD FOR SIMPLE ELEMENT ${this.element.text}`, 'color: #2f9e44');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #2f9e44; font-size: 18px');
  }
}
