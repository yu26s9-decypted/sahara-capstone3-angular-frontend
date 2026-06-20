import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'sign-in',
    renderMode: RenderMode.Server
  },
  {
    path: 'conditions-of-use',
    renderMode: RenderMode.Server
  },
  {
    path: 'privacy-notice',
    renderMode: RenderMode.Server
  },
  {
    path: 'product/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'account',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
