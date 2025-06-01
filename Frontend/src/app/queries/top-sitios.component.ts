import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CountryService } from '../services/country.service';
import { QueryService } from '../services/query.service';
import { TopSitio } from '../models/queries.models';
import { Country } from '../models/country.model';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-sitios',
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
      <ion-list *ngIf="topSites.length > 0">
        <ion-item *ngFor="let sitio of topSites; let i = index">
          <ion-label>
            <h3>{{ i + 1 }}. {{ sitio.sitioInfo.nombre }}</h3>
            <p>Visits: {{ sitio.totalVisitas }}</p>
            <p>City: {{ sitio.ciudadInfo.nombre }}</p>
            <p>Type: {{ sitio.sitioInfo.tipoSitio }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div
        *ngIf="!loading && topSites.length === 0 && selectedCountryId"
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
export class TopSitiosComponent implements OnInit {
  countries: Country[] = [];
  topSites: TopSitio[] = [];
  selectedCountryId: string | null = null;
  loading = false;

  constructor(
    private countryService: CountryService,
    private queryService: QueryService
  ) {}

  ngOnInit() {
    this.countryService
      .getAll()
      .subscribe((countries) => (this.countries = countries));
  }

  onCountryChange(countryId: string) {
    this.selectedCountryId = countryId;
    this.topSites = [];
    if (this.selectedCountryId) {
      this.loading = true;
      this.queryService.getTopSitios(this.selectedCountryId).subscribe({
        next: (data) => {
          this.topSites = data || [];
          this.loading = false;
        },
        error: () => {
          this.topSites = [];
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }
}
