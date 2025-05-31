import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Site } from 'src/app/models/site.model';
import { Country } from 'src/app/models/country.model';
import { City } from 'src/app/models/city.model';
import { SiteService } from 'src/app/services/site.service';
import { CountryService } from 'src/app/services/country.service';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-sites-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss']
})
export class SitesListComponent implements OnInit {
  sites: Site[] = [];
  filteredSites: Site[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry: string | null = null;
  selectedCity: string | null = null;
  favoritos: string[] = [];

  constructor(
    private siteService: SiteService,
    private countryService: CountryService,
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.loadFavoritos();
    this.loadCountries();
    this.loadSites();
  }

  loadCountries() {
    this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
    });
  }

  onCountryChange() {
    this.selectedCity = null;
    if (this.selectedCountry) {
      this.cityService.getByCountryId(this.selectedCountry).subscribe(cities => {
        this.cities = cities;
      });
    } else {
      this.cities = [];
    }
    this.filterSites();
  }

  onCityChange() {
    this.filterSites();
  }

  loadSites() {
    this.siteService.getAll().subscribe(sites => {
      this.sites = sites;
      this.filterSites();
    });
  }

  filterSites() {
    this.filteredSites = this.sites.filter(site => {
      const matchCountry = !this.selectedCountry || site.ciudad.pais._id === this.selectedCountry;
      const matchCity = !this.selectedCity || site.ciudad._id === this.selectedCity;
      return matchCountry && matchCity;
    });
  }

  loadFavoritos() {
    const fav = localStorage.getItem('favoritos_sitios');
    this.favoritos = fav ? JSON.parse(fav) : [];
  }

  toggleFavorito(siteId: string) {
    const idx = this.favoritos.indexOf(siteId);
    if (idx > -1) {
      this.favoritos.splice(idx, 1);
    } else {
      this.favoritos.push(siteId);
    }
    localStorage.setItem('favoritos_sitios', JSON.stringify(this.favoritos));
  }

  esFavorito(siteId: string): boolean {
    return this.favoritos.includes(siteId);
  }

  clearFilters() {
    this.selectedCountry = null;
    this.selectedCity = null;
    this.cities = [];
    this.filterSites();
  }
}
