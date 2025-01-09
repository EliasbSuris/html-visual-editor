import { Routes } from '@angular/router';
import { ObjectValues } from '@custom-types/utils.type';

export const APP_ROUTE = {
  VISUAL_EDITOR: 'visual-editor',
  VISUAL_EDITOR_V2: 'visual-editor-v2',
} as const;

export type AppRoute = ObjectValues<typeof APP_ROUTE>;

export const DEFAULT_ROUTE: AppRoute = APP_ROUTE.VISUAL_EDITOR_V2;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_ROUTE,
  },
  {
    path: APP_ROUTE.VISUAL_EDITOR,
    loadChildren: () => import('./visual-editor/visual-editor.routes'),
  },
  {
    path: APP_ROUTE.VISUAL_EDITOR_V2,
    loadChildren: () => import('./visual-editor-2/visual-editor-2.routes'),
  },
];
