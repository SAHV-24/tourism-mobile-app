import { PreloadAllModules, provideRouter, withPreloading, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { ADMIN_ROUTES } from './admin/admin-routing';
import {USER_ROUTES} from "./user/user-routing";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'folder/:id',
    loadComponent: () => import('./folder/folder.page').then(m => m.FolderPage),
    canActivate: [AuthGuard]
  },
  ...ADMIN_ROUTES,
  ...USER_ROUTES
];

export const appRouting = [
  provideRouter(routes, withPreloading(PreloadAllModules))
];
