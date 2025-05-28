import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Admin Panel</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Logout
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-tabs>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="countries" [routerLink]="['/admin/countries']" routerDirection="root">
            <ion-icon name="flag-outline"></ion-icon>
            <ion-label>Countries</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="cities" [routerLink]="['/admin/cities']" routerDirection="root">
            <ion-icon name="business-outline"></ion-icon>
            <ion-label>Cities</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="sites" [routerLink]="['/admin/sites']" routerDirection="root">
            <ion-icon name="location-outline"></ion-icon>
            <ion-label>Sites</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="dishes" [routerLink]="['/admin/dishes']" routerDirection="root">
            <ion-icon name="restaurant-outline"></ion-icon>
            <ion-label>Dishes</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="users" [routerLink]="['/admin/users']" routerDirection="root">
            <ion-icon name="people-outline"></ion-icon>
            <ion-label>Users</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="visits" [routerLink]="['/admin/visits']" routerDirection="root">
            <ion-icon name="footsteps-outline"></ion-icon>
            <ion-label>Visits</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="famous" [routerLink]="['/admin/famous']" routerDirection="root">
            <ion-icon name="star-outline"></ion-icon>
            <ion-label>Famous</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="tags" [routerLink]="['/admin/tags']" routerDirection="root">
            <ion-icon name="pricetag-outline"></ion-icon>
            <ion-label>Tags</ion-label>
          </ion-tab-button>
        </ion-tab-bar>

        <ion-router-outlet></ion-router-outlet>
      </ion-tabs>
    </ion-content>
  `
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
