import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MapObject } from '../../models/map-object.interface';
import {
  DynamicElement,
  DynamicElementLoaderService,
} from '../../services/dynamic-element-loader/dynamic-element-loader.service';

@Component({
  selector: 'aor-element-content',
  imports: [NgComponentOutlet],
  templateUrl: './element-content.component.html',
  styleUrl: './element-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementContentComponent implements OnInit {
  @Input()
  element!: MapObject;

  dynamicElement!: DynamicElement;

  private cdCounter = 0;

  constructor(private readonly dynamicElementLoaderService: DynamicElementLoaderService) {}

  ngOnInit(): void {
    this.dynamicElement = this.dynamicElementLoaderService.getDynamicElement(this.element.type);
  }

  cdFired(): void {
    console.log(`%cCD FOR CONTENT ${this.element.text}`, 'color: #6741d9');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #6741d9; font-size: 18px');
  }
}
