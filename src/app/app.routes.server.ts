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
    path: 'check-out',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
