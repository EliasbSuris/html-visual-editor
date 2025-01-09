import { Injectable } from '@angular/core';
import { SimpleDynamicContentComponent } from './editor/dynamic-elements/simple-dynamic-content/simple-dynamic-content.component';
import { ImgDynamicContentComponent } from './editor/dynamic-elements/img-dynamic-content/img-dynamic-content.component';
import { SvgDynamicContentComponent } from './editor/dynamic-elements/svg-dynamic-content/svg-dynamic-content.component';
import { LinearChartDynamicContentComponent } from './editor/dynamic-elements/linear-chart-dynamic-content/linear-chart-dynamic-content.component';
import { DynamicContentNotFoundComponent } from './editor/dynamic-elements/dynamic-content-not-found/dynamic-content-not-found.component';
import { ObjectValues } from '@custom-types/utils.type';
import { ElementType } from './visual-elements-mock-data';
import { DynamicVisualContentLoaderService } from './editor/elements/dynamic-visual-content-loader';

export type DynamicComponents =
  | SimpleDynamicContentComponent
  | ImgDynamicContentComponent
  | SvgDynamicContentComponent
  | LinearChartDynamicContentComponent;

export const DYNAMIC_COMPONENT = {
  SIMPLE: SimpleDynamicContentComponent,
  IMG: ImgDynamicContentComponent,
  SVG: SvgDynamicContentComponent,
  NOT_FOUND: DynamicContentNotFoundComponent,
  LINEAR_CHART: LinearChartDynamicContentComponent,
} as const;

export type DynamicComponent = ObjectValues<typeof DYNAMIC_COMPONENT>;

/*
  Using satisfies keep DYNAMIC_ELEMENT object readonly:

  DYNAMIC_ELEMENT[ELEMENT_TYPE.SIMPLE] = DYNAMIC_COMPONENT.SVG; => Cannot assign to [ELEMENT_TYPE.SIMPLE] because it is a read-only property.

  Using variable annotation overrides 'as const', meaning that all properties become mutable:
  const DYNAMIC_ELEMENT: Record<ElementType, DynamicComponent>= {
    [ELEMENT_TYPE.SIMPLE]: DYNAMIC_COMPONENT.SIMPLE,
    [ELEMENT_TYPE.SVG]: DYNAMIC_COMPONENT.SVG
  } as const;

  DYNAMIC_ELEMENT[ELEMENT_TYPE.SIMPLE] = DYNAMIC_COMPONENT.SVG; => object mutated
*/
export const DYNAMIC_ELEMENT = {
  simple: SimpleDynamicContentComponent,
  img: ImgDynamicContentComponent,
  svg: SvgDynamicContentComponent,
  'linear-chart': LinearChartDynamicContentComponent,
  'not-found': DynamicContentNotFoundComponent,
} as const satisfies Record<ElementType, DynamicComponent>;

export type DynamicElement = ObjectValues<typeof DYNAMIC_ELEMENT>;

@Injectable({
  providedIn: 'root',
})
export class ExampleDynamicContentLoaderService extends DynamicVisualContentLoaderService<ElementType, DynamicElement> {
  public override getDynamicContent(type: ElementType): DynamicElement {
    return DYNAMIC_ELEMENT[type] ?? DYNAMIC_ELEMENT['not-found'];
  }
}
