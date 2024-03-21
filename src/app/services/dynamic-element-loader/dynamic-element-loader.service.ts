import { Injectable } from '@angular/core';
import { DefaultElementComponent } from '@components/default-element/default-element.component';
import { SimpleElementComponent } from '@components/simple-element/simple-element.component';
import { SolidGaugeElementComponent } from '@components/solid-gauge-element/solid-gauge-element.component';
import { SvgElementComponent } from '@components/svg-element/svg-element.component';
import { ObjectValues } from '@custom-types/utils.type';
import { ELEMENT_TYPE, ElementType } from '@models/map-object.interface';

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
    return DYNAMIC_ELEMENT[type] ?? DYNAMIC_ELEMENT['default'];
  }
}
