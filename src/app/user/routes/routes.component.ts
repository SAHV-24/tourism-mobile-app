import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {
  routes: any[] = [];

  ngOnInit() {
    this.loadRoutes();
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
    // Aquí irá la lógica para mostrar la ruta en Google Maps
    alert('Map view coming soon!');
  }
}

