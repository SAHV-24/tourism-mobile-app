import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule, IonicModule, GoogleMapsModule],
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
})
export class RouteMapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined;

  route: any = null;
  mapOptions: google.maps.MapOptions = {
    zoom: 13,
    mapTypeId: 'roadmap',
  };
  center: google.maps.LatLngLiteral = { lat: 3.4516, lng: -76.5320 };
  directionsRenderer: google.maps.DirectionsRenderer | undefined;
  directionsService: google.maps.DirectionsService | undefined;

  constructor(private routeParam: ActivatedRoute) {}

  ngOnInit() {
    this.routeParam.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadRoute(id);
      }
    });
  }

  loadRoute(id: string) {
    const routesStr = localStorage.getItem('user_routes');
    if (!routesStr) return;
    const routes = JSON.parse(routesStr);
    this.route = routes.find((r: any) => r.id == id);
    if (this.route) {
      this.setMapData();
    }
  }

  setMapData() {
    // Centro en el punto de inicio
    this.center = this.route.start;
    setTimeout(() => this.drawRoute(), 500);
  }

  drawRoute() {
    if (!window.google || !this.route) return;
    if (!this.directionsService) this.directionsService = new google.maps.DirectionsService();
    if (!this.directionsRenderer) this.directionsRenderer = new google.maps.DirectionsRenderer();
    if (this.map && this.directionsRenderer) {
      this.directionsRenderer.setMap(this.map.googleMap!);
    }
    // Construir waypoints
    const waypoints = (this.route.sites || [])
      .filter((site: any) => site.ubicacion)
      .map((site: any) => {
        const [lat, lng] = site.ubicacion.split(',').map(Number);
        return {
          location: { lat, lng },
          stopover: true
        };
      });
    // Definir origen y destino
    const origin = this.route.start;
    const destination = waypoints.length > 0 ? waypoints[waypoints.length - 1].location : origin;
    const routeWaypoints = waypoints.length > 1 ? waypoints.slice(0, -1) : [];
    this.directionsService.route({
      origin,
      destination,
      waypoints: routeWaypoints,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK' && result) {
        this.directionsRenderer!.setDirections(result);
      }
    });
  }
}
