import {Routes} from "@angular/router";
import {RoleGuard} from "../services/role.guard";
import {SitesListComponent} from "./sites/sites-list.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {RoutesComponent} from "./routes/routes.component";
import { RouteMapComponent } from './route-map/route-map.component';
import { MyVisitsComponent } from './sites/visits/my-visits/my-visits.component';
import { FamousListComponent } from './famous/famous-list.component';

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    canActivate: [RoleGuard],
    data: { requiredRole: 'Administrador' },
    children: [
      { path: '', redirectTo: 'countries', pathMatch: 'full' },
      { path: 'sites', component: SitesListComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'routes', component: RoutesComponent},
      { path: 'route-map/:id', component: RouteMapComponent },
      { path: 'my-visits', component: MyVisitsComponent },
      { path: 'famous', component: FamousListComponent }
    ]
  }
];
