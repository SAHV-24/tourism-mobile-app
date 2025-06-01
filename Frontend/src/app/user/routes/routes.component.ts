import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit, OnDestroy {
  routes: any[] = [];
  canGoBack = false;

  constructor(private router: Router, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRoutes();
    this.setCanGoBack();
    window.addEventListener('popstate', this.setCanGoBack.bind(this));
  }

  setCanGoBack() {
    this.canGoBack = window.history.state && window.history.state.navigationId > 1;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('popstate', this.setCanGoBack.bind(this));
  }

  loadRoutes() {
    const routesStr = localStorage.getItem('user_routes');
    this.routes = routesStr ? JSON.parse(routesStr) : [];
  }

  getCityName(route: any): string {
    // Toma el nombre de la ciudad del primer sitio de la ruta
    return route.sites && route.sites.length > 0 ? route.sites[0].ciudad.nombre : 'Unknown city';
  }

  viewOnMap(route: any) {
    this.router.navigate(['/user/route-map', route.id]);
  }
}

