import { Injectable } from '@angular/core';
import { ObjectValues } from '@custom-types/utils.type';
import { DefaultElementComponent } from '@v1/components/default-element/default-element.component';
import { SimpleElementComponent } from '@v1/components/simple-element/simple-element.component';
import { SolidGaugeElementComponent } from '@v1/components/solid-gauge-element/solid-gauge-element.component';
import { SvgElementComponent } from '@v1/components/svg-element/svg-element.component';
import { ELEMENT_TYPE, ElementType } from '../../models/map-object.interface';

export const DYNAMIC_ELEMENT = {
  [ELEMENT_TYPE.SIMPLE]: SimpleElementComponent,
  [ELEMENT_TYPE.SVG]: SvgElementComponent,
  [ELEMENT_TYPE.SOLID_GAUGE]: SolidGaugeElementComponent,
  default: DefaultElementComponent,
} as const;

export type DynamicElement = ObjectValues<typeof DYNAMIC_ELEMENT>;

@Injectable({
  providedIn: 'root',
})
export class DynamicElementLoaderService {
  getDynamicElement(type: ElementType): DynamicElement {
    return DYNAMIC_ELEMENT[type] ?? DYNAMIC_ELEMENT.default;
  }
}
