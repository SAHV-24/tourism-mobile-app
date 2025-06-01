import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DishService } from 'src/app/services/dish.service';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { CityService } from 'src/app/services/city.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dishes-list',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/folder/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Dishes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ng-container *ngIf="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading dishes...</p>
      </ng-container>
      <ng-container *ngIf="error">
        <ion-text color="danger">{{ error }}</ion-text>
      </ng-container>
      <ion-item>
        <ion-label>Country</ion-label>
        <ion-select [(ngModel)]="selectedCountry" (ionChange)="onCountryChange()">
          <ion-select-option value="">All</ion-select-option>
          <ion-select-option *ngFor="let country of countries" [value]="country._id">{{ country.nombre }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label>City</ion-label>
        <ion-select [(ngModel)]="selectedCity" (ionChange)="filterDishes()">
          <ion-select-option value="">All</ion-select-option>
          <ion-select-option *ngFor="let city of cities" [value]="city._id">{{ city.nombre }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-list *ngIf="!loading && !error">
        <ion-item *ngFor="let dish of filteredDishes">
          <ion-avatar slot="start" *ngIf="dish.fotoUrl">
            <img [src]="dish.fotoUrl" alt="Dish image" />
          </ion-avatar>
          <ion-label>
            <h2>{{ dish.nombre }}</h2>
            <p *ngIf="dish.descripcion">{{ dish.descripcion }}</p>
            <p *ngIf="dish.precio">Price: {{ dish.precio | currency:'EUR' }}</p>
            <p *ngIf="dish.sitio && dish.sitio.ciudad && dish.sitio.ciudad.pais">
              <ion-icon name="location-outline"></ion-icon>
              {{ dish.sitio.ciudad.nombre }}, {{ dish.sitio.ciudad.pais.nombre }}
            </p>
            <a *ngIf="dish.sitio" (click)="goToSites($event)" class="site-link">View site</a>
          </ion-label>
        </ion-item>
      </ion-list>
      <div *ngIf="!loading && !error && !filteredDishes.length" class="no-dishes">
        <ion-text color="medium">No dishes found.</ion-text>
      </div>
    </ion-content>
  `,
  styles: [`
    .no-dishes {
      text-align: center;
      margin-top: 2em;
      font-size: 1.1rem;
    }
    ion-list {
      margin-top: 18px;
    }
    ion-item h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #3730a3;
    }
    ion-item p {
      font-size: 1rem;
      color: #6366f1;
      opacity: 0.85;
    }
    .site-link {
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;
      font-size: 0.98rem;
      margin-top: 4px;
      display: inline-block;
    }
  `]
})
export class DishesListComponent implements OnInit {
  dishes: any[] = [];
  filteredDishes: any[] = [];
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private dishService: DishService,
    private countryService: CountryService,
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
    });
    this.dishService.getAll().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.filterDishes();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading dishes';
        this.loading = false;
      },
    });
  }

  onCountryChange() {
    this.selectedCity = '';
    if (this.selectedCountry) {
      this.cityService.getByCountryId(this.selectedCountry).subscribe(cities => {
        this.cities = cities;
        this.filterDishes();
      });
    } else {
      this.cities = [];
      this.filterDishes();
    }
  }

  filterDishes() {
    this.filteredDishes = this.dishes.filter(dish => {
      const matchCountry = !this.selectedCountry || (dish.sitio && dish.sitio.ciudad && dish.sitio.ciudad.pais && dish.sitio.ciudad.pais._id === this.selectedCountry);
      const matchCity = !this.selectedCity || (dish.sitio && dish.sitio.ciudad && dish.sitio.ciudad._id === this.selectedCity);
      return matchCountry && matchCity;
    });
  }

  goToSites(event: Event) {
    event.preventDefault();
    this.router.navigate(['/user/sites']);
  }
}
