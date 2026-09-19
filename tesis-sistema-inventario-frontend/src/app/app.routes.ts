import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutShellComponent } from './shared/components/layout-shell/layout-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutShellComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/pages/product-list/product-list.page').then((m) => m.ProductListPage),
      },
      {
        path: 'catalog/new',
        loadComponent: () =>
          import('./features/catalog/pages/product-form/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'catalog/edit/:id',
        loadComponent: () =>
          import('./features/catalog/pages/product-form/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/catalog/pages/category-list/category-list.page').then((m) => m.CategoryListPage),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/pages/quick-register/quick-register.page').then((m) => m.QuickRegisterPage),
      },
      {
        path: 'inventory/out-register',
        loadComponent: () =>
          import('./features/inventory/pages/out-register/out-register.page').then((m) => m.OutRegisterPage),
      },
      {
        path: 'inventory/history',
        loadComponent: () =>
          import('./features/inventory/pages/movement-history/movement-history.page').then((m) => m.MovementHistoryPage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
