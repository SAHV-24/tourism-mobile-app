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
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Site[] = [];
  filteredFavorites: Site[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry: string | null = null;
  selectedCity: string | null = null;
  favoritosIds: string[] = [];

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

  loadFavoritos() {
    const fav = localStorage.getItem('favoritos_sitios');
    this.favoritosIds = fav ? JSON.parse(fav) : [];
  }

  loadCountries() {
    this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
    });
  }

  loadSites() {
    this.siteService.getAll().subscribe(sites => {
      this.favorites = sites.filter(site => this.favoritosIds.includes(site._id));
      this.filterFavorites();
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
    this.filterFavorites();
  }

  onCityChange() {
    this.filterFavorites();
  }

  filterFavorites() {
    this.filteredFavorites = this.favorites.filter(site => {
      const matchCountry = !this.selectedCountry || site.ciudad.pais._id === this.selectedCountry;
      const matchCity = !this.selectedCity || site.ciudad._id === this.selectedCity;
      return matchCountry && matchCity;
    });
  }

  toggleFavorito(siteId: string) {
    const idx = this.favoritosIds.indexOf(siteId);
    if (idx > -1) {
      this.favoritosIds.splice(idx, 1);
    } else {
      this.favoritosIds.push(siteId);
    }
    localStorage.setItem('favoritos_sitios', JSON.stringify(this.favoritosIds));
    this.loadSites();
  }

  esFavorito(siteId: string): boolean {
    return this.favoritosIds.includes(siteId);
  }

  clearFilters() {
    this.selectedCountry = null;
    this.selectedCity = null;
    this.cities = [];
    this.filterFavorites();
  }
}
