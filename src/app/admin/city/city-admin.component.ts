import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { BaseAdminComponent, COMMON_IMPORTS } from '../shared/base-admin.component';
import { City } from '../../models/city.model';
import { Country } from '../../models/country.model';
import { CityService } from '../../services/city.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-city-admin',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  template: `
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ isEditing ? 'Edit City' : 'Add City' }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <form [formGroup]="form" (ngSubmit)="isEditing ? updateItem() : createItem()">
                  <ion-item>
                    <ion-label position="floating">Name</ion-label>
                    <ion-input formControlName="name" type="text"></ion-input>
                    <ion-note slot="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
                      Name is required
                    </ion-note>
                  </ion-item>

                  <ion-item>
                    <ion-label position="floating">Country</ion-label>
                    <ion-select formControlName="idCountry">
                      <ion-select-option *ngFor="let country of countries" [value]="country.idCountry">
                        {{ country.name }}
                      </ion-select-option>
                    </ion-select>
                    <ion-note slot="error" *ngIf="form.get('idCountry')?.invalid && form.get('idCountry')?.touched">
                      Country is required
                    </ion-note>
                  </ion-item>

                  <div class="ion-padding-top">
                    <ion-button type="submit" expand="block" [disabled]="form.invalid || isLoading">
                      {{ isEditing ? 'Update' : 'Create' }}
                    </ion-button>
                    <ion-button *ngIf="isEditing" type="button" expand="block" fill="outline"
                                (click)="cancelEdit()" [disabled]="isLoading">
                      Cancel
                    </ion-button>
                  </div>
                </form>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Cities</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngIf="isLoading">
                    <ion-label>Loading...</ion-label>
                    <ion-spinner name="dots"></ion-spinner>
                  </ion-item>

                  <ion-item *ngIf="!isLoading && items.length === 0">
                    <ion-label>No cities found</ion-label>
                  </ion-item>

                  <ion-item *ngFor="let city of items">
                    <ion-label>
                      <h2>{{ city.name }}</h2>
                      <p>Country: {{ getCountryName(city.idCountry) }}</p>
                    </ion-label>
                    <ion-buttons slot="end">
                      <ion-button (click)="editItem(city)">
                        <ion-icon name="create-outline"></ion-icon>
                      </ion-button>
                      <ion-button (click)="confirmDelete(city)">
                        <ion-icon name="trash-outline"></ion-icon>
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-list>

                <ion-button expand="block" (click)="loadItems()" [disabled]="isLoading">
                  <ion-icon name="refresh-outline"></ion-icon>
                  Refresh
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class CityAdminComponent extends BaseAdminComponent<City> implements OnInit {
  countries: Country[] = [];

  constructor(
    protected cityService: CityService,
    private countryService: CountryService,
    protected override fb: FormBuilder,
    protected override alertController: AlertController,
    protected override toastController: ToastController
  ) {
    super(cityService, fb, alertController, toastController);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.getAll().subscribe({
      next: (data) => {
        this.countries = data || [];
      },
      error: (error) => {
        console.error('Error loading countries', error);
        this.countries = []; // Ensure countries is initialized even on error
        this.showToast('Error loading countries: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
      },
      complete: () => {
        // Ensure the form is updated with the latest countries
        if (this.form.get('idCountry')?.value && !this.countries.some(c => c.idCountry === this.form.get('idCountry')?.value)) {
          this.form.get('idCountry')?.setValue(null);
        }
      }
    });
  }

  getCountryName(countryId: number): string {
    const country = this.countries.find(c => c.idCountry === countryId);
    return country ? country.name : 'Unknown';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      idCountry: [null, [Validators.required]]
    });
  }

  protected populateForm(item: City): void {
    this.form.patchValue({
      name: item.name,
      idCountry: item.idCountry
    });
  }

  protected getItemId(item: City): number {
    return item.idCity;
  }
}
