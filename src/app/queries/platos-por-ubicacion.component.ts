import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { CityService } from '../services/city.service';
import { QueryService } from '../services/query.service';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';
import { PlatoTaggeado } from '../models/queries.models';

@Component({
  selector: 'app-platos-por-ubicacion',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="home-title">Top 10 Sites by Country</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Country</ion-label>
        <ion-select
          [ngModel]="selectedCountryId"
          (ngModelChange)="onCountryChange($event)"
        >
          <ion-select-option
            *ngFor="let country of countries"
            [value]="country._id"
            >{{ country.nombre }}</ion-select-option
          >
        </ion-select>
      </ion-item>
      <ion-item *ngIf="cities.length > 0">
        <ion-label>City</ion-label>
        <ion-select
          [ngModel]="selectedCityId"
          (ngModelChange)="onCityChange($event)"
        >
          <ion-select-option *ngFor="let city of cities" [value]="city._id">{{
            city.nombre
          }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-list *ngIf="dishes.length > 0">
        <ion-item *ngFor="let dish of dishes; let i = index">
          <ion-label>
            <h3>{{ i + 1 }}. {{ dish.plato && dish.plato.nombre ? dish.plato.nombre : 'Unknown' }}</h3>
            <p>Tags: {{ dish.totalTags }}</p>
            <p>Site: {{ dish.plato && dish.plato.sitio ? dish.plato.sitio : 'Unknown' }}</p>
            <p>Price: {{ dish.plato && dish.plato.precio != null ? (dish.plato.precio | currency : 'EUR') : 'N/A' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div
        *ngIf="!loading && dishes.length === 0 && selectedCountryId"
        class="no-data"
      >
        <ion-text color="medium">No data found.</ion-text>
      </div>
      <ion-spinner *ngIf="loading"></ion-spinner>
    </ion-content>
  `,
  styles: [
    `
      ion-item {
        margin-bottom: 10px;
      }
      .no-data {
        text-align: center;
        margin-top: 2em;
      }
    `,
  ],
})
export class PlatosPorUbicacionComponent implements OnInit {
  countries: Country[] = [];
  cities: City[] = [];
  dishes: PlatoTaggeado[] = [];
  selectedCountryId: string | null = null;
  selectedCityId: string | null = null;
  loading = false;

  constructor(
    private countryService: CountryService,
    private cityService: CityService,
    private queryService: QueryService
  ) {}

  ngOnInit() {
    this.countryService
      .getAll()
      .subscribe((countries) => (this.countries = countries));
  }

  onCountryChange(countryId: string) {
    this.selectedCountryId = countryId;
    this.selectedCityId = null;
    this.cities = [];
    this.dishes = [];
    if (this.selectedCountryId) {
      this.cityService
        .getByCountryId(this.selectedCountryId)
        .subscribe((cities) => (this.cities = cities));
      this.fetchDishes();
    }
  }

  onCityChange(cityId: string) {
    this.selectedCityId = cityId;
    this.fetchDishes();
  }

  fetchDishes() {
    this.loading = true;
    const params: any = { paisId: this.selectedCountryId };
    if (this.selectedCityId) params.ciudadId = this.selectedCityId;
    this.queryService.getPlatosPorUbicacion(params).subscribe({
      next: (data) => {
        console.log('Fetched dishes:', data);
        this.dishes = data || [];
        this.loading = false;
      },
      error: () => {
        this.dishes = [];
        this.loading = false;
      },
    });
  }
}
