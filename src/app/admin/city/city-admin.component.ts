import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { City } from '../../models/city.model';
import { Country } from '../../models/country.model';
import { CityService } from '../../services/city.service';
import { CountryService } from '../../services/country.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-city-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './city-admin.component.html',
  styleUrls: ['./city-admin.component.scss']
})
export class CityAdminComponent extends BaseAdminComponent<City> implements OnInit {
  countries: Country[] = [];

  constructor(
    protected cityService: CityService,
    private countryService: CountryService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController,
    protected override authService: AuthService
  ) {
    super(cityService, fb, alertController, toastController, authService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.getAll().subscribe({
      next: (data) => {
        // Ensure all countries have idCountry and name properties for backward compatibility
        this.countries = (data || []).map(country => {
          let updatedCountry = { ...country };

          // If idCountry is not defined but _id is, use _id as a fallback
          if (country._id === undefined && country._id) {
            updatedCountry._id = country._id;
          }

          // If name is not defined but nombre is, use nombre as a fallback
          if (country.nombre === undefined && country.nombre) {
            updatedCountry.nombre = country.nombre;
          }

          return updatedCountry;
        });
      },
      error: (error) => {
        console.error('Error loading countries', error);
        this.countries = []; // Ensure countries is initialized even on error
        this.showToast('Error loading countries: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      },
      complete: () => {
        // Ensure the form is updated with the latest countries
        if (this.form.get('idCountry')?.value && !this.countries.some(c => c._id === this.form.get('idCountry')?.value)) {
          this.form.get('idCountry')?.setValue(null);
        }
      }
    });
  }

  getCountryName(countryId: string): string {
    // Try to find country by idCountry first, then by _id if idCountry is not found
    const country = this.countries.find(c => c._id === countryId);
    return country ? (country.nombre || country.nombre || 'Unknown') : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      idCountry: [null, [Validators.required]]
    });
  }

  protected populateForm(item: City): void {
    this.form.patchValue({
      name: item.nombre,
      idCountry: item.pais._id
    });
  }

  protected getItemId(item: City): string {
    return item._id;
  }
}
