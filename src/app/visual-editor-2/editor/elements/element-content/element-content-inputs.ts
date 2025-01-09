import { ObjectValues } from '../../../../types/utils.type';

export const DYNAMIC_CONTENT_INPUTS = {
  ELEMENT: 'element',
  METADATA: 'metadata'
} as const;

export type DynamicContentInput = ObjectValues<typeof DYNAMIC_CONTENT_INPUTS>;
