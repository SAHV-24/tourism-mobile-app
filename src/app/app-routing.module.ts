import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
  Routes,
} from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { ADMIN_ROUTES } from './admin/admin-routing';
import { TopSitiosComponent } from './queries/top-sitios.component';
import { PlatosPorUbicacionComponent } from './queries/platos-por-ubicacion.component';
import { USER_ROUTES } from './user/user-routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'queries/most-tagged-famous',
    loadComponent: () =>
      import('./queries/famosos-mas-taggeados.component').then(
        (m) => m.FamososMasTaggeadosComponent
      ),
  },
  {
    path: 'queries/users-most-visits',
    loadComponent: () =>
      import('./queries/usuarios-mas-visitas.component').then(
        (m) => m.UsuariosMasVisitasComponent
      ),
  },
  {
    path: 'queries/dishes-by-unique-users',
    loadComponent: () =>
      import('./queries/platos-por-usuarios-unicos.component').then(
        (m) => m.PlatosPorUsuariosUnicosComponent
      ),
  },
  {
    path: 'queries/top-sites',
    loadComponent: () =>
      import('./queries/top-sitios.component').then(
        (m) => m.TopSitiosComponent
      ),
  },
  {
    path: 'dishes-by-location',
    loadComponent: () =>
      import('./queries/platos-por-ubicacion.component').then(
        (m) => m.PlatosPorUbicacionComponent
      ),
  },
  { path: 'top-sites', component: TopSitiosComponent },
  { path: 'dishes-by-location', component: PlatosPorUbicacionComponent },
  { path: 'queries/top-sites', component: TopSitiosComponent },
  {
    path: 'queries/dishes-by-location',
    component: PlatosPorUbicacionComponent,
  },
  ...ADMIN_ROUTES,
  ...USER_ROUTES,
];

export const appRouting = [
  provideRouter(routes, withPreloading(PreloadAllModules)),
];
