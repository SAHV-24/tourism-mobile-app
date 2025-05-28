import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/admin-layout.component';
import { CountryAdminComponent } from './country/country-admin.component';
import { CityAdminComponent } from './city/city-admin.component';
import { SiteAdminComponent } from './site/site-admin.component';
import { DishAdminComponent } from './dish/dish-admin.component';
import { UserAdminComponent } from './user/user-admin.component';
import { VisitAdminComponent } from './visit/visit-admin.component';
import { FamousAdminComponent } from './famous/famous-admin.component';
import { TagAdminComponent } from './tag/tag-admin.component';
import { AuthGuard } from '../services/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'countries', pathMatch: 'full' },
      { path: 'countries', component: CountryAdminComponent },
      { path: 'cities', component: CityAdminComponent },
      { path: 'sites', component: SiteAdminComponent },
      { path: 'dishes', component: DishAdminComponent },
      { path: 'users', component: UserAdminComponent },
      { path: 'visits', component: VisitAdminComponent },
      { path: 'famous', component: FamousAdminComponent },
      { path: 'tags', component: TagAdminComponent }
    ]
  }
];
