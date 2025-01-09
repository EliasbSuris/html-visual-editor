import { Route } from '@angular/router';
import { VisualEditor2Page } from './visual-editor-2.page';
import { ExampleDynamicContentLoaderService } from './preview-dynamic-content-loader.service';
import { DYNAMIC_VISUAL_CONTENT_LOADER } from './editor/elements/dynamic-visual-content-loader';

export default [
  {
    path: '',
    component: VisualEditor2Page,
    providers: [
      {
        provide: DYNAMIC_VISUAL_CONTENT_LOADER,
        useClass: ExampleDynamicContentLoaderService,
      },
    ],
  },
] satisfies Route[];
