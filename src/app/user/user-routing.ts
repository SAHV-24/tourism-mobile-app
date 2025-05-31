import {Routes} from "@angular/router";
import {RoleGuard} from "../services/role.guard";
import {SitesComponent} from "./sites/sites.component";

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    canActivate: [RoleGuard],
    data: { requiredRole: 'Administrador' },
    children: [
      { path: '', redirectTo: 'countries', pathMatch: 'full' },
      { path: 'sites', component: SitesComponent }
    ]
  }
];
