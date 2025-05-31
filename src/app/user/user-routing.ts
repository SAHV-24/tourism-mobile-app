import {Routes} from "@angular/router";
import {RoleGuard} from "../services/role.guard";
import {SitesComponent} from "./sites/sites.component";
import {SitesListComponent} from "./sites/sites-list.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {RoutesComponent} from "./routes/routes.component";
import {TagListComponent} from "./tags/tag-list.component";
import {MyTagsComponent} from "./tags/my-tags.component";
import {TagPageComponent as TagCreateComponent} from "./tags/tag-page/tag-page.component";
import { AuthGuard } from "../services";

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    canActivate: [RoleGuard],
    data: { requiredRole: 'Administrador' },
    children: [
      { path: '', redirectTo: 'countries', pathMatch: 'full' },
      { path: 'sites', component: SitesListComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'routes', component: RoutesComponent}
    ]
  }
];
