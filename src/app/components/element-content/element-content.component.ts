import { NgComponentOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MapObject } from '@models/map-object.interface';
import {
  DynamicElement,
  DynamicElementLoaderService,
} from '@services/dynamic-element-loader/dynamic-element-loader.service';

@Component({
  selector: 'aor-element-content',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './element-content.component.html',
  styleUrl: './element-content.component.scss',
})
export class ElementContentComponent implements OnInit {
  @Input()
  element!: MapObject;

  dynamicElement!: DynamicElement;

  constructor(private readonly dynamicElementLoaderService: DynamicElementLoaderService) {}

  ngOnInit(): void {
    this.dynamicElement = this.dynamicElementLoaderService.getDynamicElement(this.element.type);
  }
}
