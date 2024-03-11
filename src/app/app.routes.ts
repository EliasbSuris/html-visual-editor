import { Routes } from '@angular/router';
import { ObjectValues } from '@custom-types/utils.type';

export const APP_ROUTE = {
  VISUAL_EDITOR: 'visual-editor',
} as const;

export type AppRoute = ObjectValues<typeof APP_ROUTE>;

export const DEFAULT_ROUTE: AppRoute = APP_ROUTE.VISUAL_EDITOR;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_ROUTE,
  },
  {
    path: APP_ROUTE.VISUAL_EDITOR,
    loadChildren: () => import('./pages/visual-editor/visual-editor.routes'),
  },
];
