import { InjectionToken } from '@angular/core';

export abstract class DynamicVisualContentLoaderService<T = any, R = any> {
  public abstract getDynamicContent(type: T): R;
}

export const DYNAMIC_VISUAL_CONTENT_LOADER = new InjectionToken<DynamicVisualContentLoaderService>(
  'Dynamic visual content loader service'
);
