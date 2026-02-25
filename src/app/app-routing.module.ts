import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'customers', loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'invoices', loadChildren: () => import('./features/invoices/invoices.module').then(m => m.InvoicesModule), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'user-management', loadChildren: () => import('./features/user-management/user-management.module').then(m => m.UserManagementModule), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'dashboard-dw', loadChildren: () => import('./features/dashboard-dw/dashboard-dw.module').then(m => m.DashboardDwModule), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'my-orders', loadChildren: () => import('./features/my-orders/my-orders.module').then(m => m.MyOrdersModule), canActivate: [RoleGuard], data: { roles: ['User'] } },
      { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule), canActivate: [RoleGuard], data: { roles: ['User'] } },
      { path: 'my-invoices', loadChildren: () => import('./features/my-invoices/my-invoices.module').then(m => m.MyInvoicesModule), canActivate: [RoleGuard], data: { roles: ['User'] } },
      { path: 'notifications', loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [RoleGuard], data: { roles: ['User'] } },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule), canActivate: [RoleGuard], data: { roles: ['User'] } }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
