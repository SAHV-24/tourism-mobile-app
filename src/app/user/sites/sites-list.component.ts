import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Site } from 'src/app/models/site.model';
import { Country } from 'src/app/models/country.model';
import { City } from 'src/app/models/city.model';
import { SiteService } from 'src/app/services/site.service';
import { CountryService } from 'src/app/services/country.service';
import { CityService } from 'src/app/services/city.service';
import { VisitService } from 'src/app/services/visit.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sites-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss']
})
export class SitesListComponent implements OnInit, OnDestroy {
  sites: Site[] = [];
  filteredSites: Site[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry: string | null = null;
  selectedCity: string | null = null;
  favoritos: string[] = [];
  canGoBack = false;

  constructor(
    private siteService: SiteService,
    private countryService: CountryService,
    private cityService: CityService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastController: ToastController,
    private visitService: VisitService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadFavoritos();
    this.loadCountries();
    this.loadSites();
    this.setCanGoBack();
    window.addEventListener('popstate', this.setCanGoBack.bind(this));
  }

  setCanGoBack() {
    // navigationId solo existe si la navegación fue por Angular Router
    // Si navigationId no existe, es acceso directo o recarga (no hay back)
    const navId = window.history.state && window.history.state.navigationId;
    this.canGoBack = typeof navId === 'number' && navId > 2;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('popstate', this.setCanGoBack.bind(this));
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

  async confirmRegistrarVisita(site: Site) {
    const alert = await this.alertController.create({
      header: 'Registrar visita',
      message: `¿Deseas registrar una visita a ${site.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Registrar',
          handler: () => this.registrarVisita(site)
        }
      ]
    });
    await alert.present();
  }

  registrarVisita(site: Site) {
    if (!this.authService.currentUserId) {
      this.toastController.create({
        message: 'No se pudo obtener el usuario actual',
        duration: 2000,
        color: 'danger'
      }).then(t => t.present());
      return;
    }
    if (!navigator.geolocation) {
      this.toastController.create({
        message: 'Geolocalización no soportada',
        duration: 2000,
        color: 'danger'
      }).then(t => t.present());
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const visita = {
          usuario: String(this.authService.currentUserId),
          sitio: site._id,
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          fechaYHora: new Date().toISOString()
        };
        this.visitService.create(visita).subscribe({
          next: () => {
            this.toastController.create({
              message: 'Visita registrada',
              duration: 2000,
              color: 'success'
            }).then(t => t.present());
          },
          error: () => {
            this.toastController.create({
              message: 'Error al registrar visita',
              duration: 2000,
              color: 'danger'
            }).then(t => t.present());
          }
        });
      },
      () => {
        this.toastController.create({
          message: 'No se pudo obtener tu ubicación',
          duration: 2000,
          color: 'danger'
        }).then(t => t.present());
      }
    );
  }
}
