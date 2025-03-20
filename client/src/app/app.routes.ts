import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/pages/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],  // Protect these routes
    component: LayoutComponent,
    children: [
      {
        path: 'dashboards/analytics',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('./pages/ui/components/components-overview/components-overview.component').then(
            (m) => m.ComponentsOverviewComponent
          )
      },
      {
        path: 'lagom',
        children: [
          {
            path: 'admin',
            loadChildren: () => import('./pages/lagom/admin/admin.routes')
          },
          {
            path: 'menu',
            loadChildren: () => import('./pages/lagom/menu/menu.routes')
          }
        ]
      },
      {
        path: 'pages',
        children: [
          {
            path: 'pricing',
            loadComponent: () =>
              import('./pages/pages/pricing/pricing.component').then(
                (m) => m.PricingComponent
              )
          },
          {
            path: 'faq',
            loadComponent: () =>
              import('./pages/pages/faq/faq.component').then(
                (m) => m.FaqComponent
              )
          },
          {
            path: 'guides',
            loadComponent: () =>
              import('./pages/pages/guides/guides.component').then(
                (m) => m.GuidesComponent
              )
          },
          {
            path: 'invoice',
            loadComponent: () =>
              import('./pages/pages/invoice/invoice.component').then(
                (m) => m.InvoiceComponent
              )
          },
          {
            path: 'error-404',
            loadComponent: () =>
              import('./pages/pages/errors/error-404/error-404.component').then(
                (m) => m.Error404Component
              )
          },
          {
            path: 'error-500',
            loadComponent: () =>
              import('./pages/pages/errors/error-500/error-500.component').then(
                (m) => m.Error500Component
              )
          }
        ]
      },
      {
        path: 'ui',
        children: [
          {
            path: 'components',
            loadChildren: () =>
              import('./pages/ui/components/components.routes')
          },
          {
            path: 'forms/form-elements',
            loadComponent: () =>
              import(
                './pages/ui/forms/form-elements/form-elements.component'
              ).then((m) => m.FormElementsComponent)
          },
          {
            path: 'forms/form-wizard',
            loadComponent: () =>
              import('./pages/ui/forms/form-wizard/form-wizard.component').then(
                (m) => m.FormWizardComponent
              )
          },
          {
            path: 'icons',
            loadChildren: () => import('./pages/ui/icons/icons.routes')
          },
          {
            path: 'page-layouts',
            loadChildren: () =>
              import('./pages/ui/page-layouts/page-layouts.routes')
          }
        ]
      },
      {
        path: 'documentation',
        loadChildren: () => import('./pages/documentation/documentation.routes')
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  }
];
